import { useRef, useState } from "react";
import { Reveal, SectionLabel } from "./primitives";

type Project = { name: string; meta: string; image: string | null; url: string | null };

// Edit this array to rename or extend the project list.
const projects: Project[] = [
  { name: "Greek Taverna", meta: "Concept site · 2026", image: null, url: null },
  { name: "Northern Café", meta: "Concept rebuild · 2026", image: null, url: null },
];

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const preview = hovered !== null ? projects[hovered] : null;

  return (
    <section id="work" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel>02 — Work</SectionLabel>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-8 text-[clamp(32px,4.6vw,52px)] text-foreground">Selected work.</h2>
        </Reveal>

        <div ref={wrapRef} className="relative mt-12" onMouseMove={onMove}>
          <ul className="border-t border-border">
            {projects.map((p, i) => {
              const inner = (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`size-2 shrink-0 rounded-full bg-accent transition-opacity ${
                        hovered === i ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-display truncate text-[clamp(28px,5vw,64px)] leading-tight text-foreground">
                      {p.name}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`${p.name} preview`}
                        className="size-16 rounded-md object-cover md:hidden"
                      />
                    ) : null}
                    <span className="text-[13px] text-muted-foreground">{p.meta}</span>
                  </span>
                </>
              );

              const rowClass = `flex min-h-[88px] items-center justify-between gap-4 border-b border-border py-5 transition-[padding] duration-300 ${
                hovered === i ? "md:pl-3" : ""
              }`;

              return (
                <li
                  key={p.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`${rowClass} cursor-pointer`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={`${rowClass} cursor-default`}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {preview?.image ? (
            <img
              src={preview.image}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute z-20 hidden h-[230px] w-[340px] rounded-[10px] object-cover shadow-[0_20px_50px_-25px_rgba(23,19,16,0.6)] md:block"
              style={{
                left: pos.x + 24,
                top: pos.y - 115,
                transform: "rotate(-2deg)",
                transition: "left 120ms ease-out, top 120ms ease-out",
              }}
            />
          ) : null}
        </div>

        <p className="mt-6 text-[13px] text-muted-foreground">Case studies are added as they ship.</p>
      </div>
    </section>
  );
}
