import AuditDemo from "./AuditDemo";
import { Arrow, Reveal, Underline, scrollToId } from "./primitives";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(320px,460px)_1fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="text-[14px] text-muted-foreground">Audit. Insight. Redesign. Launch.</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-6 text-[clamp(40px,7vw,66px)] text-foreground">
              We audit. We redesign. We build what <Underline>performs</Underline>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground">
              Our system turns guesswork into growth. A clear audit, honest insight, and design that
              converts.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="arrow-nudge mt-8 inline-flex min-h-12 items-center gap-3 rounded-md bg-foreground px-6 text-[15px] font-medium text-background"
            >
              Start your free audit
              <Arrow />
            </button>
            <p className="mt-3 text-[13px] text-muted-foreground">Free. Nothing to buy.</p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <AuditDemo />
        </Reveal>
      </div>
    </section>
  );
}
