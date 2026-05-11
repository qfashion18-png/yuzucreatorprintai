import { CreatorBundleCard } from "@/components/CreatorBundleCard";
import { ProductCard } from "@/components/ProductCard";
import { TemplateCard } from "@/components/TemplateCard";
import { heroImage } from "@/lib/visual-assets";
import {
  creatorDropKit,
  productCatalog,
  templates,
} from "@creator-print-ai/core";
import { ArrowRight, FileCheck2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const featuredProducts = productCatalog.slice(0, 6);
  const featuredTemplates = templates.slice(0, 3);

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-[0] text-[#06131a] sm:text-6xl">
              Launch your next creator drop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Turn your image into stickers, creator cards, posters, labels, and
              social promo assets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded bg-[#06131a] px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Pick a product{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/studio/new"
                className="inline-flex items-center gap-2 rounded bg-[#d5ff5f] px-5 py-3 text-sm font-black text-[#06131a] transition hover:bg-[#c7f34f]"
              >
                Open studio <Sparkles className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded border border-slate-200 bg-[#f4fbff] shadow-sm">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 92vw"
              className="object-cover"
            />
            <div className="absolute left-7 top-7 inline-flex items-center gap-2 rounded bg-white px-3 py-2 text-xs font-black shadow-sm">
              <FileCheck2
                className="size-4 text-[#00a9b7]"
                aria-hidden="true"
              />
              Proof ready
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CreatorBundleCard bundle={creatorDropKit} products={productCatalog} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-[0]">
              Popular products
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Creator-friendly print products with mock pricing and 4over
              mapping placeholders.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-black text-[#007f88] sm:inline-flex"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-[0]">
                Premade templates
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Start with a layout, then swap in your art, QR link, colors, and
                copy.
              </p>
            </div>
            <Link
              href="/templates"
              className="hidden text-sm font-black text-[#007f88] sm:inline-flex"
            >
              Browse templates
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
