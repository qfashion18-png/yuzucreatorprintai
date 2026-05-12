import type { PrintTemplate } from "@creator-print-ai/core";
import { templateThemeImages } from "@/lib/visual-assets";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { RotatingThemeImage } from "./RotatingThemeImage";

export function TemplateCard({ template }: { template: PrintTemplate }) {
  const images = templateThemeImages(template.productSlug, template.name);

  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <RotatingThemeImage
        images={images}
        seed={template.id}
        sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
        className="mb-4 aspect-[4/3] rounded border border-slate-100"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-[#007f88]">
            <LayoutTemplate className="size-4" aria-hidden="true" />
            {template.productSlug.replaceAll("-", " ")}
          </p>
          <h3 className="mt-1 text-lg font-black tracking-[0]">
            {template.name}
          </h3>
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
