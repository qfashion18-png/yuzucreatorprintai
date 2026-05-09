import type { QuoteResult } from "@creator-print-ai/print-provider";
import { formatMoney } from "@/lib/utils";

export function QuoteSummary({ quote }: { quote?: QuoteResult }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-black">Quote</h2>
      {!quote ? (
        <p className="mt-3 text-sm text-slate-600">Generate a mock quote when the design is ready.</p>
      ) : (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-bold">{formatMoney(quote.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="font-bold">{formatMoney(quote.shippingCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated tax</dt>
            <dd className="font-bold">{formatMoney(quote.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black">
            <dt>Total</dt>
            <dd>{formatMoney(quote.totalCents)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
