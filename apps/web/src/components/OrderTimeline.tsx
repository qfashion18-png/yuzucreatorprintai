import type { OrderEvent } from "@creator-print-ai/core";
import { CircleDot } from "lucide-react";

export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3 rounded border border-slate-200 bg-white p-4">
          <CircleDot className="mt-1 size-4 text-[#00a9b7]" aria-hidden="true" />
          <div>
            <p className="text-sm font-black">{event.state.replaceAll("_", " ")}</p>
            <p className="text-sm text-slate-600">{event.message}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
