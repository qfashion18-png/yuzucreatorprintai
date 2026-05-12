import { TemplateCard } from "@/components/TemplateCard";
import { templates } from "@creator-print-ai/core";

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-[0]">Template gallery</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Real-life previews of editable layouts for sticker drops, QR campaigns,
        packaging labels, flyers, posters, and inserts.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </main>
  );
}
