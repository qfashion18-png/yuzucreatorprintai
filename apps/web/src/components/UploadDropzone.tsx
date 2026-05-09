"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export type UploadedAsset = {
  dataUrl: string;
  fileName: string;
  widthPx?: number;
  heightPx?: number;
  mimeType: string;
};

export function UploadDropzone({ onUpload }: { onUpload?: (asset: UploadedAsset) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("No file selected");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });

    const dimensions = await readImageDimensions(dataUrl);
    setFileName(file.name);
    onUpload?.({
      dataUrl,
      fileName: file.name,
      mimeType: file.type,
      widthPx: dimensions.width,
      heightPx: dimensions.height,
    });
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full items-center gap-3 rounded border border-dashed border-slate-300 bg-white p-4 text-left transition hover:border-[#00a9b7] hover:bg-[#f4fbff]"
    >
      <span className="grid size-11 place-items-center rounded bg-[#ecfeff] text-[#007f88]">
        <UploadCloud className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-black">Upload artwork</span>
        <span className="block text-xs text-slate-500">{fileName}</span>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </button>
  );
}

function readImageDimensions(dataUrl: string): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({});
    image.src = dataUrl;
  });
}
