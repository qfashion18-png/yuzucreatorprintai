"use client";

import type { DesignEditAction } from "@creator-print-ai/ai";
import { Bot, WandSparkles } from "lucide-react";
import { useState } from "react";

export function AIAssistantPanel({
  designId,
  layers,
  productSlug,
  templateId,
  onApplyActions,
}: {
  designId?: string;
  layers?: string[];
  productSlug?: string;
  templateId?: string;
  onApplyActions?: (actions: DesignEditAction[]) => Promise<void> | void;
}) {
  const [message, setMessage] = useState("Make this merch-ready");
  const [reply, setReply] = useState(
    "Ask for sticker ideas, launch copy, QR CTAs, or preflight help.",
  );
  const [loading, setLoading] = useState(false);

  async function askAssistant() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message,
          designId,
          productSlug,
          templateId,
          layers,
          allowDirectEdits: Boolean(onApplyActions),
        }),
      });
      const payload = await response.json();

      if (!payload.ok) {
        setReply(payload.error.message);
        return;
      }

      const actions = Array.isArray(payload.data.actions)
        ? (payload.data.actions as DesignEditAction[])
        : [];

      if (actions.length > 0) {
        await onApplyActions?.(actions);
      }

      setReply(payload.data.message);
    } finally {
      setLoading(false);
    }
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
        {loading ? "Thinking" : onApplyActions ? "Edit with AI" : "Ask AI"}
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">{reply}</p>
    </section>
  );
}
