import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getAiAssistant } from "@/lib/services";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
  designId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, chatSchema);
    const assistant = getAiAssistant();
    const lower = input.message.toLowerCase();

    if (lower.includes("recommend") || lower.includes("kit")) {
      const recommendations = await assistant.recommendProducts({ audience: "creator", goal: input.message });
      return apiOk({
        message: recommendations.map((item) => `${item.productSlug}: ${item.reason}`).join(" "),
        recommendations,
      });
    }

    const prompt = await assistant.improvePrompt({ prompt: input.message, audience: "creator" });
    return apiOk({ message: prompt.prompt });
  } catch (error) {
    return routeError(error);
  }
}
