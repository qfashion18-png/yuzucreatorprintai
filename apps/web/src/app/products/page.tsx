import { ProductCard } from "@/components/ProductCard";
import { productCatalog } from "@creator-print-ai/core";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-[0]">Pick a starter product</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Browse print products built for merch drops, launch kits, QR campaigns, event promos, and packaging moments.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productCatalog.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
