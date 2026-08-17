import { useState } from "react";

import type { ScanReport } from "@/lib/scanner/types";
import AuditDemo from "./AuditDemo";
import ScanModule, { ScanProgress } from "./ScanModule";
import ScanReportView from "./ScanReportView";
import { Enter, Underline } from "./primitives";

export default function Hero({ onBookAudit }: { onBookAudit: () => void }) {
  const [report, setReport] = useState<ScanReport | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <section id="top" className="mx-auto max-w-[1280px] px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,460px)_1fr] lg:gap-14">
        <div>
          <Enter>
            <p className="label-serif text-[12px] text-muted-foreground">Audit. Insight. Redesign. Launch.</p>
          </Enter>
          <Enter delay={60}>
            <h1 className="mt-4 text-[clamp(38px,6.4vw,66px)] text-foreground">
              We audit. We redesign. We build what <Underline>performs</Underline>.
            </h1>
          </Enter>
          <Enter delay={120}>
            <p className="lede mt-5 max-w-[44ch] text-[18px] leading-relaxed text-foreground/80">
              Our system turns guesswork into growth. A clear audit, honest insight, and design that
              converts.
            </p>
          </Enter>
          <Enter delay={180}>
            <ScanModule onReport={setReport} onPending={setPending} />
          </Enter>
        </div>

        <Enter delay={120}>
          {pending ? (
            <div className="relative rounded-2xl border border-border bg-gradient-to-b from-card/90 to-card/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_36px_88px_-48px_rgba(23,19,16,0.55),0_14px_32px_-22px_rgba(23,19,16,0.3)] sm:p-5">
              <ScanProgress />
            </div>
          ) : report ? (
            <ScanReportView report={report} onReset={() => setReport(null)} onBookAudit={onBookAudit} />
          ) : (
            <AuditDemo />
          )}
        </Enter>
      </div>
    </section>
  );
}
