import type { PrintTemplate } from "@creator-print-ai/core";
import { templateImage } from "@/lib/visual-assets";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TemplateCard({ template }: { template: PrintTemplate }) {
  const image = templateImage(template.id, template.name);
  const studioHref = `/studio/new?template=${template.id}`;
  const slotTypes = Array.from(
    new Set(template.slots.map((slot) => slot.type)),
  ).slice(0, 3);

  return (
    <Link
      href={studioHref}
      className="group block h-full rounded border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00a9b7] hover:shadow-md"
      aria-label={`Use ${template.name} in Creator Studio`}
    >
      <article className="flex h-full flex-col justify-between">
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded border border-slate-100 bg-[#f4fbff]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0] text-[#06131a] shadow-sm">
            Editable template
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {slotTypes.map((slotType) => (
              <span
                key={slotType}
                className="rounded bg-[#06131a]/90 px-2 py-1 text-[10px] font-black uppercase text-white"
              >
                {slotType}
              </span>
            ))}
          </div>
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
            <p className="mt-2 text-xs font-bold text-slate-500">
              Opens directly in Creator Studio
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded bg-[#06131a] px-3 py-2 text-xs font-black text-white transition group-hover:bg-[#007f88]">
            Use in Studio <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}
