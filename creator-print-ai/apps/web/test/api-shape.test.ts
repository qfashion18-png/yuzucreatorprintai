import { describe, expect, it } from "vitest";
import { uploadPresignSchema, ok, fail } from "@creator-print-ai/core";

describe("web API contracts", () => {
  it("uses the consistent API response shape", () => {
    expect(ok({ healthy: true })).toEqual({ ok: true, data: { healthy: true } });
    expect(fail("NOPE", "Nope")).toEqual({ ok: false, error: { code: "NOPE", message: "Nope", details: undefined } });
  });

  it("validates presigned upload inputs", () => {
    expect(() =>
      uploadPresignSchema.parse({
        fileName: "drop.png",
        fileType: "image/png",
        fileSize: 1200,
      }),
    ).not.toThrow();

    expect(() =>
      uploadPresignSchema.parse({
        fileName: "drop.exe",
        fileType: "application/x-msdownload",
        fileSize: 1200,
      }),
    ).toThrow();
  });
});
