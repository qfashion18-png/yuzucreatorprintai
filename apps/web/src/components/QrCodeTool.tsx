"use client";

import { QrCode } from "lucide-react";

export function QrCodeTool({ onAddQr }: { onAddQr: (url: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onAddQr("https://creatorprint.ai/drop")}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d5ff5f] px-3 py-2 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#c7f34f]"
    >
      <QrCode className="size-4" aria-hidden="true" />
      QR
    </button>
  );
}
