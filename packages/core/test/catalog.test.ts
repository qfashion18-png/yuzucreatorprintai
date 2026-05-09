import { describe, expect, it } from "vitest";
import {
  creatorDropKit,
  getProductBySlug,
  productCatalog,
  runPreflight,
  templateSchema,
  templates,
} from "../src/index";

describe("product catalog", () => {
  it("contains the MVP print categories and Creator Drop Kit", () => {
    expect(productCatalog).toHaveLength(10);
    expect(getProductBySlug("die-cut-stickers")?.name).toBe("Die-cut stickers");
    expect(creatorDropKit.items.map((item) => item.productSlug)).toContain("qr-creator-cards");
  });

  it("validates seeded template dimensions and provider hints", () => {
    const stickerTemplate = templates.find((template) => template.productSlug === "die-cut-stickers");

    expect(stickerTemplate).toBeDefined();
    expect(() => templateSchema.parse(stickerTemplate)).not.toThrow();
    expect(stickerTemplate?.providerHints?.provider).toBe("4over");
  });

  it("flags low-resolution assets and unsafe-zone layout issues", () => {
    const result = runPreflight({
      canvas: {
        widthIn: 3,
        heightIn: 3,
        dpi: 300,
        bleedIn: 0.125,
        safeZoneIn: 0.125,
      },
      assets: [
        {
          id: "asset-low",
          type: "image",
          widthPx: 240,
          heightPx: 240,
          mimeType: "image/png",
          hasTransparency: true,
        },
      ],
      objects: [
        {
          id: "text-1",
          type: "text",
          x: 5,
          y: 5,
          width: 80,
          height: 20,
        },
      ],
    });

    expect(result.status).toBe("warning");
    expect(result.warnings.some((warning) => warning.code === "LOW_RESOLUTION")).toBe(true);
    expect(result.warnings.some((warning) => warning.code === "OUTSIDE_SAFE_ZONE")).toBe(true);
  });
});
