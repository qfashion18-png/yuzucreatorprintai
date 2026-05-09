import { getStore } from "@/lib/mock-store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = Array.from(getStore().orders.values());

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">Order management</h1>
      <div className="mt-6 rounded border border-slate-200 bg-white">
        {orders.length === 0 ? <p className="p-4 text-sm text-slate-600">No mock orders yet.</p> : null}
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-3 border-b border-slate-100 p-4 text-sm md:grid-cols-[1fr_220px_220px]">
            <strong>{order.id}</strong>
            <span>{order.state.replaceAll("_", " ")}</span>
            <span>{order.providerOrder?.providerOrderId ?? "pending"}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
