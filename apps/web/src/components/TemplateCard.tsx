import type { PrintTemplate } from "@creator-print-ai/core";
import { templateImage } from "@/lib/visual-assets";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TemplateCard({ template }: { template: PrintTemplate }) {
  const image = templateImage(template.id, template.name);

  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded border border-slate-100 bg-[#f4fbff]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
          className="object-cover transition duration-500 hover:scale-[1.02]"
        />
      </div>
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
