import type { PrintTemplate } from "@creator-print-ai/core";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Link from "next/link";

export function TemplateCard({ template }: { template: PrintTemplate }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className="relative mb-4 aspect-[4/3] overflow-hidden rounded border border-slate-100"
        style={{ backgroundColor: template.backgroundColor ?? "#ffffff" }}
      >
        <div className="absolute inset-5 border border-dashed border-[#00a9b7]" />
        <div className="absolute bottom-5 left-5 right-5 h-10 rounded bg-[#06131a]" />
        <div className="absolute right-6 top-6 grid size-16 place-items-center rounded bg-[#d5ff5f] text-xs font-black">
          QR
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-[#007f88]">
            <LayoutTemplate className="size-4" aria-hidden="true" />
            {template.productSlug.replaceAll("-", " ")}
          </p>
          <h3 className="mt-1 text-lg font-black tracking-[0]">{template.name}</h3>
        </div>
        <Link
          href={`/studio/new?template=${template.id}`}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-[#06131a] text-white"
          aria-label={`Use ${template.name}`}
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
