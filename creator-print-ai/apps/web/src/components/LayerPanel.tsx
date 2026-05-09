import { Layers } from "lucide-react";

export function LayerPanel({ layers }: { layers: string[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <Layers className="size-4 text-[#007f88]" aria-hidden="true" />
        Layers
      </h2>
      <div className="mt-3 space-y-2">
        {layers.map((layer) => (
          <div key={layer} className="rounded border border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {layer}
          </div>
        ))}
      </div>
    </section>
  );
}
