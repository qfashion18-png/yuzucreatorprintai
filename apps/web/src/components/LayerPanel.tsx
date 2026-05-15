import { Surface } from "@/components/ui/surfaces";
import { Layers } from "lucide-react";

export function LayerPanel({
  layers,
  onSelectLayer,
  selectedLayer,
}: {
  layers: string[];
  onSelectLayer?: (layer: string) => void;
  selectedLayer?: string;
}) {
  return (
    <Surface className="p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-black">
          <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
            <Layers className="size-4" aria-hidden="true" />
          </span>
          Layers
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">
          {layers.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {layers.map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={() => onSelectLayer?.(layer)}
            className={`w-full rounded-md border px-3 py-2 text-left text-xs font-semibold transition ${
              layer === selectedLayer
                ? "border-[#00a9b7] bg-[#ecfeff] text-[#06131a] shadow-sm"
                : "border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            {layer}
          </button>
        ))}
      </div>
    </Surface>
  );
}
