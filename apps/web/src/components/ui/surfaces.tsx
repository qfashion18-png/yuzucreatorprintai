import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SurfaceProps = ComponentPropsWithoutRef<"section"> & {
  tone?: "default" | "dark" | "accent" | "soft";
};

export function Surface({
  children,
  className,
  tone = "default",
  ...props
}: SurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-lg border shadow-[0_18px_50px_rgba(6,19,26,0.06)]",
        tone === "default" &&
          "border-slate-200/80 bg-white/92 text-[#06131a]",
        tone === "soft" &&
          "border-cyan-100/80 bg-[#f4fbff]/90 text-[#06131a]",
        tone === "dark" &&
          "border-white/10 bg-[#06131a] text-white shadow-[0_24px_70px_rgba(6,19,26,0.18)]",
        tone === "accent" &&
          "border-[#b8f1f6] bg-[#ecfeff] text-[#06131a]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  action,
  children,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  children?: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-black uppercase text-[#007f88]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-black leading-tight tracking-[0] text-[#06131a] sm:text-3xl">
          {title}
        </h2>
        {children ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {children}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
export function StatusPill({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "good" | "warn" | "danger" | "accent" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black",
        tone === "neutral" && "border border-slate-200 bg-white text-slate-600",
        tone === "good" && "bg-emerald-100 text-emerald-800",
        tone === "warn" && "bg-amber-100 text-amber-900",
        tone === "danger" && "bg-rose-100 text-rose-800",
        tone === "accent" && "bg-[#ecfeff] text-[#007f88]",
        tone === "dark" && "bg-[#06131a] text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200/80 bg-white/85 px-3 py-2 shadow-sm",
        className,
      )}
    >
      <span className="block text-[11px] font-black uppercase text-slate-500">
        {label}
      </span>
      <span className="mt-1 block text-lg font-black text-[#06131a]">
        {value}
      </span>
      {detail ? (
        <span className="mt-1 block text-xs font-semibold text-slate-500">
          {detail}
        </span>
      ) : null}
    </div>
  );
}
