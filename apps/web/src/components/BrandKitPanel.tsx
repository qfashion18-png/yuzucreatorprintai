"use client";

import { Surface } from "@/components/ui/surfaces";
import { Palette } from "lucide-react";

type BrandKitOption = {
  id: string;
  name: string;
  colors: string[];
  headline: string;
  handle: string;
};

const fallbackColors = ["#06131a", "#00a9b7", "#ff6f61", "#d5ff5f", "#ffffff"];

export function BrandKitPanel({
  activeKitId,
  kits = [],
  onApplyKit,
  onColor,
  onSelectKit,
}: {
  activeKitId?: string;
  kits?: BrandKitOption[];
  onApplyKit?: () => void;
  onColor: (color: string) => void;
  onSelectKit?: (kitId: string) => void;
}) {
  const activeKit = kits.find((kit) => kit.id === activeKitId);
  const colors = activeKit?.colors ?? fallbackColors;

  return (
    <Surface className="p-4">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
          <Palette className="size-4" aria-hidden="true" />
        </span>
        Brand kit
      </h2>
      {kits.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {kits.map((kit) => (
            <button
              key={kit.id}
              type="button"
              onClick={() => onSelectKit?.(kit.id)}
              className={`rounded-md border px-3 py-2 text-left transition ${
                kit.id === activeKitId
                  ? "border-[#00a9b7] bg-[#ecfeff] shadow-sm"
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center justify-between gap-2 text-xs font-black">
                {kit.name}
                <span className="flex gap-1" aria-hidden="true">
                  {kit.colors.slice(0, 4).map((color) => (
                    <span
                      key={color}
                      className="size-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </span>
              <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                {kit.headline} / {kit.handle}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className="size-8 rounded-md border border-slate-200 shadow-sm transition hover:scale-105"
            style={{ backgroundColor: color }}
            onClick={() => onColor(color)}
            aria-label={`Set background ${color}`}
          />
        ))}
      </div>
      {onApplyKit ? (
        <button
          type="button"
          onClick={onApplyKit}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#06131a] px-3 py-2.5 text-sm font-black text-white transition hover:bg-[#007f88]"
        >
          Apply kit
        </button>
      ) : null}
    </Surface>
  );
}
