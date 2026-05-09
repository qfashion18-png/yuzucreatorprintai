import { CheckoutSummary } from "@/components/CheckoutSummary";
import { CheckoutButton } from "./submit";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-[0]">Mock checkout</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Checkout simulates payment authorization and provider submission. Live payments can be added after the provider decision.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_260px]">
        <CheckoutSummary />
        <CheckoutButton />
      </div>
    </main>
  );
}
