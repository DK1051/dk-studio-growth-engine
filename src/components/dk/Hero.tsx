import AuditDemo from "./AuditDemo";
import { Arrow, Reveal, Underline, scrollToId } from "./primitives";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1280px] px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,460px)_1fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="text-[14px] text-muted-foreground">Audit. Insight. Redesign. Launch.</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-4 text-[clamp(38px,6.4vw,66px)] text-foreground">
              We audit. We redesign. We build what <Underline>performs</Underline>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground">
              Our system turns guesswork into growth. A clear audit, honest insight, and design that
              converts.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="arrow-nudge mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-foreground px-6 text-[15px] font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Start your free audit
              <Arrow />
            </a>
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
