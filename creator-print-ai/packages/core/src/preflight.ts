import { preflightInputSchema } from "./schemas";
import type { PreflightIssue, PreflightResult } from "./types";

const supportedMimeTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"]);

export type PreflightInput = Parameters<typeof preflightInputSchema.parse>[0];

export function runPreflight(input: PreflightInput): PreflightResult {
  const parsed = preflightInputSchema.parse(input);
  const warnings: PreflightIssue[] = [];
  const checks: PreflightResult["checks"] = [];
  const canvasWidthPx = parsed.canvas.widthIn * parsed.canvas.dpi;
  const canvasHeightPx = parsed.canvas.heightIn * parsed.canvas.dpi;
  const safeInsetPx = parsed.canvas.safeZoneIn * parsed.canvas.dpi;

  for (const asset of parsed.assets) {
    if (asset.mimeType && !supportedMimeTypes.has(asset.mimeType.toLowerCase())) {
      warnings.push({
        code: "UNSUPPORTED_FILE_TYPE",
        message: `${asset.mimeType} is not supported for print upload.`,
        severity: "error",
        targetId: asset.id,
      });
    }

    if (asset.type === "image" && asset.widthPx && asset.heightPx) {
      const shortestSide = Math.min(asset.widthPx, asset.heightPx);
      const recommendedSide = Math.min(canvasWidthPx, canvasHeightPx);

      if (shortestSide < recommendedSide * 0.75) {
        warnings.push({
          code: "LOW_RESOLUTION",
          message: "Uploaded artwork may be too low resolution for the selected print size.",
          severity: "warning",
          targetId: asset.id,
        });
      }
    }

    if (asset.hasTransparency) {
      warnings.push({
        code: "TRANSPARENCY_PRESENT",
        message: "Transparency was detected. Confirm the background and white ink behavior with final provider specs.",
        severity: "info",
        targetId: asset.id,
      });
    }
  }

  for (const object of parsed.objects) {
    const outsideSafeZone =
      object.x < safeInsetPx ||
      object.y < safeInsetPx ||
      object.x + object.width > canvasWidthPx - safeInsetPx ||
      object.y + object.height > canvasHeightPx - safeInsetPx;

    if (outsideSafeZone) {
      warnings.push({
        code: "OUTSIDE_SAFE_ZONE",
        message: `${object.type} layer is outside the safe zone and may trim too close to the edge.`,
        severity: "warning",
        targetId: object.id,
      });
    }
  }

  checks.push(
    {
      code: "FILE_TYPES",
      label: "Supported image file types",
      passed: !warnings.some((warning) => warning.code === "UNSUPPORTED_FILE_TYPE"),
    },
    {
      code: "RESOLUTION",
      label: "Artwork resolution",
      passed: !warnings.some((warning) => warning.code === "LOW_RESOLUTION"),
    },
    {
      code: "SAFE_ZONE",
      label: "Safe-zone layout",
      passed: !warnings.some((warning) => warning.code === "OUTSIDE_SAFE_ZONE"),
    },
  );

  const hasErrors = warnings.some((warning) => warning.severity === "error");
  const hasWarnings = warnings.some((warning) => warning.severity === "warning");

  return {
    status: hasErrors ? "fail" : hasWarnings ? "warning" : "pass",
    checks,
    warnings,
    manualReviewRequired: hasErrors,
  };
}
