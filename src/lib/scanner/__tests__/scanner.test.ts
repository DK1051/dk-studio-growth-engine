import { describe, expect, it } from "bun:test";

import { analyzeHtml } from "../site";
import { buildFindings, buildScores, classifyBusiness } from "../findings";
import { normalizeUrl, rateLimit } from "../guards";
import type { BusinessProfile, CompetitorEntry, SiteChecks } from "../types";

function seed(over: Partial<SiteChecks> = {}): SiteChecks {
  return {
    finalUrl: "https://example-restaurant.ca/",
    reachable: true,
    https: true,
    status: 200,
    ttfbMs: 420,
    htmlBytes: 48_000,
    title: null,
    metaDescription: null,
    ogImage: null,
    favicon: false,
    viewportMeta: false,
    h1: null,
    telLink: false,
    mailtoLink: false,
    orderingProviders: [],
    bookingProviders: [],
    socialLinks: [],
    menuLink: "none",
    hoursOnPage: false,
    footerYear: null,
    jsShell: false,
    contactFormLikely: false,
    ...over,
  };
}

/* Fixture: an old-school restaurant page with the classic problems. */
const RESTAURANT_HTML = `
<!doctype html><html><head>
<title>Golden Wok Restaurant - Vancouver</title>
</head><body>
<h1>Golden Wok</h1>
<p>Authentic cuisine since 1998. Open Mon-Sat 11:30am to 9pm.</p>
<a href="/files/menu-2019.pdf">Our Menu</a>
<a href="https://www.facebook.com/goldenwok">Facebook</a>
<p>Call us: 604-555-0188</p>
<footer>&copy; 2021 Golden Wok. All rights reserved.</footer>
</body></html>`;

/* Fixture: a JS shell. */
const SHELL_HTML = `<!doctype html><html><head><script src="/a.js"></script><script src="/b.js"></script></head><body><div id="root"></div></body></html>`;

const PROFILE: BusinessProfile = {
  placeId: "p1",
  name: "Golden Wok",
  address: "123 Main St, Vancouver",
  phone: "(604) 555-0188",
  rating: 4.1,
  reviewCount: 41,
  websiteUri: "https://example-restaurant.ca/",
  primaryType: "chinese_restaurant",
  photoUrls: [],
  photoCount: 3,
  hoursKnown: true,
  openNow: true,
  reviews: [{ text: "Great noodles", rating: 5, author: "A" }],
};

const COMPETITORS: CompetitorEntry[] = [
  { name: "Golden Wok", rating: 4.1, reviewCount: 41, hasWebsite: true, self: true },
  { name: "Rival A", rating: 4.6, reviewCount: 312, hasWebsite: true },
  { name: "Rival B", rating: 4.4, reviewCount: 178, hasWebsite: true },
  { name: "Rival C", rating: 4.2, reviewCount: 96, hasWebsite: false },
];

describe("analyzeHtml", () => {
  const r = analyzeHtml(RESTAURANT_HTML, seed());

  it("finds title, h1, hours, footer year", () => {
    expect(r.title).toContain("Golden Wok");
    expect(r.h1).toBe("Golden Wok");
    expect(r.hoursOnPage).toBe(true);
    expect(r.footerYear).toBe(2021);
  });

  it("detects PDF menu and missing conversion paths", () => {
    expect(r.menuLink).toBe("pdf");
    expect(r.telLink).toBe(false);
    expect(r.orderingProviders).toEqual([]);
    expect(r.metaDescription).toBeNull();
  });

  it("detects social links", () => {
    expect(r.socialLinks).toContain("facebook.com");
  });

  it("flags JS shells", () => {
    const s = analyzeHtml(SHELL_HTML, seed());
    expect(s.jsShell).toBe(true);
  });
});

describe("buildFindings — ruled hierarchy", () => {
  const kind = classifyBusiness(PROFILE.primaryType);
  const site = analyzeHtml(RESTAURANT_HTML, seed());
  const { findings, strongBasics } = buildFindings(kind, site, PROFILE, COMPETITORS);

  it("classifies a restaurant", () => {
    expect(kind).toBe("food");
  });

  it("leads with class 1-4, never class 5", () => {
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.cls).toBeLessThanOrEqual(4);
    expect(strongBasics).toBe(false);
  });

  it("surfaces at least 1-2 findings from classes 1-4 (the ruling)", () => {
    const lead = findings.filter((f) => f.cls <= 4);
    expect(lead.length).toBeGreaterThanOrEqual(2);
  });

  it("finds the ordering blocker and PDF menu", () => {
    const titles = findings.map((f) => f.title);
    expect(titles).toContain("No path to order");
    expect(titles).toContain("Menu is a PDF");
  });

  it("finds the competitive review gap with evidence", () => {
    const comp = findings.find((f) => f.cls === 2);
    expect(comp).toBeDefined();
    expect(comp!.evidence).toContain("312");
    expect(comp!.evidence).toContain("41");
  });

  it("keeps the footer year as a footnote, not a headline", () => {
    const footer = findings.find((f) => f.title.startsWith("Footer says"));
    expect(footer).toBeDefined();
    expect(footer!.cls).toBe(5);
  });

  it("every finding carries evidence and a customer cost", () => {
    for (const f of findings) {
      expect(f.evidence.length).toBeGreaterThan(10);
      expect(f.customerCost.length).toBeGreaterThan(10);
    }
  });
});

describe("buildFindings — strong basics honesty", () => {
  it("reports strongBasics when classes 1-4 are clean", () => {
    const site = seed({
      title: "T",
      metaDescription: "D",
      h1: "H",
      viewportMeta: true,
      favicon: true,
      telLink: true,
      hoursOnPage: true,
      menuLink: "html",
      orderingProviders: ["DoorDash"],
      contactFormLikely: true,
      footerYear: new Date().getFullYear(),
      ogImage: "x",
    });
    const profile: BusinessProfile = { ...PROFILE, photoCount: 12, hoursKnown: true };
    const comps: CompetitorEntry[] = [
      { name: "Golden Wok", rating: 4.8, reviewCount: 500, hasWebsite: true, self: true },
      { name: "Rival A", rating: 4.5, reviewCount: 312, hasWebsite: true },
      { name: "Rival B", rating: 4.4, reviewCount: 178, hasWebsite: true },
    ];
    const { findings, strongBasics } = buildFindings("food", site, profile, comps);
    expect(strongBasics).toBe(true);
    expect(findings.every((f) => f.cls === 5)).toBe(true);
  });
});

describe("buildScores", () => {
  it("produces four dimensions with observable bases", () => {
    const site = analyzeHtml(RESTAURANT_HTML, seed());
    const kind = classifyBusiness(PROFILE.primaryType);
    const { findings } = buildFindings(kind, site, PROFILE, COMPETITORS);
    const { scores, overall } = buildScores(kind, site, PROFILE, null, findings);
    expect(scores).toHaveLength(4);
    expect(overall).toBeGreaterThan(0);
    for (const s of scores) {
      expect(s.value).toBeGreaterThanOrEqual(5);
      expect(s.value).toBeLessThanOrEqual(98);
      expect(s.basis.length).toBeGreaterThan(0);
    }
  });
});

describe("guards", () => {
  it("normalizes bare domains", () => {
    expect(normalizeUrl("northerncafe.ca").hostname).toBe("northerncafe.ca");
  });
  it("blocks private and local addresses", () => {
    expect(() => normalizeUrl("http://localhost:3000")).toThrow();
    expect(() => normalizeUrl("http://192.168.1.1")).toThrow();
    expect(() => normalizeUrl("http://10.0.0.5/x")).toThrow();
    expect(() => normalizeUrl("ftp://example.com")).toThrow();
    expect(() => normalizeUrl("http://127.0.0.1")).toThrow();
    expect(() => normalizeUrl("http://8.8.8.8")).toThrow();
  });
  it("rate limits per key", () => {
    for (let i = 0; i < 6; i++) expect(rateLimit("t:me", 6, 1000)).toBe(true);
    expect(rateLimit("t:me", 6, 1000)).toBe(false);
    expect(rateLimit("t:other", 6, 1000)).toBe(true);
  });
});
