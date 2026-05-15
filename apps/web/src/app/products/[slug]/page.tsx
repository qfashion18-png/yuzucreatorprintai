import { TemplateCard } from "@/components/TemplateCard";
import { Reveal } from "@/components/ui/motion";
import { Surface, StatusPill } from "@/components/ui/surfaces";
import { formatMoney } from "@/lib/utils";
import { productImage } from "@/lib/visual-assets";
import {
  getProductBySlug,
  getTemplatesByProduct,
} from "@creator-print-ai/core";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productTemplates = getTemplatesByProduct(slug);
  const firstTemplate = productTemplates[0];
  const image = productImage(product.slug, product.name);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Surface className="grid gap-8 overflow-hidden p-6 lg:grid-cols-[1fr_440px] lg:p-8">
        <div>
          <StatusPill tone="accent">{product.category}</StatusPill>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.popularUseCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded bg-[#ecfeff] px-3 py-1 text-xs font-bold text-[#007f88]"
              >
                {useCase}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/studio/new${firstTemplate ? `?template=${firstTemplate.id}` : ""}`}
              className="inline-flex items-center gap-2 rounded-md bg-[#06131a] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#007f88]"
            >
              Start design <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-black transition hover:border-[#00a9b7] hover:bg-[#ecfeff]"
            >
              Choose template
            </Link>
          </div>
        </div>
        <aside className="overflow-hidden rounded-lg border border-slate-200/80 bg-[#f4fbff] shadow-sm">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 420px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <dl className="grid gap-3 text-sm">
              <div className="rounded-md bg-white/80 p-3">
                <dt className="font-bold text-slate-500">Starting price</dt>
                <dd className="mt-1 text-2xl font-black">
                  {formatMoney(product.startingPriceCents)}
                </dd>
              </div>
              <div className="rounded-md bg-white/80 p-3">
                <dt className="font-bold text-slate-500">Base quantity</dt>
                <dd className="mt-1 font-black">{product.baseQuantity}</dd>
              </div>
              <div className="rounded-md bg-white/80 p-3">
                <dt className="font-bold text-slate-500">Provider mapping</dt>
                <dd className="mt-1 font-black">4over placeholder</dd>
              </div>
            </dl>
          </div>
        </aside>
      </Surface>

      <section className="mt-10">
        <Reveal>
          <h2 className="text-2xl font-black tracking-[0]">
            Templates for {product.name}
          </h2>
        </Reveal>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {productTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
