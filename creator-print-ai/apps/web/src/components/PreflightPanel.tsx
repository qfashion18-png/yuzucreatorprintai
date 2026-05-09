import type { PreflightResult } from "@creator-print-ai/core";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function PreflightPanel({ result }: { result?: PreflightResult }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-black">Print readiness</h2>
      {!result ? (
        <p className="mt-3 text-sm text-slate-600">Run preflight before approving a proof.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {result.checks.map((check) => (
            <div key={check.code} className="flex items-center gap-2 text-sm">
              {check.passed ? <CheckCircle2 className="size-4 text-emerald-600" /> : <AlertTriangle className="size-4 text-amber-600" />}
              <span>{check.label}</span>
            </div>
          ))}
          {result.warnings.map((warning) => (
            <p key={`${warning.code}-${warning.targetId}`} className="rounded bg-amber-50 p-2 text-xs leading-5 text-amber-900">
              {warning.message}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
