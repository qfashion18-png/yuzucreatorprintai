import type { Product } from "@creator-print-ai/core";
import { formatMoney } from "@/lib/utils";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col justify-between rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00a9b7] hover:shadow-md">
      <div>
        <div className="mb-5 flex aspect-[4/3] items-center justify-center rounded bg-[#f4fbff]">
          <div className="grid size-24 place-items-center rounded border-4 border-[#00a9b7] bg-white text-center text-xs font-black uppercase text-[#06131a] shadow-[10px_10px_0_#ff6f61]">
            {product.category}
          </div>
        </div>
        <h3 className="text-xl font-black tracking-[0]">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <BadgeDollarSign className="size-4 text-[#00a9b7]" aria-hidden="true" />
          From {formatMoney(product.startingPriceCents)}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm font-black text-[#007f88]"
        >
          Start <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
