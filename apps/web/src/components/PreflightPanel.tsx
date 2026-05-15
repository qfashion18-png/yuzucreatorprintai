import type { PreflightResult } from "@creator-print-ai/core";
import { Surface } from "@/components/ui/surfaces";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function PreflightPanel({ result }: { result?: PreflightResult }) {
  return (
    <Surface className="p-4">
      <h2 className="text-sm font-black">Print readiness</h2>
      {!result ? (
        <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          Run preflight before approving a proof.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {result.checks.map((check) => (
            <div
              key={check.code}
              className="flex items-center gap-2 rounded-md border border-slate-100 px-3 py-2 text-sm"
            >
              {check.passed ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-4 text-amber-600" />
              )}
              <span>{check.label}</span>
            </div>
          ))}
          {result.warnings.map((warning) => (
            <p
              key={`${warning.code}-${warning.targetId}`}
              className="rounded-md bg-amber-50 p-2 text-xs leading-5 text-amber-900"
            >
              {warning.message}
            </p>
          ))}
        </div>
      )}
    </Surface>
  );
}
