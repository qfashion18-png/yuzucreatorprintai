import { describe, expect, it } from "vitest";
import { MockAiDesignAssistant } from "../src/index";

describe("AI design assistant", () => {
  it("returns creator-focused product recommendations", async () => {
    const assistant = new MockAiDesignAssistant();
    const recommendations = await assistant.recommendProducts({
      audience: "beauty creator",
      goal: "launch a limited merch drop",
    });

    expect(recommendations[0]?.productSlug).toBe("die-cut-stickers");
    expect(
      recommendations.some((item) => item.productSlug === "qr-creator-cards"),
    ).toBe(true);
  });

  it("explains preflight warnings in plain English", async () => {
    const assistant = new MockAiDesignAssistant();
    const explanation = await assistant.runPreflightNarration({
      status: "warning",
      checks: [],
      warnings: [
        {
          code: "LOW_RESOLUTION",
          message: "Image is low resolution",
          severity: "warning",
        },
      ],
      manualReviewRequired: false,
    });

    expect(explanation).toContain("print");
    expect(explanation).toContain("resolution");
  });

  it("plans direct design edits from a user instruction", async () => {
    const assistant = new MockAiDesignAssistant();
    const result = await assistant.planDesignEdits({
      instruction:
        'Add the text "Scan to join the drop", make the background teal, and add a QR code to https://creatorprint.ai/drop',
      context: {
        designId: "design_123",
        productSlug: "die-cut-stickers",
        layers: ["Background", "Drop art"],
      },
    });

    expect(result.summary).toContain("directly");
    expect(result.actions).toEqual([
      { type: "add_text", text: "Scan to join the drop" },
      { type: "set_background", color: "#00a9b7" },
      { type: "add_qr", url: "https://creatorprint.ai/drop" },
    ]);
  });
});
