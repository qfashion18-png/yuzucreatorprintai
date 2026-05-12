"use client";

import type { ThemedImage } from "@/lib/visual-assets";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type RotatingThemeImageProps = {
  images: ThemedImage[];
  seed: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  intervalMs?: number;
};

export function RotatingThemeImage({
  images,
  seed,
  sizes,
  className = "",
  priority = false,
  intervalMs = 3600,
}: RotatingThemeImageProps) {
  const initialIndex = useMemo(
    () => stableThemeIndex(seed, images.length),
    [seed, images.length],
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs, paused]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex % images.length];

  return (
    <div
      className={`relative overflow-hidden bg-[#f4fbff] ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, index) => (
        <Image
          key={image.theme.id}
          src={image.src}
          alt={image.alt}
          fill
          priority={priority && index === initialIndex}
          sizes={sizes}
          className={`object-cover transition duration-700 ease-out motion-reduce:transition-none ${
            index === activeIndex
              ? "scale-100 opacity-100"
              : "scale-[1.015] opacity-0"
          }`}
        />
      ))}
      <div className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0] text-[#06131a] shadow-sm">
        {activeImage.theme.label}
      </div>
      <div
        className="absolute bottom-3 right-3 flex gap-1.5"
        aria-hidden="true"
      >
        {images.map((image, index) => (
          <span
            key={image.theme.id}
            className={`block size-1.5 rounded-full transition ${
              index === activeIndex ? "bg-[#d5ff5f]" : "bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function stableThemeIndex(seed: string, count: number) {
  if (count <= 1) return 0;

  let total = 0;
  for (const char of seed) {
    total += char.charCodeAt(0);
  }

  return total % count;
}
