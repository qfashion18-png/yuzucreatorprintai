import { describe, expect, it } from "vitest";
import type { PreflightResult } from "@creator-print-ai/core";
import {
  buildCreatorReadiness,
  buildLaunchTimeline,
  createUniqueLayerName,
  creatorChannels,
  sampleDropMetrics,
} from "./creator-studio-model";

const cleanPreflight: PreflightResult = {
  status: "pass",
  checks: [
    { code: "FILE_TYPES", label: "Supported image file types", passed: true },
    { code: "RESOLUTION", label: "Artwork resolution", passed: true },
    { code: "SAFE_ZONE", label: "Safe-zone layout", passed: true },
  ],
  warnings: [],
  manualReviewRequired: false,
};

describe("creator studio model", () => {
  it("blocks launch approval until proof, quote, and placement reviews are complete", () => {
    const readiness = buildCreatorReadiness({
      assetCount: 1,
      preflight: cleanPreflight,
      hasProof: false,
      hasQuote: false,
      selectedVariantCount: 1,
      requiredVariantCount: 3,
      scheduledPostCount: 2,
    });

    expect(readiness.status).toBe("blocked");
    expect(readiness.progressPercent).toBe(50);
    expect(
      readiness.items
        .filter((item) => item.status === "blocked")
        .map((item) => item.id),
    ).toEqual(["proof", "quote", "variants"]);
  });

  it("marks warning preflight as review-needed without blocking completed commerce steps", () => {
    const readiness = buildCreatorReadiness({
      assetCount: 2,
      preflight: {
        ...cleanPreflight,
        status: "warning",
        warnings: [
          {
            code: "OUTSIDE_SAFE_ZONE",
            message: "Text is near the trim edge.",
            severity: "warning",
          },
        ],
      },
      hasProof: true,
      hasQuote: true,
      selectedVariantCount: 3,
      requiredVariantCount: 3,
      scheduledPostCount: 3,
    });

    expect(readiness.status).toBe("review");
    expect(readiness.blockingCount).toBe(0);
    expect(readiness.warningCount).toBe(1);
    expect(readiness.progressPercent).toBe(100);
  });

  it("builds a launch timeline from selected channels in due-date order", () => {
    const selectedChannelIds = creatorChannels
      .filter((channel) => channel.defaultSelected)
      .map((channel) => channel.id);
    const timeline = buildLaunchTimeline({
      launchDate: "2026-06-15",
      selectedChannelIds,
      productName: "Bold Face Sticker",
    });

    expect(timeline.map((item) => item.id)).toEqual([
      "proof-approval",
      "short-video",
      "email-drop",
      "storefront",
      "launch-day",
    ]);
    expect(timeline[0]).toMatchObject({
      date: "2026-06-05",
      label: "Approve print proof",
      status: "due",
    });
    expect(timeline.at(-1)).toMatchObject({
      date: "2026-06-15",
      label: "Launch Bold Face Sticker",
      status: "scheduled",
    });
  });

  it("exposes mock metrics that can power an interactive funnel", () => {
    expect(sampleDropMetrics.revenueCents).toBeGreaterThan(
      sampleDropMetrics.spendCents,
    );
    expect(sampleDropMetrics.variants).toHaveLength(3);
    expect(
      sampleDropMetrics.variants.some((variant) => variant.status === "winner"),
    ).toBe(true);
  });

  it("creates unique layer names when a tool inserts the same asset twice", () => {
    expect(
      createUniqueLayerName("QR https://creatorprint.ai/drop", [
        "hero-art",
        "QR https://creatorprint.ai/drop",
        "QR https://creatorprint.ai/drop 2",
      ]),
    ).toBe("QR https://creatorprint.ai/drop 3");
  });
});
