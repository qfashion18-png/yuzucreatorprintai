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
    expect(recommendations.some((item) => item.productSlug === "qr-creator-cards")).toBe(true);
  });

  it("explains preflight warnings in plain English", async () => {
    const assistant = new MockAiDesignAssistant();
    const explanation = await assistant.runPreflightNarration({
      status: "warning",
      checks: [],
      warnings: [{ code: "LOW_RESOLUTION", message: "Image is low resolution", severity: "warning" }],
      manualReviewRequired: false,
    });

    expect(explanation).toContain("print");
    expect(explanation).toContain("resolution");
  });
});
