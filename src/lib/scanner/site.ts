/**
 * Server-side website checks. Plain-HTML analysis with hard caps — no
 * headless browser here, so the JS-shell guard below keeps us honest about
 * client-rendered sites (our own trap library: text fetch is not the page).
 */

import type { SiteChecks } from "./types";
import { fetchCapped, normalizeUrl } from "./guards";

const ORDERING_PROVIDERS: [string, string][] = [
  ["doordash.com", "DoorDash"],
  ["order.online", "DoorDash Storefront"],
  ["ubereats.com", "Uber Eats"],
  ["skipthedishes.com", "SkipTheDishes"],
  ["grubhub.com", "Grubhub"],
  ["toasttab.com", "Toast"],
  ["square.site", "Square Online"],
  ["squareup.com", "Square"],
  ["clover.com", "Clover"],
  ["swypepos", "SwypePOS"],
  ["fantuan", "Fantuan"],
  ["ritual.co", "Ritual"],
  ["chownow.com", "ChowNow"],
];

const BOOKING_PROVIDERS: [string, string][] = [
  ["opentable.", "OpenTable"],
  ["resy.com", "Resy"],
  ["yelp.com/reservations", "Yelp Reservations"],
  ["calendly.com", "Calendly"],
  ["squareup.com/appointments", "Square Appointments"],
  ["booksy.com", "Booksy"],
  ["fresha.com", "Fresha"],
  ["janeapp.com", "Jane"],
  ["setmore.com", "Setmore"],
  ["housecallpro.com", "Housecall Pro"],
  ["jobber.com", "Jobber"],
];

const SOCIAL_HOSTS = ["instagram.com", "facebook.com", "tiktok.com", "youtube.com", "x.com", "twitter.com"];

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m?.[1]?.trim() ?? null;
}

const HOURS_RE =
  /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|daily|open)\b[^<.]{0,40}\b(\d{1,2})(:\d{2})?\s?(am|pm|a\.m\.|p\.m\.)/i;

export async function checkSite(rawUrl: string): Promise<SiteChecks> {
  const url = normalizeUrl(rawUrl);
  const base: SiteChecks = {
    finalUrl: url.toString(),
    reachable: false,
    https: url.protocol === "https:",
    status: null,
    ttfbMs: null,
    htmlBytes: null,
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
  };

  let res: Response, text: string, ttfbMs: number;
  try {
    ({ res, text, ttfbMs } = await fetchCapped(url.toString(), { timeoutMs: 10_000 }));
  } catch {
    // https failed — try http downgrade once for old sites, still flagged as not-https
    if (url.protocol === "https:") {
      try {
        const httpUrl = url.toString().replace(/^https:/, "http:");
        ({ res, text, ttfbMs } = await fetchCapped(httpUrl, { timeoutMs: 8_000 }));
        base.https = false;
        base.finalUrl = httpUrl;
      } catch {
        return base;
      }
    } else {
      return base;
    }
  }

  base.reachable = res.ok;
  base.status = res.status;
  base.ttfbMs = ttfbMs;
  base.htmlBytes = text.length;
  if (!res.ok || !text) return base;

  return analyzeHtml(text, base);
}

/** Pure HTML analysis, separated from fetching so it is unit-testable. */
export function analyzeHtml(text: string, base: SiteChecks): SiteChecks {
  const html = text;
  const lower = html.toLowerCase();

  base.title = firstMatch(html, /<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
  base.metaDescription =
    firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]{0,400}?)["']/i) ??
    firstMatch(html, /<meta[^>]+content=["']([\s\S]{0,400}?)["'][^>]+name=["']description["']/i);
  base.ogImage =
    firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']{1,500})["']/i) ??
    firstMatch(html, /<meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:image["']/i);
  base.favicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
  base.viewportMeta = /<meta[^>]+name=["']viewport["']/i.test(html);
  base.h1 = stripTags(firstMatch(html, /<h1[^>]*>([\s\S]{0,300}?)<\/h1>/i) ?? "") || null;
  base.telLink = /href=["']tel:/i.test(html);
  base.mailtoLink = /href=["']mailto:/i.test(html);
  base.contactFormLikely = /<form[\s\S]{0,800}?(email|message|name)/i.test(html);

  for (const [needle, label] of ORDERING_PROVIDERS) {
    if (lower.includes(needle) && !base.orderingProviders.includes(label)) base.orderingProviders.push(label);
  }
  for (const [needle, label] of BOOKING_PROVIDERS) {
    if (lower.includes(needle) && !base.bookingProviders.includes(label)) base.bookingProviders.push(label);
  }
  for (const host of SOCIAL_HOSTS) {
    if (lower.includes(`://${host}`) || lower.includes(`://www.${host}`)) base.socialLinks.push(host);
  }

  // Menu link: any anchor whose href or text mentions menu; PDF beats none, HTML beats PDF.
  const anchorRe = /<a\b[^>]*href=["']([^"']{1,400})["'][^>]*>([\s\S]{0,120}?)<\/a>/gi;
  let m: RegExpExecArray | null;
  let sawPdfMenu = false;
  let sawHtmlMenu = false;
  let guard = 0;
  while ((m = anchorRe.exec(html)) && guard++ < 800) {
    const href = m[1]!.toLowerCase();
    const label = stripTags(m[2] ?? "").toLowerCase();
    const mentionsMenu = href.includes("menu") || label.includes("menu");
    if (!mentionsMenu) continue;
    if (href.endsWith(".pdf") || href.includes(".pdf?")) sawPdfMenu = true;
    else sawHtmlMenu = true;
  }
  base.menuLink = sawHtmlMenu ? "html" : sawPdfMenu ? "pdf" : "none";

  base.hoursOnPage = HOURS_RE.test(stripTags(html).slice(0, 20_000));

  // Footer year: latest 4-digit year adjacent to a copyright marker.
  const years: number[] = [];
  const yearRe = /(?:©|&copy;|copyright)[^0-9]{0,40}((?:19|20)\d{2})|((?:19|20)\d{2})[^0-9]{0,10}(?:©|&copy;|copyright)/gi;
  let ym: RegExpExecArray | null;
  let yGuard = 0;
  while ((ym = yearRe.exec(html)) && yGuard++ < 50) {
    const y = Number(ym[1] ?? ym[2]);
    if (y >= 1990 && y <= 2100) years.push(y);
  }
  base.footerYear = years.length ? Math.max(...years) : null;

  // JS-shell detection: tiny visible text + script-heavy document.
  const visibleText = stripTags(html);
  const scriptCount = (lower.match(/<script/g) ?? []).length;
  base.jsShell = visibleText.length < 400 && scriptCount >= 2;

  return base;
}
