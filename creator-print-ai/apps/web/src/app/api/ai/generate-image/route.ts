import { apiOk, parseJson, routeError } from "@/lib/api-response";
import { getAiAssistant } from "@/lib/services";
import { z } from "zod";

const generateImageSchema = z.object({
  prompt: z.string().min(1),
  brandColors: z.array(z.string()).optional(),
  size: z.enum(["square", "portrait", "landscape"]).optional(),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, generateImageSchema);
    return apiOk(await getAiAssistant().generateImage(input));
  } catch (error) {
    return routeError(error);
  }
}
