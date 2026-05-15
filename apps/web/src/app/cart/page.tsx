import { QuoteSummary } from "@/components/QuoteSummary";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { productCatalog } from "@creator-print-ai/core";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <Reveal>
        <Surface className="p-5">
          <h1 className="text-3xl font-black tracking-[0]">Cart</h1>
          <div className="mt-5 rounded-md border border-cyan-100 bg-[#f4fbff] p-4">
          <p className="font-black">Creator Drop Kit starter</p>
          <p className="mt-2 text-sm text-slate-600">
            Mock cart is ready for local checkout. Add real saved designs from the studio as the MVP evolves.
          </p>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {productCatalog[0].name}, QR cards, inserts, labels
            </p>
          </div>
        </Surface>
      </Reveal>
      <aside className="space-y-4">
        <QuoteSummary />
        <Link
          href="/checkout"
          className="inline-flex w-full justify-center rounded-md bg-[#06131a] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#007f88]"
        >
          Mock checkout
        </Link>
      </aside>
    </main>
  );
}
