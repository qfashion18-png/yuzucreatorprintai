"use client";

import { Type } from "lucide-react";

export function TextTool({ onAddText }: { onAddText: (value: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onAddText("New drop text")}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06131a] px-3 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#007f88]"
    >
      <Type className="size-4" aria-hidden="true" />
      Text
    </button>
  );
}
