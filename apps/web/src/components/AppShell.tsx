import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import { ShoppingCart, Sparkles } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#06131a]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-black tracking-[0]">
            <span className="grid size-9 place-items-center rounded bg-[#06131a] text-white">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <span>CreatorPrint AI</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/cart"
            className="inline-flex size-10 items-center justify-center rounded bg-[#d5ff5f] text-[#06131a] transition hover:bg-[#c7f34f]"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
