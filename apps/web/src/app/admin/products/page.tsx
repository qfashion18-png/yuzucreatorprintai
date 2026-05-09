import { productCatalog } from "@creator-print-ai/core";

export default function AdminProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">Product/provider mapping</h1>
      <div className="mt-6 overflow-hidden rounded border border-slate-200 bg-white">
        {productCatalog.map((product) => (
          <div key={product.slug} className="grid gap-3 border-b border-slate-100 p-4 text-sm md:grid-cols-[1fr_220px_220px]">
            <strong>{product.name}</strong>
            <span>{product.providerMappings[0]?.provider ?? "mock"}</span>
            <span className="text-slate-500">{product.providerMappings[0]?.productCode ?? "Unmapped"}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
