import { TemplateCard } from "@/components/TemplateCard";
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
      <section className="grid gap-8 rounded border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-black uppercase text-[#007f88]">
            {product.category}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">
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
              className="inline-flex items-center gap-2 rounded bg-[#06131a] px-5 py-3 text-sm font-black text-white"
            >
              Start design <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-5 py-3 text-sm font-black"
            >
              Choose template
            </Link>
          </div>
        </div>
        <aside className="overflow-hidden rounded bg-[#f4fbff]">
          <div className="relative aspect-[4/3]">
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
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="font-bold text-slate-500">Starting price</dt>
                <dd className="mt-1 text-2xl font-black">
                  {formatMoney(product.startingPriceCents)}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Base quantity</dt>
                <dd className="mt-1 font-black">{product.baseQuantity}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">Provider mapping</dt>
                <dd className="mt-1 font-black">4over placeholder</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black tracking-[0]">
          Templates for {product.name}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {productTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </main>
  );
}
