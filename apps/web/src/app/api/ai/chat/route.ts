import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getAiAssistant } from "@/lib/services";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
  designId: z.string().optional(),
  productSlug: z.string().optional(),
  templateId: z.string().optional(),
  layers: z.array(z.string()).optional(),
  allowDirectEdits: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, chatSchema);
    const assistant = getAiAssistant();
    const lower = input.message.toLowerCase();

    if (input.allowDirectEdits) {
      const plan = await assistant.planDesignEdits({
        instruction: input.message,
        context: {
          designId: input.designId,
          productSlug: input.productSlug,
          templateId: input.templateId,
          layers: input.layers,
        },
      });

      if (plan.actions.length > 0) {
        return apiOk({ message: plan.summary, actions: plan.actions });
      }
    }

    if (lower.includes("recommend") || lower.includes("kit")) {
      const recommendations = await assistant.recommendProducts({
        audience: "creator",
        goal: input.message,
      });
      return apiOk({
        message: recommendations
          .map((item) => `${item.productSlug}: ${item.reason}`)
          .join(" "),
        recommendations,
      });
    }

    const prompt = await assistant.improvePrompt({
      prompt: input.message,
      audience: "creator",
    });
    return apiOk({ message: prompt.prompt });
  } catch (error) {
    return routeError(error);
  }
}
