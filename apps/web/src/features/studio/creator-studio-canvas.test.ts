import { describe, expect, it } from "vitest";
import {
  getCanvasDisplayScale,
  getVisibleLayerNames,
  mapCanvasObjectsToPreflight,
} from "./creator-studio-canvas";

describe("creator studio canvas helpers", () => {
  it("filters helper-only objects out of the visible layer list", () => {
    expect(
      getVisibleLayerNames([
        { name: "guide-safe", type: "rect" },
        { name: "hero-art", type: "rect" },
        { name: "hero-art-label", type: "textbox" },
        { name: "QR https://creatorprint.ai/drop", type: "group" },
        { name: "qr-block", type: "rect" },
      ]),
    ).toEqual(["hero-art", "QR https://creatorprint.ai/drop"]);
  });

  it("derives display scale from the rendered canvas width", () => {
    expect(
      getCanvasDisplayScale({
        widthIn: 3,
        dpi: 300,
      }, {
        width: 620,
      }),
    ).toBeCloseTo(206.6667, 3);
  });

  it("maps rendered canvas coordinates back into print-space pixels for preflight", () => {
    const mapped = mapCanvasObjectsToPreflight({
      objects: [
        {
          name: "near-edge",
          type: "textbox",
          left: 520,
          top: 520,
          width: 90,
          height: 50,
        },
        {
          name: "QR https://creatorprint.ai/drop",
          type: "group",
          studioType: "qr",
          left: 120,
          top: 120,
          width: 116,
          height: 116,
        },
      ],
      template: {
        widthIn: 3,
        dpi: 300,
      },
      canvas: {
        width: 620,
      },
    });

    expect(mapped[0]).toMatchObject({
      id: "near-edge",
      type: "text",
    });
    expect(mapped[0].x).toBeGreaterThan(750);
    expect(mapped[0].x + mapped[0].width).toBeGreaterThan(860);

    expect(mapped[1]).toMatchObject({
      id: "QR https://creatorprint.ai/drop",
      type: "qr",
    });
  });
});
