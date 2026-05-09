import { describe, expect, it } from "vitest";
import { createPromoComposition } from "../src/index";

describe("hyperframes package", () => {
  it("creates deterministic promo composition HTML metadata", () => {
    const composition = createPromoComposition({
      designId: "design_123",
      format: "tiktok-9x16",
      productName: "Sticker drop",
      handle: "@creator",
    });

    expect(composition.status).toBe("mock_render_ready");
    expect(composition.html).toContain("data-composition-id");
    expect(composition.script.hook).toContain("Sticker drop");
  });
});
