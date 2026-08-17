import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * One-shot visibility hook. A single IntersectionObserver instance is shared by
 * every element; each element is unobserved the moment it becomes visible, so
 * nothing can re-fire. No scroll listeners, no rAF loops.
 */
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(el: Element, cb: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          observer?.unobserve(e.target);
          const fn = callbacks.get(e.target);
          callbacks.delete(e.target);
          fn?.();
        }
      },
      // Generous rootMargin so sections reveal ~500px before they enter the
      // viewport — long smooth scrolls never pass through blank sections.
      { threshold: 0, rootMargin: "500px 0px 500px 0px" },
    );
  }
  callbacks.set(el, cb);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  // Already inside the viewport at mount: mark visible before paint.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) setInView(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    return observe(el, () => setInView(true));
  }, [inView]);

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

/**
 * CSS-only entrance for above-the-fold content (hero). Plays as soon as
 * styles load — no JS, no hydration wait, so the top of the page is never
 * blank while the bundle downloads.
 */
export function Enter({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`enter ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Hand-drawn orange underline that draws on when scrolled into view. */
export function Underline({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
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
    <div className="label-serif flex items-center gap-3 text-[12px] text-foreground">
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
