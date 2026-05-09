import { Crosshair } from "lucide-react";

export function BleedSafeZoneOverlay() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
      <span className="inline-flex items-center gap-2">
        <Crosshair className="size-4 text-[#ff6f61]" aria-hidden="true" />
        Red guide: bleed/trim edge
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded border-2 border-dashed border-[#00a9b7]" />
        Cyan guide: safe zone
      </span>
    </div>
  );
}
