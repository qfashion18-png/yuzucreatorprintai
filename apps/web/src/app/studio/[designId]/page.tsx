import { StudioWorkspace } from "@/features/studio/StudioWorkspace";
import { getTemplateById, templates } from "@creator-print-ai/core";

export default async function StudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ designId: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const [{ designId }, query] = await Promise.all([params, searchParams]);
  const template = (query.template ? getTemplateById(query.template) : undefined) ?? templates[0];

  return <StudioWorkspace designId={designId} template={template} />;
}
