"use client";

import { Type } from "lucide-react";

export function TextTool({ onAddText }: { onAddText: (value: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onAddText("New drop text")}
      className="inline-flex items-center justify-center gap-2 rounded bg-[#06131a] px-3 py-2 text-sm font-black text-white transition hover:bg-slate-800"
    >
      <Type className="size-4" aria-hidden="true" />
      Text
    </button>
  );
}
