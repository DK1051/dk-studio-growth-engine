import { Reveal, SectionLabel, Underline } from "./primitives";

const columns = [
  ["Strategy first", "We start with your goals and build every decision around them."],
  ["Bilingual EN·KR", "Natural communication in English and Korean. Built for global reach."],
  ["One workflow", "Design and development under one roof. Faster. Smoother. Better."],
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel>01 — About</SectionLabel>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
          <Reveal>
            {/* Warm-tone placeholder block until a real photo is supplied */}
            <div
              className="aspect-3/4 max-h-[520px] w-full rounded-xl border border-border object-cover"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.9 0.03 76), oklch(0.78 0.035 62) 55%, oklch(0.63 0.04 52))",
              }}
              role="img"
              aria-label="Studio photograph placeholder"
            />
          </Reveal>

          <div>
            <Reveal delay={60}>
              <h2 className="text-[clamp(32px,4.6vw,52px)] text-foreground">
                Design with purpose. Built to <Underline>perform</Underline>.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-[54ch] text-[16px] leading-relaxed text-muted-foreground">
                We help businesses turn their websites into real growth engines. Strategy, design, and
                development, handled in one place.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-muted-foreground">
                No bloated process. No outsourcing gaps. Clarity, execution, and results you can measure.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-3">
              {columns.map(([title, body], i) => (
                <Reveal key={title} delay={60 * i}>
                  <p className="font-display text-[19px] text-foreground">{title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
