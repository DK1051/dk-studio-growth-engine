import { useRef, useState, type ReactNode } from "react";
import { Check } from "./primitives";

const tabs = [
  { n: "01", label: "Audit" },
  { n: "02", label: "Insight" },
  { n: "03", label: "Redesign" },
  { n: "04", label: "Launch" },
];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-[13px] font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="w-[74px] shrink-0">{label}</span>
      <span className="h-[3px] flex-1 rounded-full bg-foreground/10">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </span>
      <span className="w-6 text-right tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function Hotspot({
  top,
  left,
  pct,
  size = 14,
}: {
  top: string;
  left: string;
  pct?: string;
  size?: number;
}) {
  return (
    <span className="absolute flex items-center gap-2" style={{ top, left }}>
      <span className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="hotspot-pulse absolute inset-0 rounded-full bg-accent/40" />
        <span className="relative rounded-full bg-accent" style={{ width: size * 0.55, height: size * 0.55 }} />
      </span>
      {pct ? <span className="text-[11px] font-medium text-foreground">{pct}</span> : null}
    </span>
  );
}

/** Fictional VERDE mini page preview, coded UI only. */
function VerdePreview({
  variant,
  children,
}: {
  variant: "default" | "clean";
  children?: ReactNode;
}) {
  return (
    <div className="relative flex-1 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span className="font-display text-[13px] tracking-[0.28em] text-foreground">VERDE</span>
        <span className="hidden gap-4 sm:flex">
          <span>Shop</span>
          <span>Philosophy</span>
          <span>Journal</span>
          <span>About</span>
          <span>Cart (0)</span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[1.1fr_1fr]">
        <div>
          {variant === "clean" ? (
            <p className="mb-2 text-[9px] font-semibold tracking-[0.2em] text-accent">
              PLANT-BASED. HIGH-PERFORMANCE.
            </p>
          ) : null}
          <h3 className="font-display text-[20px] leading-[1.08] text-foreground sm:text-[26px]">
            Plant-based skincare, made for real life.
          </h3>
          <p className="mt-3 max-w-[30ch] text-[11px] leading-relaxed text-muted-foreground">
            High-performance formulas with ingredients you can trust.
          </p>
          <span className="mt-4 inline-block rounded-md bg-foreground px-4 py-2 text-[11px] font-medium text-background">
            Shop now
          </span>
        </div>

        {/* Product area approximated with neutral shapes */}
        <div className="relative flex items-end justify-center gap-2 rounded-lg bg-foreground/[0.04] p-4">
          <div className="h-20 w-8 rounded-t-full rounded-b-sm bg-foreground/15" />
          <div className="h-24 w-9 rounded-md bg-foreground/45" />
          <div className="h-14 w-10 rounded-b-xl rounded-t-md bg-foreground/10" />
          <div className="absolute bottom-2 left-1/2 h-2 w-3/4 -translate-x-1/2 rounded-sm bg-foreground/10" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4 text-[10px] text-muted-foreground sm:grid-cols-3">
        {[
          ["Clean ingredients", "Carefully sourced."],
          ["Visible results", "Proven from first use."],
          ["Sustainable choices", "Good for you."],
        ].map(([t, s]) => (
          <div key={t}>
            <p className="font-semibold text-foreground">{t}</p>
            <p>{s}</p>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

export default function AuditDemo() {
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 4, y: px * 4 });
  };

  return (
    <div
      ref={frameRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative rounded-2xl border border-border bg-card/70 p-3 shadow-[0_24px_60px_-40px_rgba(23,19,16,0.45)] sm:p-5"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 300ms ease-out",
      }}
    >
      {/* Pinned badge, visible on every tab */}
      <div className="absolute right-3 top-3 z-10 rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] text-muted-foreground sm:right-5 sm:top-5">
        Sample audit · demo data
      </div>

      <div
        role="tablist"
        aria-label="Audit process"
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

      <div key={active} className="tab-fade flex flex-col gap-4 lg:flex-row">
        {active === 0 && (
          <>
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[240px]">
              <Card title="Audit score">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-accent">
                    <span className="font-display text-[18px] leading-none text-foreground">62</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Meter label="Clarity" value={64} />
                    <Meter label="Trust" value={58} />
                    <Meter label="Conversion" value={52} />
                    <Meter label="Performance" value={46} />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Score 62 / 100</p>
              </Card>
              <Card title="Friction points">
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  {[
                    "Unclear value proposition",
                    "Low trust signal visibility",
                    "Generic imagery",
                    "Weak CTA hierarchy",
                  ].map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <VerdePreview variant="default">
              <Hotspot top="26%" left="52%" pct="8%" />
              <Hotspot top="45%" left="60%" pct="23%" />
              <Hotspot top="62%" left="30%" pct="18%" />
            </VerdePreview>
          </>
        )}

        {active === 1 && (
          <>
            <VerdePreview variant="default">
              <Hotspot top="22%" left="46%" size={18} />
              <Hotspot top="40%" left="66%" size={20} />
              <Hotspot top="58%" left="34%" size={16} />
              <span className="absolute left-[40%] top-[48%] hidden rounded-md bg-foreground px-3 py-2 text-[10px] leading-snug text-background sm:block">
                High attention.
                <br />
                42% of users focus here for ~2.8s
              </span>
            </VerdePreview>
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[240px]">
              <Card title="Customer insight">
                <p className="font-display text-[15px] leading-snug text-foreground">
                  &ldquo;I like the brand, but I&rsquo;m not sure what makes it different.&rdquo;
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">28% of users</p>
              </Card>
              <Card title="Heatmap key">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="h-16 w-2 rounded-full bg-gradient-to-b from-accent to-accent/10" />
                  <span className="flex h-16 flex-col justify-between">
                    <span>High attention</span>
                    <span>Low attention</span>
                  </span>
                </div>
              </Card>
            </div>
          </>
        )}

        {active === 2 && (
          <>
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[240px]">
              <Card title="Expected uplift">
                <p className="font-display text-[26px] leading-none text-foreground">+42%</p>
                <p className="text-[11px] text-muted-foreground">Conversion lift</p>
                <div className="mt-3 flex gap-6">
                  <span>
                    <span className="font-display block text-[17px] text-foreground">+28%</span>
                    <span className="text-[11px] text-muted-foreground">Engagement</span>
                  </span>
                  <span>
                    <span className="font-display block text-[17px] text-foreground">-35%</span>
                    <span className="text-[11px] text-muted-foreground">Bounce rate</span>
                  </span>
                </div>
              </Card>
              <Card title="Redesign summary">
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  {["Cleaner layout", "Improved hierarchy", "Stronger messaging", "Better CTA placement"].map(
                    (s) => (
                      <li key={s} className="flex items-center gap-2">
                        <Check className="size-3.5 text-accent" />
                        {s}
                      </li>
                    ),
                  )}
                </ul>
              </Card>
            </div>
            <VerdePreview variant="clean" />
          </>
        )}

        {active === 3 && (
          <>
            <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[240px]">
              <Card title="Process complete">
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  {["Audit", "Insight", "Redesign", "Launch"].map((s) => (
                    <li key={s} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <Check className="size-3.5 text-accent" />
                        {s}
                      </span>
                      <span className="tabular-nums text-foreground">100%</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Quality assurance">
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-accent" />
                    48+ tests passed
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-accent" />0 critical issues
                  </li>
                </ul>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                  {[
                    ["LCP", "1.3s"],
                    ["CLS", "0.02"],
                    ["INP", "120ms"],
                  ].map(([k, v]) => (
                    <span key={k}>
                      <span className="font-display block text-[15px] text-foreground">{v}</span>
                      <span className="text-[10px] text-muted-foreground">{k}</span>
                    </span>
                  ))}
                </div>
              </Card>
            </div>
            <VerdePreview variant="clean" />
          </>
        )}
      </div>
    </div>
  );
}
