"use client";

import { Bot, WandSparkles } from "lucide-react";
import { useState } from "react";

export function AIAssistantPanel() {
  const [message, setMessage] = useState("Make this merch-ready");
  const [reply, setReply] = useState("Ask for sticker ideas, launch copy, QR CTAs, or preflight help.");
  const [loading, setLoading] = useState(false);

  async function askAssistant() {
    setLoading(true);
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const payload = await response.json();
    setReply(payload.ok ? payload.data.message : payload.error.message);
    setLoading(false);
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <Bot className="size-4 text-[#007f88]" aria-hidden="true" />
        AI assistant
      </h2>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="mt-3 min-h-24 w-full rounded border border-slate-200 p-3 text-sm outline-none focus:border-[#00a9b7]"
      />
      <button
        type="button"
        onClick={() => void askAssistant()}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-[#06131a] px-3 py-2 text-sm font-black text-white"
      >
        <WandSparkles className="size-4" aria-hidden="true" />
        {loading ? "Thinking" : "Ask AI"}
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">{reply}</p>
    </section>
  );
}
