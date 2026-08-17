/**
 * The scan server function — the only door between the browser and the
 * scanner. Validates input with zod, rate-limits per client address, and
 * never lets the Places key anywhere near the response.
 */

import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { runScan } from "./index";
import { rateLimit } from "./guards";
import type { ScanReport } from "./types";

const scanInputSchema = z.union([
  z.object({ mode: z.literal("url"), url: z.string().min(4).max(300) }),
  z.object({
    mode: z.literal("name"),
    name: z.string().min(2).max(90),
    city: z.string().min(2).max(60),
  }),
]);

export type ScanFnResult = { ok: true; report: ScanReport } | { ok: false; error: string };

export const scanBusiness = createServerFn({ method: "POST" })
  .validator((data: unknown) => scanInputSchema.parse(data))
  .handler(async ({ data }): Promise<ScanFnResult> => {
    try {
      const request = getRequest();
      const ip =
        request?.headers.get("cf-connecting-ip") ??
        request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";

      if (!rateLimit(`scan:${ip}`, 6, 60 * 60 * 1000)) {
        return {
          ok: false,
          error: "That's a lot of scans in one hour. Give it a break, or book the full free audit instead.",
        };
      }

      const report = await runScan(data);
      return { ok: true, report };
    } catch (e) {
      const message = e instanceof Error ? e.message : "The scan hit an unexpected error";
      return { ok: false, error: message };
    }
  });
