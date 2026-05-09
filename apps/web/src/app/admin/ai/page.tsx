import { readAppConfig } from "@creator-print-ai/config";

export default function AdminAiPage() {
  const config = readAppConfig();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-[0]">AI configuration</h1>
      <div className="mt-6 rounded border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold uppercase text-slate-500">Current provider</p>
        <p className="mt-1 text-2xl font-black">{config.aiProvider}</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Bedrock model IDs and Guardrail IDs are environment-driven. Mock AI is enabled locally by default.
        </p>
      </div>
    </main>
  );
}
