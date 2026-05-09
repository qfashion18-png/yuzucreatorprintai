import type { Bundle, Product } from "@creator-print-ai/core";
import { Box, Clapperboard, PackagePlus } from "lucide-react";
import Link from "next/link";

export function CreatorBundleCard({ bundle, products }: { bundle: Bundle; products: Product[] }) {
  return (
    <section className="rounded border border-slate-200 bg-[#06131a] p-6 text-white shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex size-11 items-center justify-center rounded bg-[#d5ff5f] text-[#06131a]">
            <PackagePlus className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-black tracking-[0]">{bundle.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{bundle.description}</p>
        </div>
        <Link
          href="/studio/new?bundle=creator-drop-kit"
          className="inline-flex items-center justify-center rounded bg-white px-5 py-3 text-sm font-black text-[#06131a] transition hover:bg-[#d5ff5f]"
        >
          Build the kit
        </Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bundle.items.map((item) => {
          const product = products.find((candidate) => candidate.slug === item.productSlug);
          return (
            <div key={item.productSlug} className="flex items-center gap-3 rounded border border-white/10 bg-white/5 p-3">
              {item.optional ? <Clapperboard className="size-5 text-[#ff6f61]" /> : <Box className="size-5 text-[#d5ff5f]" />}
              <span className="text-sm font-semibold">
                {product?.name ?? item.productSlug}
                {item.optional ? " optional" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
