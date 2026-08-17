/**
 * Finding engine — encodes the ruled report hierarchy:
 *   1 Conversion blockers lead. 2 Competitive gaps. 3 Profile gaps.
 *   4 Directionality. 5 Small fixes are footnotes, never headlines.
 * Every finding carries observed evidence and a customer-cost line.
 * If classes 1-4 produce nothing, the report says "strong basics" honestly.
 */

import type {
  BusinessProfile,
  CompetitorEntry,
  DimensionScore,
  Finding,
  PsiMetrics,
  SiteChecks,
} from "./types";

const FOOD_TYPES = /restaurant|cafe|coffee|bakery|bar|food|noodle|pizza|sushi|diner|takeaway|meal/i;
const SERVICE_TYPES =
  /plumb|roof|electric|hvac|contractor|repair|dentist|dental|doctor|clinic|lawyer|account|clean|mover|locksmith|landscap|auto|mechanic|salon|barber|spa/i;

export type BizKind = "food" | "service" | "other";

export function classifyBusiness(primaryType: string | null): BizKind {
  if (!primaryType) return "other";
  if (FOOD_TYPES.test(primaryType)) return "food";
  if (SERVICE_TYPES.test(primaryType)) return "service";
  return "other";
}

export function buildFindings(
  kind: BizKind,
  site: SiteChecks | null,
  profile: BusinessProfile | null,
  competitors: CompetitorEntry[],
): { findings: Finding[]; strongBasics: boolean } {
  const out: Finding[] = [];
  const currentYear = new Date().getFullYear();

  /* ---------------- Class 1 — conversion blockers ---------------- */
  if (site?.reachable && !site.jsShell) {
    if (kind === "food") {
      if (site.orderingProviders.length === 0) {
        out.push({
          cls: 1,
          title: "No path to order",
          evidence: "The homepage links no ordering service and no direct order flow.",
          customerCost: "A hungry customer ready to order has nothing to click. They order from whoever is one tap away.",
        });
      }
      if (site.menuLink === "pdf") {
        out.push({
          cls: 1,
          title: "Menu is a PDF",
          evidence: "The only menu link on the page opens a PDF file.",
          customerCost: "On a phone, a PDF menu means pinching and squinting. Many people give up before they pick a dish.",
        });
      } else if (site.menuLink === "none") {
        out.push({
          cls: 1,
          title: "No menu on the site",
          evidence: "No menu link was found on the homepage.",
          customerCost: "The number one thing a restaurant visitor came for is not there.",
        });
      }
    }
    if (kind === "service" && !site.contactFormLikely && !site.telLink) {
      out.push({
        cls: 1,
        title: "No path to a quote",
        evidence: "No contact form and no tap-to-call link on the homepage.",
        customerCost: "Someone who needs the job done today cannot reach you in one tap. They call the next result instead.",
      });
    }
    if (!site.telLink && (profile?.phone || kind !== "other")) {
      out.push({
        cls: 1,
        title: "Phone number is not tap-to-call",
        evidence: "No tel: link found, so on mobile the number cannot be tapped.",
        customerCost: "Mobile visitors have to memorize and retype your number to call you.",
      });
    }
    if (!site.hoursOnPage && kind !== "other") {
      out.push({
        cls: 1,
        title: "Hours are not on the page",
        evidence: "No opening hours were found in the page text.",
        customerCost: "People check hours before they come. When hours are missing, some do not risk the trip.",
      });
    }
  }
  if (site && !site.reachable) {
    out.push({
      cls: 1,
      title: "The website did not load",
      evidence: `Request ${site.status ? `returned status ${site.status}` : "failed"} during the scan.`,
      customerCost: "Every customer who clicks your link right now hits a dead end.",
    });
  }
  if (site?.reachable && !site.https) {
    out.push({
      cls: 1,
      title: "Site is not secure (no HTTPS)",
      evidence: "The site only answers over plain http.",
      customerCost: "Browsers mark the page 'Not secure' next to your name, and some visitors leave right there.",
    });
  }

  /* ---------------- Class 2 — competitive gap ---------------- */
  const self = competitors.find((c) => c.self);
  const rivals = competitors.filter((c) => !c.self && c.reviewCount != null);
  if (self && rivals.length >= 2) {
    const behindAll =
      self.reviewCount != null && rivals.every((r) => (r.reviewCount ?? 0) > (self.reviewCount ?? 0));
    const topRival = rivals[0];
    if (behindAll && topRival) {
      out.push({
        cls: 2,
        title: "Neighbors are out-reviewing you",
        evidence: `${topRival.name} shows ${topRival.reviewCount} Google reviews nearby, you show ${self.reviewCount}.`,
        customerCost: "When people compare on the map, the bigger review count usually gets the visit.",
      });
    }
    const ratingGap =
      self.rating != null && rivals.some((r) => (r.rating ?? 0) >= (self.rating ?? 0) + 0.4);
    if (ratingGap) {
      const best = [...rivals].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]!;
      out.push({
        cls: 2,
        title: "Rating gap against nearby competition",
        evidence: `${best.name} holds ${best.rating}★ nearby against your ${self.rating}★.`,
        customerCost: "Half a star is often the whole decision on the map screen.",
      });
    }
  }

  /* ---------------- Class 3 — profile gaps ---------------- */
  if (profile) {
    if ((profile.photoCount ?? 0) < 5) {
      out.push({
        cls: 3,
        title: "Google profile is light on photos",
        evidence: `Your Google Business Profile exposes ${profile.photoCount ?? 0} photos.`,
        customerCost: "Profiles with rich photos get dramatically more calls and direction requests; sparse ones look closed or dated.",
      });
    }
    if (!profile.websiteUri) {
      out.push({
        cls: 3,
        title: "Google profile links no website",
        evidence: "Your Google Business Profile has no website button.",
        customerCost: "The most common way people reach a local site is the profile button. Yours sends them nowhere.",
      });
    }
    if (!profile.hoursKnown) {
      out.push({
        cls: 3,
        title: "No hours on your Google profile",
        evidence: "Google lists no opening hours for the business.",
        customerCost: "Google favors complete profiles, and customers skip places that might be closed.",
      });
    }
  }

  /* ---------------- Class 4 — directionality ---------------- */
  if (site?.reachable && !site.jsShell) {
    if (kind === "food" && site.orderingProviders.length === 0 && site.menuLink === "none") {
      out.push({
        cls: 4,
        title: "The site is not doing a restaurant's job",
        evidence: "No menu and no ordering path were found above or below the fold.",
        customerCost: "A restaurant homepage has one job: show the food and take the order. This one does neither yet.",
      });
    }
    if (kind === "service" && !site.contactFormLikely && !site.telLink && !site.mailtoLink) {
      out.push({
        cls: 4,
        title: "The site is not built to win jobs",
        evidence: "No quote form, no tap-to-call, no email link found.",
        customerCost: "A service site exists to turn an emergency into a booked job. There is no path from visit to booking.",
      });
    }
  }

  /* ---------------- Class 5 — small fixes (footnotes) ---------------- */
  if (site?.reachable) {
    if (site.footerYear && site.footerYear < currentYear) {
      out.push({
        cls: 5,
        title: `Footer says ${site.footerYear}`,
        evidence: `Copyright line reads ${site.footerYear}.`,
        customerCost: "Small tell that the site is not being looked after.",
      });
    }
    if (!site.metaDescription) {
      out.push({
        cls: 5,
        title: "No meta description",
        evidence: "The page has no description tag for Google results.",
        customerCost: "Google writes your search snippet for you, usually badly.",
      });
    }
    if (!site.ogImage) {
      out.push({
        cls: 5,
        title: "No link preview image",
        evidence: "No og:image tag found.",
        customerCost: "Shared links show up blank in chats and feeds.",
      });
    }
    if (!site.viewportMeta) {
      out.push({
        cls: 5,
        title: "No mobile viewport tag",
        evidence: "The page lacks a viewport meta tag.",
        customerCost: "Phones render the desktop layout zoomed out.",
      });
    }
    if (!site.h1) {
      out.push({
        cls: 5,
        title: "No main heading",
        evidence: "No h1 heading found on the page.",
        customerCost: "Weaker search understanding of what you do.",
      });
    }
  }

  // Order: class asc, stable. Lead classes capped so the report stays sharp.
  const lead = out.filter((f) => f.cls <= 4).slice(0, 6);
  const footnotes = out.filter((f) => f.cls === 5).slice(0, 5);
  const findings = [...lead, ...footnotes].sort((a, b) => a.cls - b.cls);
  const strongBasics = lead.length === 0;
  return { findings, strongBasics };
}

/* ------------------------------------------------------------------ */
/* Dimension scores — deterministic, every input observable.           */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => Math.max(5, Math.min(98, Math.round(n)));

export function buildScores(
  kind: BizKind,
  site: SiteChecks | null,
  profile: BusinessProfile | null,
  psi: PsiMetrics | null,
  findings: Finding[],
): { scores: DimensionScore[]; overall: number | null } {
  if (!site?.reachable && !profile) return { scores: [], overall: null };

  let clarity = 50;
  const clarityBits: string[] = [];
  if (site?.reachable) {
    if (site.title) (clarity += 12), clarityBits.push("title");
    if (site.metaDescription) (clarity += 12), clarityBits.push("description");
    if (site.h1) (clarity += 12), clarityBits.push("headline");
    if (site.viewportMeta) (clarity += 8), clarityBits.push("mobile viewport");
    if (site.jsShell) (clarity -= 10), clarityBits.push("JS-rendered shell");
  } else {
    clarity = 15;
    clarityBits.push("site unreachable");
  }

  let trust = 40;
  const trustBits: string[] = [];
  if (profile?.rating != null) {
    trust += (profile.rating - 3.5) * 20;
    trustBits.push(`${profile.rating}★ Google`);
  }
  if ((profile?.reviewCount ?? 0) > 100) (trust += 12), trustBits.push(`${profile!.reviewCount} reviews`);
  else if ((profile?.reviewCount ?? 0) > 25) (trust += 6), trustBits.push(`${profile!.reviewCount} reviews`);
  if ((profile?.photoCount ?? 0) >= 5) (trust += 8), trustBits.push("profile photos");
  if (site?.https) (trust += 8), trustBits.push("https");
  else if (site) (trust -= 12), trustBits.push("no https");

  let conversion = 60;
  const convBits: string[] = [];
  for (const f of findings) {
    if (f.cls === 1) {
      conversion -= 14;
      convBits.push(f.title.toLowerCase());
    }
  }
  if (kind === "food" && site?.orderingProviders.length) {
    conversion += 12;
    convBits.push(`ordering via ${site.orderingProviders[0]}`);
  }
  if (site?.telLink) (conversion += 8), convBits.push("tap-to-call");
  if (site?.contactFormLikely) (conversion += 6), convBits.push("contact form");

  let performance = 55;
  const perfBits: string[] = [];
  if (psi?.performanceScore != null) {
    performance = psi.performanceScore;
    perfBits.push(`Lighthouse ${psi.performanceScore}`);
  } else if (site?.ttfbMs != null) {
    performance = site.ttfbMs < 500 ? 80 : site.ttfbMs < 1200 ? 65 : site.ttfbMs < 2500 ? 45 : 30;
    perfBits.push(`first byte ${site.ttfbMs}ms`);
    if ((site.htmlBytes ?? 0) > 900_000) (performance -= 10), perfBits.push("heavy page");
  } else {
    perfBits.push("not measured");
  }

  const scores: DimensionScore[] = [
    { label: "Clarity", value: clamp(clarity), basis: clarityBits.join(", ") || "limited data" },
    { label: "Trust", value: clamp(trust), basis: trustBits.join(", ") || "limited data" },
    { label: "Conversion", value: clamp(conversion), basis: convBits.join(", ") || "no blockers found" },
    { label: "Performance", value: clamp(performance), basis: perfBits.join(", ") || "limited data" },
  ];
  const overall = Math.round(scores.reduce((s, d) => s + d.value, 0) / scores.length);
  return { scores, overall };
}
