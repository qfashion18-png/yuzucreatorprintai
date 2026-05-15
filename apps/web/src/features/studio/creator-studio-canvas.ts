import type { PrintTemplate } from "@creator-print-ai/core";

export type StudioCanvasObject = {
  name?: string;
  type?: string;
  studioType?: "image" | "text" | "qr" | "shape";
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
};

export type StudioCanvasLike = {
  width?: number;
  getWidth?: () => number;
};

function isHiddenLayerName(name: string) {
  return (
    name.startsWith("guide") || name.endsWith("-label") || name === "qr-block"
  );
}

export function getVisibleLayerNames(objects: StudioCanvasObject[]) {
  return objects
    .filter((object) => !isHiddenLayerName(String(object.name ?? "")))
    .map(
      (object, index) =>
        object.name ?? `${object.type ?? "Layer"} ${index + 1}`,
    );
}

export function getCanvasDisplayScale(
  template: Pick<PrintTemplate, "widthIn" | "dpi">,
  canvas: StudioCanvasLike,
) {
  const renderedWidth = canvas.getWidth?.() ?? canvas.width;
  if (!renderedWidth) return template.dpi;
  return renderedWidth / template.widthIn;
}

export function getStudioObjectType(
  object: StudioCanvasObject,
): "image" | "text" | "qr" | "shape" {
  if (object.studioType) return object.studioType;
  if (String(object.name ?? "").startsWith("QR ") || object.type === "group") {
    return "qr";
  }
  if (object.type === "image") return "image";
  if (object.type === "textbox") return "text";
  return "shape";
}

export function mapCanvasObjectsToPreflight({
  objects,
  template,
  canvas,
}: {
  objects: StudioCanvasObject[];
  template: Pick<PrintTemplate, "widthIn" | "dpi">;
  canvas: StudioCanvasLike;
}) {
  const displayScale = getCanvasDisplayScale(template, canvas);
  const canvasToPrintMultiplier = template.dpi / displayScale;

  return objects
    .filter((object) => !isHiddenLayerName(String(object.name ?? "")))
    .map((object, index) => ({
      id: object.name ?? `object_${index}`,
      type: getStudioObjectType(object),
      x: Math.round((object.left ?? 0) * canvasToPrintMultiplier),
      y: Math.round((object.top ?? 0) * canvasToPrintMultiplier),
      width: Math.max(
        1,
        Math.round(
          (object.width ?? 1) * (object.scaleX ?? 1) * canvasToPrintMultiplier,
        ),
      ),
      height: Math.max(
        1,
        Math.round(
          (object.height ?? 1) *
            (object.scaleY ?? 1) *
            canvasToPrintMultiplier,
        ),
      ),
    }));
}
