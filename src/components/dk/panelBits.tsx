import type { ReactNode } from "react";

/** Shared building blocks for the audit panel (sample demo + live reports). */

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-[13px] font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

export function Meter({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="w-[74px] shrink-0">{label}</span>
      <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/10">
        <span
          className="meter-grow block h-full rounded-full bg-accent"
          style={{ width: `${value}%`, animationDelay: `${delay}ms` }}
        />
      </span>
      <span className="w-6 text-right tabular-nums text-foreground">{value}</span>
    </div>
  );
}

/** Score dial with a conic progress ring. */
export function ScoreDial({ value, size = 56 }: { value: number; size?: number }) {
  const inner = size - 10;
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent) ${value * 3.6}deg, oklch(0.222 0.011 45 / 10%) 0deg)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-card"
        style={{ width: inner, height: inner }}
      >
        <span className="font-display text-[18px] leading-none text-foreground">{value}</span>
      </div>
    </div>
  );
}
