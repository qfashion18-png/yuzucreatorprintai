import type { Bundle, Product } from "@creator-print-ai/core";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { creatorDropKitImage } from "@/lib/visual-assets";
import { ArrowRight, Box, Clapperboard, PackagePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CreatorBundleCard({
  bundle,
  products,
}: {
  bundle: Bundle;
  products: Product[];
}) {
  return (
    <Surface tone="dark" className="overflow-hidden p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_460px] lg:items-center">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-[#d5ff5f] text-[#06131a] shadow-[0_16px_40px_rgba(213,255,95,0.2)]">
            <PackagePlus className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-[0] sm:text-4xl">
            {bundle.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            {bundle.description}
          </p>
        </div>
        <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <Image
            src={creatorDropKitImage.src}
            alt={creatorDropKitImage.alt}
            fill
            sizes="(min-width: 1024px) 440px, 92vw"
            className="object-cover opacity-95"
          />
          <Link
            href="/studio/new?bundle=creator-drop-kit"
            className="absolute bottom-4 right-4 inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#d5ff5f]"
          >
            Build the kit
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bundle.items.map((item, index) => {
          const product = products.find(
            (candidate) => candidate.slug === item.productSlug,
          );
          return (
            <Reveal key={item.productSlug} delay={index * 0.04}>
              <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.07] p-3">
                {item.optional ? (
                  <Clapperboard className="size-5 text-[#ff6f61]" />
                ) : (
                  <Box className="size-5 text-[#d5ff5f]" />
                )}
                <span className="text-sm font-semibold">
                  {product?.name ?? item.productSlug}
                  {item.optional ? " optional" : ""}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Surface>
  );
}
