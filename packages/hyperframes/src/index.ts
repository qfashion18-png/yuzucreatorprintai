import { z } from "zod";

export const promoCompositionInputSchema = z.object({
  designId: z.string(),
  format: z.enum(["tiktok-9x16", "instagram-1x1", "launch-16x9"]),
  productName: z.string(),
  handle: z.string().default("@creator"),
});

export type PromoCompositionInput = z.infer<typeof promoCompositionInputSchema>;

export type PromoComposition = {
  id: string;
  status: "mock_render_ready";
  format: PromoCompositionInput["format"];
  script: {
    hook: string;
    reveal: string;
    cta: string;
  };
  html: string;
  renderInstructions: string;
};

const formats = {
  "tiktok-9x16": { width: 1080, height: 1920, duration: 9, label: "9:16 TikTok sticker drop promo" },
  "instagram-1x1": { width: 1080, height: 1080, duration: 8, label: "1:1 Instagram product reveal" },
  "launch-16x9": { width: 1920, height: 1080, duration: 10, label: "16:9 launch explainer" },
} as const;

export function createPromoComposition(input: PromoCompositionInput): PromoComposition {
  const parsed = promoCompositionInputSchema.parse(input);
  const format = formats[parsed.format];
  const script = {
    hook: `${parsed.productName} is ready for the next creator drop.`,
    reveal: `Show the print proof, the QR CTA, and the pack-in moment for ${parsed.handle}.`,
    cta: `Scan, follow, and join the drop with ${parsed.handle}.`,
  };
  const html = buildCompositionHtml(parsed, script, format);

  return {
    id: `promo_${parsed.designId}_${parsed.format}`,
    status: "mock_render_ready",
    format: parsed.format,
    script,
    html,
    renderInstructions: "Save this HTML as a HyperFrames composition and run `hyperframes render` when the CLI is available.",
  };
}

function buildCompositionHtml(
  input: PromoCompositionInput,
  script: PromoComposition["script"],
  format: { width: number; height: number; duration: number; label: string },
): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${format.label}</title>
  <style>
    body { margin: 0; font-family: Inter, Arial, sans-serif; background: #06131a; }
    [data-composition-id="creatorprint-promo"] { width: ${format.width}px; height: ${format.height}px; background: #f8fbff; color: #06131a; overflow: hidden; position: relative; }
    .scene-content { width: 100%; height: 100%; box-sizing: border-box; padding: ${input.format === "tiktok-9x16" ? "140px 96px" : "90px 110px"}; display: flex; flex-direction: column; justify-content: center; gap: 34px; }
    .label { color: #007f88; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 0; }
    h1 { margin: 0; font-size: ${input.format === "launch-16x9" ? "104px" : "92px"}; line-height: 0.95; max-width: 920px; }
    p { margin: 0; font-size: 36px; line-height: 1.2; max-width: 820px; color: #26343b; }
    .proof { width: 64%; aspect-ratio: 4 / 3; background: #ffffff; border: 6px solid #00a9b7; box-shadow: 18px 18px 0 #ff6f61; display: grid; place-items: center; font-size: 36px; font-weight: 900; }
    .cta { color: #06131a; background: #d5ff5f; display: inline-flex; align-items: center; width: fit-content; padding: 20px 28px; font-size: 32px; font-weight: 900; }
  </style>
</head>
<body>
  <div data-composition-id="creatorprint-promo" data-width="${format.width}" data-height="${format.height}">
    <section id="scene-1" data-start="0" data-duration="${format.duration}" data-track-index="1">
      <div class="scene-content">
        <div class="label">CreatorPrint AI</div>
        <h1>${script.hook}</h1>
        <div class="proof">Design ${input.designId}</div>
        <p>${script.reveal}</p>
        <div class="cta">${script.cta}</div>
      </div>
    </section>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      tl.from(".label", { y: 40, opacity: 0, duration: 0.55, ease: "power3.out" }, 0.2);
      tl.from("h1", { x: -50, opacity: 0, duration: 0.75, ease: "expo.out" }, 0.45);
      tl.from(".proof", { scale: 0.9, rotation: -2, opacity: 0, duration: 0.7, ease: "back.out(1.4)" }, 1.1);
      tl.from("p", { y: 34, opacity: 0, duration: 0.5, ease: "power2.out" }, 1.7);
      tl.from(".cta", { y: 28, opacity: 0, duration: 0.45, ease: "circ.out" }, 2.2);
      tl.to(".scene-content", { opacity: 0, duration: 0.5, ease: "power2.in" }, ${format.duration - 0.7});
      window.__timelines["creatorprint-promo"] = tl;
    </script>
  </div>
</body>
</html>`;
}
