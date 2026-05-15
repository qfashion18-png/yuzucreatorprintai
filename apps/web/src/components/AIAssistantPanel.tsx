"use client";

import type { DesignEditAction } from "@creator-print-ai/ai";
import { AnimatedProgress } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { motion } from "framer-motion";
import { Bot, MessageSquareText, WandSparkles } from "lucide-react";
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
  const suggestions = [
    "Make this merch-ready",
    "Write a stronger QR call to action",
    "Suggest a launch caption",
  ];

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
    <Surface className="p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-black">
          <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
            <Bot className="size-4" aria-hidden="true" />
          </span>
          AI assistant
        </h2>
        <MessageSquareText className="size-4 text-slate-400" aria-hidden="true" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setMessage(suggestion)}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[11px] font-black text-slate-600 transition hover:border-[#00a9b7] hover:bg-[#ecfeff] hover:text-[#007f88]"
          >
            {suggestion}
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="mt-3 min-h-24 w-full rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none transition focus:border-[#00a9b7]"
      />
      <button
        type="button"
        onClick={() => void askAssistant()}
        disabled={loading}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#06131a] px-3 py-2.5 text-sm font-black text-white transition hover:bg-[#007f88] disabled:cursor-wait disabled:opacity-80"
      >
        <WandSparkles className="size-4" aria-hidden="true" />
        {loading ? "Thinking" : onApplyActions ? "Edit with AI" : "Ask AI"}
      </button>
      {loading ? (
        <AnimatedProgress
          value={72}
          className="mt-3 h-1.5"
          indicatorClassName="bg-[#d5ff5f]"
        />
      ) : null}
      <motion.p
        key={reply}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600"
      >
        {reply}
      </motion.p>
    </Surface>
  );
}
