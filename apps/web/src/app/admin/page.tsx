import { AdminProviderStatus } from "@/components/AdminProviderStatus";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { readAppConfig } from "@creator-print-ai/config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const config = readAppConfig();
  const links = [
    ["/admin/orders", "Order management"],
    ["/admin/products", "Product/provider mapping"],
    ["/admin/templates", "Template management"],
    ["/admin/provider", "4over provider settings"],
    ["/admin/ai", "AI usage and config"],
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Surface className="p-6 sm:p-8" tone="soft">
          <h1 className="text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Monitor mock provider readiness, product mappings, print orders, and
            AI configuration from one operating view.
          </p>
        </Surface>
      </Reveal>
      <div className="mt-8">
        <AdminProviderStatus
          providerMode={config.printProvider}
          aiMode={config.aiProvider}
          configured={Boolean(config.fourOver.secretId || config.fourOver.apiKey)}
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-5 text-lg font-black shadow-[0_18px_50px_rgba(6,19,26,0.06)] transition hover:-translate-y-0.5 hover:border-[#00a9b7]"
          >
            <span>{label}</span>
            <ArrowRight
              className="size-5 text-[#007f88] transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
