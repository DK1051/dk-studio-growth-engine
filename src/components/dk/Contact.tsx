import { Arrow, Reveal, SectionLabel, Underline } from "./primitives";
import type { ServiceValue } from "./Pricing";

const EMAIL = "danielkimdesignco@gmail.com";

// Email sending is not wired yet. Flip to true once a send route exists.
const FORM_ENABLED = false;

const points = [
  ["Strategy first", "Every recommendation has a reason."],
  ["Focused process", "No handoffs. No fluff. Just focused work that drives results."],
  [
    "Bilingual support",
    "Native fluency in English and Korean. Global standard, local understanding.",
  ],
];

const fieldClass =
  "mt-2 min-h-12 w-full rounded-md border border-border bg-card px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-accent";

export default function Contact({
  service,
  setService,
}: {
  service: ServiceValue;
  setService: (s: ServiceValue) => void;
}) {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel>04 — Contact</SectionLabel>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal delay={60}>
              <h2 className="text-[clamp(32px,4.6vw,52px)] text-foreground">
                Your business deserves <Underline>better</Underline>.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground">
                Tell me about your goals and I&rsquo;ll show you how we can get there.
              </p>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-muted-foreground">
                Clear thinking. Thoughtful design. Work that moves your business forward.
              </p>
            </Reveal>

            <div className="mt-12 space-y-8 border-t border-border pt-10">
              {points.map(([t, s], i) => (
                <Reveal key={t} delay={60 * i}>
                  <p className="font-display text-[19px] text-foreground">{t}</p>
                  <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground">
                    {s}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <form
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block text-[13px] font-medium text-foreground">
                  Name
                  <input type="text" name="name" className={fieldClass} placeholder="Your name" />
                </label>
                <label className="block text-[13px] font-medium text-foreground">
                  Business name
                  <input type="text" name="business" className={fieldClass} placeholder="Your business" />
                </label>
                <label className="block text-[13px] font-medium text-foreground">
                  Website (optional)
                  <input type="url" name="website" className={fieldClass} placeholder="yoursite.com" />
                </label>
                <label className="block text-[13px] font-medium text-foreground">
                  Email
                  <input type="email" name="email" className={fieldClass} placeholder="you@email.com" />
                </label>
              </div>

              <label className="mt-5 block text-[13px] font-medium text-foreground">
                What do you need help with?
                <select
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value as ServiceValue)}
                  className={fieldClass}
                >
                  <option value="free-audit">Free audit</option>
                  <option value="standard-landing">Standard landing page</option>
                  <option value="full-rebuild">Full homepage rebuild</option>
                  <option value="something-else">Something else</option>
                </select>
              </label>

              <label className="mt-5 block text-[13px] font-medium text-foreground">
                Anything else?
                <textarea
                  name="message"
                  rows={4}
                  className={`${fieldClass} resize-y`}
                  placeholder="Goals, timeline, anything useful."
                />
              </label>

              <fieldset className="mt-6">
                <legend className="text-[13px] font-medium text-foreground">Preferred language</legend>
                <div className="mt-3 flex flex-wrap gap-4">
                  {["English", "Korean", "Both"].map((l, i) => (
                    <label
                      key={l}
                      className="inline-flex min-h-11 items-center gap-2 text-[14px] text-muted-foreground"
                    >
                      <input
                        type="radio"
                        name="language"
                        value={l}
                        defaultChecked={i === 0}
                        className="size-4 accent-[var(--accent)]"
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!FORM_ENABLED}
                className="arrow-nudge mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-[15px] font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send message
                <Arrow />
              </button>

              {!FORM_ENABLED ? (
                <p className="mt-4 text-center text-[13px] text-muted-foreground">
                  Form coming soon, email us directly at{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-foreground underline underline-offset-4"
                  >
                    {EMAIL}
                  </a>
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
