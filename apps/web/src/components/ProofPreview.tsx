import { Surface } from "@/components/ui/surfaces";
import { FileCheck2 } from "lucide-react";

export function ProofPreview({ previewUrl }: { previewUrl?: string }) {
  return (
    <Surface className="p-4">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
          <FileCheck2 className="size-4" aria-hidden="true" />
        </span>
        Proof preview
      </h2>
      <div className="mt-3 grid aspect-[4/3] place-items-center overflow-hidden rounded-md border border-slate-100 bg-[#f4fbff]">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Generated proof preview"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="px-4 text-center text-sm font-semibold text-slate-500">
            Export a proof from the studio
          </span>
        )}
      </div>
    </Surface>
  );
}
