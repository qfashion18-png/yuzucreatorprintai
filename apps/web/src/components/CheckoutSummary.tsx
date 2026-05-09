import { CreditCard } from "lucide-react";
import Link from "next/link";

export function CheckoutSummary() {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded bg-[#ecfeff] text-[#007f88]">
          <CreditCard className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-black">Mock checkout</h2>
          <p className="text-sm text-slate-600">Payment is simulated until a payment provider is selected.</p>
        </div>
      </div>
      <Link href="/orders" className="mt-5 inline-flex rounded bg-[#06131a] px-4 py-2 text-sm font-black text-white">
        View orders
      </Link>
    </section>
  );
}
