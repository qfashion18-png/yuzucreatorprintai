import { readAppConfig } from "@creator-print-ai/config";
import { AlertTriangle } from "lucide-react";

export default function AdminProviderPage() {
  const config = readAppConfig();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">4over provider settings</h1>
      <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <p className="flex items-center gap-2 font-black">
          <AlertTriangle className="size-5" aria-hidden="true" />
          4over endpoints are not guessed
        </p>
        <p className="mt-2 text-sm leading-6">
          Mock provider remains default. Live mode requires official 4over endpoint docs, credentials in Secrets Manager, and product mappings.
        </p>
      </div>
      <dl className="mt-6 grid gap-4 rounded border border-slate-200 bg-white p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold text-slate-500">Mode</dt>
          <dd className="mt-1 font-black">{config.fourOver.sandbox ? "sandbox" : "live"}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-500">Secret ID</dt>
          <dd className="mt-1 font-black">{config.fourOver.secretId ? "configured" : "not configured"}</dd>
        </div>
      </dl>
    </main>
  );
}
