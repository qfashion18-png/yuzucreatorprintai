"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const response = await fetch("/api/checkout/mock", { method: "POST" });
    const payload = await response.json();
    setLoading(false);
    if (payload.ok) router.push(`/orders/${payload.data.id}`);
  }

  return (
    <button
      type="button"
      onClick={() => void submit()}
      disabled={loading}
      className="h-fit rounded-md bg-[#d5ff5f] px-5 py-3 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#c7f34f] disabled:cursor-wait disabled:opacity-80"
    >
      {loading ? "Creating order" : "Place mock order"}
    </button>
  );
}
