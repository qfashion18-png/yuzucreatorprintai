import { Surface, StatusPill } from "@/components/ui/surfaces";
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
    <Surface className="p-5">
      <h2 className="flex items-center gap-2 text-lg font-black">
        <span className="grid size-10 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
          <PlugZap className="size-5" aria-hidden="true" />
        </span>
        Provider status
      </h2>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            Print provider
          </p>
          <p className="mt-1 font-black">{providerMode}</p>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            AI provider
          </p>
          <p className="mt-1 font-black">{aiMode}</p>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">
            4over credentials
          </p>
          <div className="mt-2">
            <StatusPill tone={configured ? "good" : "warn"}>
              {configured ? "Configured" : "Mock default"}
            </StatusPill>
          </div>
        </div>
      </div>
    </Surface>
  );
}
