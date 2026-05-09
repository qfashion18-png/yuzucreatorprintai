import { OrderTimeline } from "@/components/OrderTimeline";
import { getStore } from "@/lib/mock-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = getStore().orders.get(orderId);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase text-[#007f88]">{order.state.replaceAll("_", " ")}</p>
      <h1 className="mt-1 text-4xl font-black tracking-[0]">{order.id}</h1>
      <section className="mt-8">
        <OrderTimeline events={order.events} />
      </section>
    </main>
  );
}
