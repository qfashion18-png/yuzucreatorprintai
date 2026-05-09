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
      className="h-fit rounded bg-[#d5ff5f] px-5 py-3 text-sm font-black text-[#06131a]"
    >
      {loading ? "Creating order" : "Place mock order"}
    </button>
  );
}
