"use client";

const colors = ["#06131a", "#00a9b7", "#ff6f61", "#d5ff5f", "#ffffff"];

export function BrandKitPanel({ onColor }: { onColor: (color: string) => void }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-black">Brand colors</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className="size-8 rounded border border-slate-200"
            style={{ backgroundColor: color }}
            onClick={() => onColor(color)}
            aria-label={`Set background ${color}`}
          />
        ))}
      </div>
    </section>
  );
}
