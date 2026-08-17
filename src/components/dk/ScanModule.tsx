import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { scanBusiness } from "@/lib/scanner/serverFn";
import type { ScanInput, ScanReport } from "@/lib/scanner/types";
import { Arrow } from "./primitives";

const STAGES = [
  "Finding the business…",
  "Reading the website…",
  "Checking your Google profile…",
  "Comparing nearby competitors…",
  "Scoring what we found…",
];

const fieldClass =
  "min-h-12 w-full rounded-md border border-border bg-card px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-accent";

export function ScanProgress() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % STAGES.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 p-8 text-center">
      <span className="relative flex size-12 items-center justify-center">
        <span className="hotspot-pulse absolute inset-0 rounded-full bg-accent/30" />
        <span className="size-5 rounded-full bg-accent" />
      </span>
      <p className="text-[15px] text-foreground">{STAGES[i]}</p>
      <p className="max-w-[36ch] text-[13px] text-muted-foreground">
        Live scan, usually 10 to 30 seconds. Every number in the report comes from a check that
        actually ran.
      </p>
    </div>
  );
}

export default function ScanModule({
  onReport,
  onPending,
}: {
  onReport: (r: ScanReport) => void;
  onPending: (pending: boolean) => void;
}) {
  const [mode, setMode] = useState<"url" | "name">("url");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: ScanInput) => scanBusiness({ data: input }),
    onMutate: () => {
      setError(null);
      onPending(true);
    },
    onSuccess: (res) => {
      onPending(false);
      if (res.ok) onReport(res.report);
      else setError(res.error);
    },
    onError: () => {
      onPending(false);
      setError("The scan hit a snag. Try again in a minute.");
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    if (mode === "url") {
      if (url.trim().length < 4) return setError("Type your website address first");
      mutation.mutate({ mode: "url", url: url.trim() });
    } else {
      if (name.trim().length < 2 || city.trim().length < 2)
        return setError("Business name and city are both needed");
      mutation.mutate({ mode: "name", name: name.trim(), city: city.trim() });
    }
  };

  return (
    <form onSubmit={submit} className="mt-6" aria-label="Free instant scan">
      <div
        role="tablist"
        aria-label="Scan input mode"
        className="inline-flex rounded-full border border-border bg-card/70 p-1"
      >
        {(
          [
            ["url", "I have a website"],
            ["name", "No website yet"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => {
              setMode(value);
              setError(null);
            }}
            className={`min-h-10 rounded-full px-4 text-[13px] transition-colors ${
              mode === value
                ? "border border-accent bg-background text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {mode === "url" ? (
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourbusiness.com"
            aria-label="Your website address"
            className={fieldClass}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Business name"
              aria-label="Business name"
              className={fieldClass}
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              aria-label="City"
              className={fieldClass}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="arrow-nudge inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-foreground px-6 text-[15px] font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60"
        >
          {mutation.isPending ? "Scanning…" : "Run the free scan"}
          <Arrow />
        </button>
      </div>

      <p className="mt-3 text-[13px] text-muted-foreground">
        No signup. About 30 seconds.{" "}
        <a href="#contact" className="text-foreground underline underline-offset-4">
          Or book the full free audit
        </a>
        .
      </p>

      {error ? (
        <p role="alert" className="mt-3 max-w-[44ch] rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-[13px] text-foreground">
          {error}
        </p>
      ) : null}
    </form>
  );
}
