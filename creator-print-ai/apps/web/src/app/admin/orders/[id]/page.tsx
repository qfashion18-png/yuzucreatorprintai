import { OrderTimeline } from "@/components/OrderTimeline";
import { getStore } from "@/lib/mock-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getStore().orders.get(id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">Admin order {order.id}</h1>
      <p className="mt-2 text-sm text-slate-600">Provider retry and manual review controls are stubbed for the MVP.</p>
      <section className="mt-6">
        <OrderTimeline events={order.events} />
      </section>
    </main>
  );
}
