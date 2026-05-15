import { CheckoutSummary } from "@/components/CheckoutSummary";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { CheckoutButton } from "./submit";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Surface className="p-6 sm:p-8" tone="soft">
          <h1 className="text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            Mock checkout
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Checkout simulates payment authorization and provider submission.
            Live payments can be added after the provider decision.
          </p>
        </Surface>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_260px]">
        <CheckoutSummary />
        <CheckoutButton />
      </div>
    </main>
  );
}
