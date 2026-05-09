import { QuoteSummary } from "@/components/QuoteSummary";
import { productCatalog } from "@creator-print-ai/core";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <section className="rounded border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-black tracking-[0]">Cart</h1>
        <div className="mt-5 rounded bg-[#f4fbff] p-4">
          <p className="font-black">Creator Drop Kit starter</p>
          <p className="mt-2 text-sm text-slate-600">
            Mock cart is ready for local checkout. Add real saved designs from the studio as the MVP evolves.
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-700">{productCatalog[0].name}, QR cards, inserts, labels</p>
        </div>
      </section>
      <aside className="space-y-4">
        <QuoteSummary />
        <Link href="/checkout" className="inline-flex w-full justify-center rounded bg-[#06131a] px-4 py-3 text-sm font-black text-white">
          Mock checkout
        </Link>
      </aside>
    </main>
  );
}
