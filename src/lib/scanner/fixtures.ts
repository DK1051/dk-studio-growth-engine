/**
 * Sample report used only for the demo URL `sample-report.demo` — lets the
 * report UI be exercised without live API calls, and lets DK demo the flow
 * offline. Clearly labeled sample data throughout; never shown for a real
 * business.
 */

import type { ScanReport } from "./types";

export const SAMPLE_HOST = "sample-report.demo";

export function sampleReport(): ScanReport {
  return {
    input: { mode: "url", url: `https://${SAMPLE_HOST}` },
    scannedAt: new Date().toISOString(),
    profile: {
      placeId: null,
      name: "Sample Restaurant (demo data)",
      address: "123 Example St, Vancouver",
      phone: "(604) 555-0100",
      rating: 4.1,
      reviewCount: 41,
      websiteUri: `https://${SAMPLE_HOST}`,
      primaryType: "restaurant",
      photoUrls: [],
      photoCount: 3,
      hoursKnown: true,
      openNow: true,
      reviews: [
        { text: "Great food, but I could not find the menu online. (sample review)", rating: 4, author: "Demo user" },
      ],
    },
    site: {
      finalUrl: `https://${SAMPLE_HOST}/`,
      reachable: true,
      https: true,
      status: 200,
      ttfbMs: 640,
      htmlBytes: 52_000,
      title: "Sample Restaurant",
      metaDescription: null,
      ogImage: null,
      favicon: true,
      viewportMeta: true,
      h1: "Sample Restaurant",
      telLink: false,
      mailtoLink: false,
      orderingProviders: [],
      bookingProviders: [],
      socialLinks: ["facebook.com"],
      menuLink: "pdf",
      hoursOnPage: true,
      footerYear: 2021,
      jsShell: false,
      contactFormLikely: false,
    },
    psi: { performanceScore: 54, lcpMs: 4200, cls: 0.12, timedOut: false },
    competitors: [
      { name: "Sample Restaurant (demo data)", rating: 4.1, reviewCount: 41, hasWebsite: true, self: true },
      { name: "Demo Rival A", rating: 4.6, reviewCount: 312, hasWebsite: true },
      { name: "Demo Rival B", rating: 4.4, reviewCount: 178, hasWebsite: true },
      { name: "Demo Rival C", rating: 4.2, reviewCount: 96, hasWebsite: false },
    ],
    findings: [
      {
        cls: 1,
        title: "No path to order",
        evidence: "The homepage links no ordering service and no direct order flow. (demo)",
        customerCost: "A hungry customer ready to order has nothing to click. They order from whoever is one tap away.",
      },
      {
        cls: 1,
        title: "Menu is a PDF",
        evidence: "The only menu link on the page opens a PDF file. (demo)",
        customerCost: "On a phone, a PDF menu means pinching and squinting. Many people give up before they pick a dish.",
      },
      {
        cls: 2,
        title: "Neighbors are out-reviewing you",
        evidence: "Demo Rival A shows 312 Google reviews nearby, you show 41. (demo)",
        customerCost: "When people compare on the map, the bigger review count usually gets the visit.",
      },
      {
        cls: 3,
        title: "Google profile is light on photos",
        evidence: "Your Google Business Profile exposes 3 photos. (demo)",
        customerCost: "Profiles with rich photos get dramatically more calls and direction requests.",
      },
      {
        cls: 5,
        title: "Footer says 2021",
        evidence: "Copyright line reads 2021. (demo)",
        customerCost: "Small tell that the site is not being looked after.",
      },
    ],
    strongBasics: false,
    scores: [
      { label: "Clarity", value: 62, basis: "title, headline, mobile viewport (demo)" },
      { label: "Trust", value: 55, basis: "4.1★ Google, 41 reviews, https (demo)" },
      { label: "Conversion", value: 38, basis: "no ordering path, PDF menu, no tap-to-call (demo)" },
      { label: "Performance", value: 54, basis: "Lighthouse 54 (demo)" },
    ],
    overallScore: 52,
    limits: [
      "This is the built-in sample report (demo data).",
      "Listings consistency (Yelp, Apple, Bing), design review, and conversion-path walkthrough are covered by the full free audit.",
    ],
  };
}
