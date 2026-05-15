import type { PrintTemplate } from "@creator-print-ai/core";
import { MotionPanel } from "@/components/ui/motion";
import { StatusPill } from "@/components/ui/surfaces";
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
    <MotionPanel className="h-full">
      <Link
        href={studioHref}
        className="group block h-full overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(6,19,26,0.07)] transition hover:border-[#00a9b7]"
        aria-label={`Use ${template.name} in Creator Studio`}
      >
        <article className="flex h-full flex-col justify-between">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f4fbff]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute left-3 top-3">
              <StatusPill tone="neutral">Editable template</StatusPill>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
              {slotTypes.map((slotType) => (
                <span
                  key={slotType}
                  className="rounded-md bg-[#06131a]/90 px-2 py-1 text-[10px] font-black uppercase text-white backdrop-blur"
                >
                  {slotType}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-start justify-between gap-4 p-4">
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
            <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#06131a] px-3 py-2 text-xs font-black text-white transition group-hover:bg-[#007f88]">
              Use
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </article>
      </Link>
    </MotionPanel>
  );
}
