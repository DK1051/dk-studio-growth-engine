/**
 * PageSpeed Insights v5 — real Lighthouse data from Google, free tier.
 * PSI routinely takes 20-40s, far beyond an interactive scan's budget, so we
 * cap it hard and report the miss honestly instead of inventing a number.
 */

import type { PsiMetrics } from "./types";
import { fetchCapped, withBudget } from "./guards";

const MISS: PsiMetrics = { performanceScore: null, lcpMs: null, cls: null, timedOut: true };

export async function checkPsi(url: string, budgetMs = 12_000): Promise<PsiMetrics> {
  const run = (async (): Promise<PsiMetrics> => {
    const endpoint =
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=" +
      encodeURIComponent(url);
    const { res, text } = await fetchCapped(endpoint, { timeoutMs: budgetMs - 500, maxBytes: 4_000_000 });
    if (!res.ok) return MISS;
    const data = JSON.parse(text);
    const lh = data.lighthouseResult;
    const score = lh?.categories?.performance?.score;
    const lcp = lh?.audits?.["largest-contentful-paint"]?.numericValue;
    const cls = lh?.audits?.["cumulative-layout-shift"]?.numericValue;
    return {
      performanceScore: typeof score === "number" ? Math.round(score * 100) : null,
      lcpMs: typeof lcp === "number" ? Math.round(lcp) : null,
      cls: typeof cls === "number" ? Math.round(cls * 1000) / 1000 : null,
      timedOut: false,
    };
  })().catch(() => MISS);

  return withBudget(run, budgetMs, MISS);
}
