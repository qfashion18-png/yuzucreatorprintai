import type { Product } from "@creator-print-ai/core";
import { formatMoney } from "@/lib/utils";
import { productThemeImages } from "@/lib/visual-assets";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { RotatingThemeImage } from "./RotatingThemeImage";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const images = productThemeImages(product.slug, product.name);

  return (
    <article className="group flex h-full flex-col justify-between rounded border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00a9b7] hover:shadow-md">
      <div>
        <RotatingThemeImage
          images={images}
          seed={product.slug}
          priority={priority}
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
          className="mb-5 aspect-[4/3] rounded"
        />
        <h3 className="text-xl font-black tracking-[0]">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <BadgeDollarSign
            className="size-4 text-[#00a9b7]"
            aria-hidden="true"
          />
          From {formatMoney(product.startingPriceCents)}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm font-black text-[#007f88]"
        >
          Start{" "}
          <ArrowRight
            className="size-4 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
