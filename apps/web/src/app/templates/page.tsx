import { TemplateCard } from "@/components/TemplateCard";
import { Reveal } from "@/components/ui/motion";
import { Surface } from "@/components/ui/surfaces";
import { templates } from "@creator-print-ai/core";

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Surface className="p-6 sm:p-8" tone="soft">
          <h1 className="text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            Template gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Real-life previews of editable layouts for sticker drops, QR
            campaigns, packaging labels, flyers, posters, and inserts.
          </p>
        </Surface>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </main>
  );
}
