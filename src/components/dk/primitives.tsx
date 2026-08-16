import { useEffect, useRef, useState, type ReactNode } from "react";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Hand-drawn orange underline that draws on when scrolled into view. */
export function Underline({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <svg
        className="pointer-events-none absolute -bottom-[0.12em] left-0 w-full"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        height="10"
        aria-hidden="true"
      >
        <path
          d="M2 8.5C40 3.5 92 2.2 198 5.6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3.2"
          strokeLinecap="round"
          style={{
            strokeDasharray: 220,
            strokeDashoffset: inView ? 0 : 220,
            transition: "stroke-dashoffset 900ms ease-out 150ms",
          }}
        />
      </svg>
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[13px] font-medium tracking-wide text-foreground">
      <span className="size-2.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arrow size-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`size-[18px] shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M8 12.3l2.7 2.7L16 9.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
