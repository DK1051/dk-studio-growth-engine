import { useEffect, useState } from "react";
import { Arrow, scrollToId } from "./primitives";

const links = [
  { label: "Work", id: "work" },
  { label: "Pricing", id: "pricing" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled ? "border-border bg-background/90 backdrop-blur" : "border-transparent bg-background"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="wordmark min-h-11 text-[15px] text-foreground sm:text-[18px]"
          aria-label="DK Studio, back to top"
        >
          DK Studio
        </button>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="inline-flex min-h-11 items-center rounded-md px-1 text-[15px] text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="arrow-nudge inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-[14px] font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-5"
        >
          Book a free audit
          <Arrow />
        </a>
      </nav>
    </header>
  );
}
