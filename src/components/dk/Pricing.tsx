import { Arrow, Check, Reveal, SectionLabel, scrollToId } from "./primitives";

export type ServiceValue = "free-audit" | "standard-landing" | "full-rebuild" | "something-else";

const tiers: {
  name: string;
  price: string;
  items: string[];
  featured?: boolean;
  service: ServiceValue;
}[] = [
  {
    name: "Free Audit",
    price: "$0",
    service: "free-audit",
    items: ["Scored audit report", "Proof for every finding", "Clear fix list", "Nothing to buy"],
  },
  {
    name: "Standard Landing Page Design",
    price: "From $1,000",
    service: "standard-landing",
    items: [
      "One page, done right",
      "Your real photos, story",
      "Reviews and hours upfront",
      "Tested phone and desktop",
    ],
  },
  {
    name: "Full Homepage Rebuild",
    price: "From $5,000",
    service: "full-rebuild",
    featured: true,
    items: [
      "3D and animation effects",
      "Motion on every scroll",
      "Custom graphics and icons",
      "A look only yours",
      "Photos graded properly",
      "Navigation, simplified",
      "Order and booking paths",
    ],
  },
];

export default function Pricing({ onSelect }: { onSelect: (s: ServiceValue) => void }) {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel>03 — Pricing</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-8 max-w-[18ch] text-[clamp(32px,4.6vw,52px)] text-foreground">
            Clear value, real outcomes.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={60 * i} className="h-full">
              <div
                className={`flex h-full flex-col rounded-2xl border bg-card p-7 ${
                  t.featured ? "border-accent" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display max-w-[16ch] text-[24px] leading-tight text-foreground">
                    {t.name}
                  </h3>
                  {t.featured ? (
                    <span className="shrink-0 rounded-full border border-accent px-3 py-1 text-[11px] font-medium text-accent">
                      Featured
                    </span>
                  ) : null}
                </div>

                <p className="font-display mt-6 text-[40px] leading-none text-foreground">{t.price}</p>

                <ul className="mt-7 flex-1 space-y-3">
                  {t.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                      <Check className="mt-px text-accent" />
                      {it}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(t.service);
                    scrollToId("contact");
                  }}
                  className={`arrow-nudge mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md border text-[15px] font-medium transition-colors ${
                    t.featured
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/25 text-foreground hover:border-foreground"
                  }`}
                >
                  Get started
                  <Arrow />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
