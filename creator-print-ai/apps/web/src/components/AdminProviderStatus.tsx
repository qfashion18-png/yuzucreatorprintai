import { PlugZap } from "lucide-react";

export function AdminProviderStatus({
  providerMode,
  aiMode,
  configured,
}: {
  providerMode: string;
  aiMode: string;
  configured: boolean;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="flex items-center gap-2 text-lg font-black">
        <PlugZap className="size-5 text-[#007f88]" aria-hidden="true" />
        Provider status
      </h2>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Print provider</p>
          <p className="mt-1 font-black">{providerMode}</p>
        </div>
        <div className="rounded bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">AI provider</p>
          <p className="mt-1 font-black">{aiMode}</p>
        </div>
        <div className="rounded bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">4over credentials</p>
          <p className="mt-1 font-black">{configured ? "Configured" : "Mock default"}</p>
        </div>
      </div>
    </section>
  );
}
