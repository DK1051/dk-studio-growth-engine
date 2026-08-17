import { Arrow } from "./primitives";

const links = [
  { label: "Work", id: "work" },
  { label: "Pricing", id: "pricing" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="wordmark inline-flex min-h-11 items-center text-[15px] text-foreground sm:text-[18px]"
          aria-label="DK Studio, back to top"
        >
          DK Studio
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="label-serif inline-flex min-h-11 items-center rounded-md px-1 text-[13px] text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="arrow-nudge label-serif inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-[12.5px] text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5"
        >
          Book a free audit
          <Arrow />
        </a>
      </nav>
    </header>
  );
}
