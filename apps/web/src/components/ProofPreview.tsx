import { FileCheck2 } from "lucide-react";

export function ProofPreview({ previewUrl }: { previewUrl?: string }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <FileCheck2 className="size-4 text-[#007f88]" aria-hidden="true" />
        Proof preview
      </h2>
      <div className="mt-3 grid aspect-[4/3] place-items-center overflow-hidden rounded bg-[#f4fbff]">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Generated proof preview" className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm font-semibold text-slate-500">Export a proof from the studio</span>
        )}
      </div>
    </section>
  );
}
