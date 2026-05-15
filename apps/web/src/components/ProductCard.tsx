import type { Product } from "@creator-print-ai/core";
import { formatMoney } from "@/lib/utils";
import { MotionPanel } from "@/components/ui/motion";
import { StatusPill } from "@/components/ui/surfaces";
import { productImage } from "@/lib/visual-assets";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const image = productImage(product.slug, product.name);

  return (
    <MotionPanel className="group h-full">
      <article className="flex h-full flex-col justify-between overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(6,19,26,0.07)] transition hover:border-[#00a9b7]">
        <div className="p-4">
          <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-lg bg-[#f4fbff]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
              className="object-cover transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute left-3 top-3">
              <StatusPill tone="accent">{product.category}</StatusPill>
            </div>
          </div>
          <h3 className="text-xl font-black tracking-[0]">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
            <BadgeDollarSign
              className="size-4 text-[#00a9b7]"
              aria-hidden="true"
            />
            From {formatMoney(product.startingPriceCents)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-md bg-[#06131a] px-3 py-2 text-sm font-black text-white transition hover:bg-[#007f88]"
          >
            Start
            <ArrowRight
              className="size-4 transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </article>
    </MotionPanel>
  );
}
