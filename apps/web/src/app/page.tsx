import { CreatorBundleCard } from "@/components/CreatorBundleCard";
import { ProductCard } from "@/components/ProductCard";
import { TemplateCard } from "@/components/TemplateCard";
import { Reveal } from "@/components/ui/motion";
import { SectionHeader, StatusPill } from "@/components/ui/surfaces";
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
      <section className="relative isolate min-h-[560px] overflow-hidden border-b border-slate-200 bg-[#06131a]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,19,26,0.92)_0%,rgba(6,19,26,0.72)_42%,rgba(6,19,26,0.18)_100%)]" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <h1 className="text-5xl font-black leading-[0.96] tracking-[0] text-white sm:text-6xl lg:text-7xl">
              Launch your next creator drop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Turn your image into stickers, creator cards, posters, labels, and
              social promo assets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#d5ff5f]"
              >
                Pick a product{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/studio/new"
                className="inline-flex items-center gap-2 rounded-md bg-[#d5ff5f] px-5 py-3 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#c7f34f]"
              >
                Open studio <Sparkles className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <StatusPill tone="neutral" className="bg-white/95">
                <FileCheck2
                  className="size-4 text-[#00a9b7]"
                  aria-hidden="true"
                />
                Proof ready
              </StatusPill>
              <StatusPill tone="neutral" className="bg-white/95">
                <Sparkles
                  className="size-4 text-[#ff6f61]"
                  aria-hidden="true"
                />
                AI-assisted studio
              </StatusPill>
            </div>
          </Reveal>
          <div className="absolute bottom-6 right-6 hidden rounded-md border border-white/20 bg-white/92 px-4 py-3 text-xs font-black text-[#06131a] shadow-lg lg:inline-flex lg:items-center lg:gap-2">
              <FileCheck2
                className="size-4 text-[#00a9b7]"
                aria-hidden="true"
              />
            4over-ready proof flow
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CreatorBundleCard bundle={creatorDropKit} products={productCatalog} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5">
          <SectionHeader
            action={
              <Link
                href="/products"
                className="hidden rounded-md bg-[#ecfeff] px-3 py-2 text-sm font-black text-[#007f88] sm:inline-flex"
              >
                View all
              </Link>
            }
            title="Popular products"
          >
            Creator-friendly print products with mock pricing and 4over mapping
            placeholders.
          </SectionHeader>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-5">
            <SectionHeader
              action={
                <Link
                  href="/templates"
                  className="hidden rounded-md bg-[#ecfeff] px-3 py-2 text-sm font-black text-[#007f88] sm:inline-flex"
                >
                  Browse templates
                </Link>
              }
              title="Premade templates"
            >
              Start with a layout, then swap in your art, QR link, colors, and
              copy.
            </SectionHeader>
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
