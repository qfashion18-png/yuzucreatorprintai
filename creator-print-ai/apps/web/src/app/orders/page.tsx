import { OrderTimeline } from "@/components/OrderTimeline";
import { getStore } from "@/lib/mock-store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const orders = Array.from(getStore().orders.values());

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-[0]">Orders</h1>
      {orders.length === 0 ? (
        <div className="mt-8 rounded border border-slate-200 bg-white p-6">
          <p className="font-black">No mock orders yet.</p>
          <Link href="/checkout" className="mt-4 inline-flex rounded bg-[#06131a] px-4 py-2 text-sm font-black text-white">
            Place a mock order
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block rounded border border-slate-200 bg-white p-5 hover:border-[#00a9b7]">
              <p className="text-sm font-bold uppercase text-[#007f88]">{order.state.replaceAll("_", " ")}</p>
              <h2 className="mt-1 text-xl font-black">{order.id}</h2>
              <OrderTimeline events={order.events.slice(-1)} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
