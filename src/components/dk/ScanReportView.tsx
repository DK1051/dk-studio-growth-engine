import { useState } from "react";

import type { Finding, ScanReport } from "@/lib/scanner/types";
import { FINDING_CLASS_LABEL } from "@/lib/scanner/types";
import { Card, Meter, ScoreDial } from "./panelBits";
import { Arrow, Check } from "./primitives";

const tabs = [
  { n: "01", label: "Audit" },
  { n: "02", label: "Findings" },
  { n: "03", label: "Reputation" },
  { n: "04", label: "Next steps" },
];

function FindingCard({ f }: { f: Finding }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-accent/50 px-2 py-0.5 text-[10px] font-medium text-accent">
          {FINDING_CLASS_LABEL[f.cls]}
        </span>
      </div>
      <p className="mt-2 text-[14px] font-semibold text-foreground">{f.title}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{f.evidence}</p>
      <p className="mt-2 border-l-2 border-accent/60 pl-2 text-[12px] leading-relaxed text-foreground/85">
        {f.customerCost}
      </p>
    </div>
  );
}

function CompetitorBars({ report }: { report: ScanReport }) {
  const rows = report.competitors.filter((c) => c.reviewCount != null);
  if (rows.length < 2) return null;
  const max = Math.max(...rows.map((r) => r.reviewCount ?? 0), 1);
  return (
    <Card title="Google reviews, you vs nearby">
      <div className="space-y-2.5">
        {rows.map((c) => (
          <div key={c.name} className="text-[11px]">
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate ${c.self ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {c.name}
                {c.self ? " (you)" : ""}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {c.rating != null ? `${c.rating}★ · ` : ""}
                {c.reviewCount}
              </span>
            </div>
            <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-foreground/10">
              <div
                className={`meter-grow h-full rounded-full ${c.self ? "bg-accent" : "bg-foreground/30"}`}
                style={{ width: `${Math.max(4, ((c.reviewCount ?? 0) / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">Ratings and reviews from Google.</p>
    </Card>
  );
}

export default function ScanReportView({
  report,
  onReset,
  onBookAudit,
}: {
  report: ScanReport;
  onReset: () => void;
  onBookAudit: () => void;
}) {
  const [active, setActive] = useState(0);
  const name =
    report.profile?.name ??
    (report.input.mode === "url" ? report.input.url.replace(/^https?:\/\//, "") : "your business");
  const lead = report.findings.filter((f) => f.cls <= 4);
  const footnotes = report.findings.filter((f) => f.cls === 5);

  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-b from-card/90 to-card/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_36px_88px_-48px_rgba(23,19,16,0.55),0_14px_32px_-22px_rgba(23,19,16,0.3)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-block max-w-[60%] truncate rounded-full border border-accent/50 bg-background/90 px-3 py-1 text-[11px] text-foreground">
          Live scan · {name}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-8 rounded-full border border-border px-3 text-[11px] text-muted-foreground hover:text-foreground"
        >
          New scan
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Scan report"
        className="mb-4 inline-flex flex-wrap gap-1 rounded-full border border-border bg-background/60 p-1"
      >
        {tabs.map((t, i) => (
          <button
            key={t.n}
            role="tab"
            aria-selected={active === i}
            type="button"
            onClick={() => setActive(i)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[13px] transition-colors ${
              active === i
                ? "border border-accent bg-card text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className={active === i ? "text-accent" : ""}>{t.n}</span>
            <span className="font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      <div key={active} className="tab-fade">
        {active === 0 && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[260px]">
              <Card title="Scan score">
                {report.overallScore != null ? (
                  <div className="flex items-center gap-4">
                    <ScoreDial value={report.overallScore} />
                    <div className="flex-1 space-y-1.5">
                      {report.scores.map((s, i) => (
                        <Meter key={s.label} label={s.label} value={s.value} delay={i * 80} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-muted-foreground">
                    Not enough could be measured to score this scan.
                  </p>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Instant scan, not the full audit.
                </p>
              </Card>
              {report.psi && !report.psi.timedOut ? (
                <Card title="Google PageSpeed (mobile)">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Score", report.psi.performanceScore != null ? String(report.psi.performanceScore) : "—"],
                      ["LCP", report.psi.lcpMs != null ? `${(report.psi.lcpMs / 1000).toFixed(1)}s` : "—"],
                      ["CLS", report.psi.cls != null ? String(report.psi.cls) : "—"],
                    ].map(([k, v]) => (
                      <span key={k}>
                        <span className="font-display block text-[15px] text-foreground">{v}</span>
                        <span className="text-[10px] text-muted-foreground">{k}</span>
                      </span>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="flex-1 space-y-3">
              {report.scores.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-foreground">{s.label}</span>
                    <span className="tabular-nums text-muted-foreground">{s.value} / 100</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Based on: {s.basis}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 1 && (
          <div className="space-y-3">
            {report.strongBasics ? (
              <Card title="Strong basics">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  The instant checks found no headline blockers. That happens, and we say so instead
                  of inventing one. The full audit goes where the scanner cannot: listings across
                  platforms, design, and the conversion walk-through.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {lead.map((f) => (
                  <FindingCard key={f.title} f={f} />
                ))}
              </div>
            )}
            {footnotes.length ? (
              <Card title="Small fixes (footnotes, not the headline)">
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  {footnotes.map((f) => (
                    <li key={f.title} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent/70" />
                      {f.title} — {f.evidence}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        )}

        {active === 2 && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[260px]">
              <Card title="Google profile">
                {report.profile ? (
                  <div className="space-y-1 text-[12px] text-muted-foreground">
                    <p className="text-[15px] font-semibold text-foreground">{report.profile.name}</p>
                    {report.profile.rating != null ? (
                      <p>
                        <span className="text-foreground">{report.profile.rating}★</span> ·{" "}
                        {report.profile.reviewCount} reviews
                      </p>
                    ) : null}
                    {report.profile.address ? <p>{report.profile.address}</p> : null}
                    <p>{report.profile.photoCount ?? 0} photos on the profile</p>
                  </div>
                ) : (
                  <p className="text-[12px] text-muted-foreground">
                    No matching Google profile confirmed for this scan.
                  </p>
                )}
              </Card>
              {report.profile?.reviews.length ? (
                <Card title="What customers say">
                  <div className="space-y-3">
                    {report.profile.reviews.slice(0, 2).map((r) => (
                      <div key={r.text.slice(0, 24)}>
                        <p className="font-display text-[13px] leading-snug text-foreground">
                          “{r.text.length > 110 ? `${r.text.slice(0, 110)}…` : r.text}”
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {r.rating}★ · {r.author} · Google review
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
            <div className="flex-1 space-y-3">
              {report.profile?.photoUrls.length ? (
                <div className="grid grid-cols-4 gap-2">
                  {report.profile.photoUrls.map((u) => (
                    <img
                      key={u}
                      src={u}
                      alt={`${report.profile?.name ?? "Business"} photo from its Google profile`}
                      className="aspect-square w-full rounded-lg border border-border object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : null}
              <CompetitorBars report={report} />
            </div>
          </div>
        )}

        {active === 3 && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <Card title="What the full free audit adds">
                <ul className="space-y-2 text-[12px] text-muted-foreground">
                  {report.limits.map((l) => (
                    <li key={l.slice(0, 24)} className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      <span>{l}</span>
                    </li>
                  ))}
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    <span>A designer's read of the site, with every finding verified by hand.</span>
                  </li>
                </ul>
              </Card>
            </div>
            <div className="flex w-full shrink-0 flex-col justify-center gap-3 rounded-xl border border-accent/40 bg-accent/5 p-5 lg:w-[280px]">
              <p className="font-display text-[19px] leading-tight text-foreground">
                Want the full report? It&rsquo;s free.
              </p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                We audit everything by hand, send the complete findings, and you keep the list
                whether or not we ever work together.
              </p>
              <a
                href="#contact"
                onClick={onBookAudit}
                className="arrow-nudge inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-[14px] font-medium text-primary-foreground"
              >
                Get the full free audit
                <Arrow />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
