import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { productCatalog } from "@creator-print-ai/core";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Surface className="overflow-hidden p-6 sm:p-8" tone="soft">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              Pick a starter product
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Browse print products built for merch drops, launch kits, QR
              campaigns, event promos, and packaging moments.
            </p>
          </div>
        </Surface>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productCatalog.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            priority={index < 3}
          />
        ))}
      </div>
    </main>
  );
}
