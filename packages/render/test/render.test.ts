import { describe, expect, it } from "vitest";
import { renderProofPdfPlaceholder } from "../src/index";

describe("render package", () => {
  it("creates a proof PDF placeholder with print warnings", async () => {
    const pdf = await renderProofPdfPlaceholder({
      designId: "design_test",
      productName: "Die-cut stickers",
      widthIn: 3,
      heightIn: 3,
      warnings: ["Final commercial validation requires live provider specs."],
    });

    expect(pdf.byteLength).toBeGreaterThan(500);
  });
});
