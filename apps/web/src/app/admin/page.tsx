import { AdminProviderStatus } from "@/components/AdminProviderStatus";
import { readAppConfig } from "@creator-print-ai/config";
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
      <h1 className="text-4xl font-black tracking-[0]">Admin dashboard</h1>
      <div className="mt-8">
        <AdminProviderStatus providerMode={config.printProvider} aiMode={config.aiProvider} configured={Boolean(config.fourOver.secretId || config.fourOver.apiKey)} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded border border-slate-200 bg-white p-5 text-lg font-black hover:border-[#00a9b7]">
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
