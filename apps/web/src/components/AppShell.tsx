"use client";

import { cn } from "@/lib/utils";
import { primaryNav } from "@/lib/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-transparent text-[#06131a]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 font-black tracking-[0]"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-[#06131a] text-white shadow-[0_12px_34px_rgba(6,19,26,0.22)] transition group-hover:bg-[#007f88]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              CreatorPrint
              <span className="text-[#007f88]"> AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  isActivePath(pathname, item.href) &&
                    "bg-[#ecfeff] text-[#007f88]",
                )}
              >
                {item.label}
                {isActivePath(pathname, item.href) ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[#00a9b7]"
                  />
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/studio/new"
              className="hidden items-center gap-2 rounded-md bg-[#06131a] px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#007f88] sm:inline-flex"
            >
              <WandSparkles className="size-4" aria-hidden="true" />
              Open studio
            </Link>
            <Link
              href="/cart"
              className="inline-flex size-10 items-center justify-center rounded-md bg-[#d5ff5f] text-[#06131a] shadow-sm transition hover:bg-[#c7f34f]"
              aria-label="Open cart"
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-xs font-black text-slate-600",
                isActivePath(pathname, item.href) &&
                  "bg-[#ecfeff] text-[#007f88]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <motion.div
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
