import { templates } from "@creator-print-ai/core";

export default function AdminTemplatesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">Template management</h1>
      <div className="mt-6 grid gap-3">
        {templates.map((template) => (
          <div key={template.id} className="rounded border border-slate-200 bg-white p-4">
            <p className="font-black">{template.name}</p>
            <p className="text-sm text-slate-600">{template.productSlug}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
