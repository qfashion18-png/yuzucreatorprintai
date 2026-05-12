"use client";

import type { DesignEditAction } from "@creator-print-ai/ai";
import type { PreflightResult, PrintTemplate } from "@creator-print-ai/core";
import type { QuoteResult } from "@creator-print-ai/print-provider";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { BleedSafeZoneOverlay } from "@/components/BleedSafeZoneOverlay";
import { BrandKitPanel } from "@/components/BrandKitPanel";
import { LayerPanel } from "@/components/LayerPanel";
import { PreflightPanel } from "@/components/PreflightPanel";
import { ProofPreview } from "@/components/ProofPreview";
import { QrCodeTool } from "@/components/QrCodeTool";
import { QuoteSummary } from "@/components/QuoteSummary";
import { TextTool } from "@/components/TextTool";
import { UploadedAsset, UploadDropzone } from "@/components/UploadDropzone";
import { formatMoney } from "@/lib/utils";
import { promoVideoPosterImage } from "@/lib/visual-assets";
import { Download, FileCheck2, Save, ShoppingCart, Video } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type FabricObject = {
  name?: string;
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  set: (options: Record<string, unknown>) => void;
};

type FabricCanvas = {
  add: (...objects: FabricObject[]) => void;
  getObjects: () => FabricObject[];
  setActiveObject: (object: FabricObject) => void;
  requestRenderAll: () => void;
  dispose: () => void;
  toJSON: (propertiesToInclude?: string[]) => unknown;
  toDataURL: (options?: Record<string, unknown>) => string;
  sendObjectToBack?: (object: FabricObject) => void;
  backgroundColor?: string;
};

type FabricModule = {
  Canvas: new (
    element: HTMLCanvasElement,
    options: Record<string, unknown>,
  ) => FabricCanvas;
  Rect: new (options: Record<string, unknown>) => FabricObject;
  Textbox: new (text: string, options: Record<string, unknown>) => FabricObject;
  Group: new (
    objects: FabricObject[],
    options: Record<string, unknown>,
  ) => FabricObject;
  FabricImage?: {
    fromURL: (
      url: string,
    ) => Promise<FabricObject & { width: number; height: number }>;
  };
  Image?: {
    fromURL: (
      url: string,
    ) => Promise<FabricObject & { width: number; height: number }>;
  };
};

type StudioAsset = UploadedAsset & {
  type?: "image" | "generated_image";
};

export function StudioWorkspace({
  designId,
  template,
}: {
  designId: string;
  template: PrintTemplate;
}) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const fabricRef = useRef<FabricModule | null>(null);
  const [layers, setLayers] = useState<string[]>(["Background", "Guides"]);
  const [assets, setAssets] = useState<StudioAsset[]>([]);
  const [preflight, setPreflight] = useState<PreflightResult>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [quote, setQuote] = useState<QuoteResult>();
  const [promoStatus, setPromoStatus] = useState<string>();
  const [promoPreviewUrl, setPromoPreviewUrl] = useState<string>();

  const drawGuides = useCallback(
    (
      fabric: FabricModule,
      canvas: FabricCanvas,
      scale: number,
      width: number,
      height: number,
    ) => {
      const safe = template.safeZoneIn * scale;
      const bleed = template.bleedIn * scale;

      const trimRect = new fabric.Rect({
        left: bleed,
        top: bleed,
        originX: "left",
        originY: "top",
        width: width - bleed * 2,
        height: height - bleed * 2,
        fill: "transparent",
        stroke: "#ff6f61",
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: "guide-trim",
      });
      const safeRect = new fabric.Rect({
        left: safe,
        top: safe,
        originX: "left",
        originY: "top",
        width: width - safe * 2,
        height: height - safe * 2,
        fill: "transparent",
        stroke: "#00a9b7",
        strokeDashArray: [8, 8],
        strokeWidth: 2,
        selectable: false,
        evented: false,
        name: "guide-safe",
      });
      canvas.add(trimRect, safeRect);
      canvas.sendObjectToBack?.(trimRect);
      canvas.sendObjectToBack?.(safeRect);
    },
    [template],
  );

  useEffect(() => {
    let disposed = false;

    async function setupCanvas() {
      const fabric = (await import("fabric")) as unknown as FabricModule;
      if (disposed || !canvasElementRef.current) return;

      const maxWidth = 780;
      const maxHeight = 620;
      const scale = Math.min(
        maxWidth / template.widthIn,
        maxHeight / template.heightIn,
      );
      const width = Math.round(template.widthIn * scale);
      const height = Math.round(template.heightIn * scale);
      const canvas = new fabric.Canvas(canvasElementRef.current, {
        width,
        height,
        backgroundColor: template.backgroundColor ?? "#ffffff",
        preserveObjectStacking: true,
      });

      fabricRef.current = fabric;
      canvasRef.current = canvas;
      drawGuides(fabric, canvas, scale, width, height);

      for (const slot of template.slots) {
        if (slot.type === "text") {
          canvas.add(
            new fabric.Textbox(slot.defaultValue ?? "Creator drop", {
              left: slot.x / (template.dpi / scale),
              top: slot.y / (template.dpi / scale),
              originX: "left",
              originY: "top",
              width: Math.max(120, slot.width / (template.dpi / scale)),
              fontSize: 24,
              fontWeight: "800",
              fill:
                template.backgroundColor === "#071018" ||
                template.backgroundColor === "#101820"
                  ? "#ffffff"
                  : "#06131a",
              name: slot.id,
            }),
          );
        }
        if (slot.type === "image") {
          const left = slot.x / (template.dpi / scale);
          const top = slot.y / (template.dpi / scale);
          const width = Math.max(160, slot.width / (template.dpi / scale));
          const height = Math.max(120, slot.height / (template.dpi / scale));
          canvas.add(
            new fabric.Rect({
              left,
              top,
              originX: "left",
              originY: "top",
              width,
              height,
              fill: "#00a9b7",
              stroke: "#06131a",
              strokeDashArray: [10, 10],
              strokeWidth: 5,
              rx: 14,
              ry: 14,
              name: slot.id,
            }),
          );
          canvas.add(
            new fabric.Textbox("Drop art", {
              left: left + 18,
              top: top + Math.max(18, height / 2 - 18),
              originX: "left",
              originY: "top",
              width: Math.max(120, width - 36),
              fontSize: 30,
              fontWeight: "800",
              textAlign: "center",
              fill: "#ffffff",
              name: `${slot.id}-label`,
            }),
          );
        }
        if (slot.type === "qr") {
          addQrShape(
            canvas,
            fabric,
            slot.defaultValue ?? "https://creatorprint.ai",
            slot.x / (template.dpi / scale),
            slot.y / (template.dpi / scale),
          );
        }
        if (slot.type === "shape") {
          canvas.add(
            new fabric.Rect({
              left: slot.x / (template.dpi / scale),
              top: slot.y / (template.dpi / scale),
              originX: "left",
              originY: "top",
              width: Math.max(120, slot.width / (template.dpi / scale)),
              height: Math.max(80, slot.height / (template.dpi / scale)),
              fill: "#d5ff5f",
              rx: 10,
              ry: 10,
              name: slot.id,
            }),
          );
        }
      }
      canvas.requestRenderAll();
      refreshLayers(canvas);
    }

    void setupCanvas();

    return () => {
      disposed = true;
      canvasRef.current?.dispose();
      canvasRef.current = null;
    };
  }, [drawGuides, template]);

  function refreshLayers(canvas = canvasRef.current) {
    if (!canvas) return;
    setLayers(
      canvas
        .getObjects()
        .filter((object: FabricObject) => {
          const name = String(object.name ?? "");
          return (
            !name.startsWith("guide") &&
            !name.endsWith("-label") &&
            name !== "qr-block"
          );
        })
        .map(
          (object: FabricObject, index: number) =>
            object.name ?? `${object.type ?? "Layer"} ${index + 1}`,
        ),
    );
  }

  function addText(value: string) {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;

    canvas.add(
      new fabric.Textbox(value, {
        left: 80,
        top: 80,
        originX: "left",
        originY: "top",
        width: 260,
        fontSize: 32,
        fontWeight: "800",
        fill: "#06131a",
        name: "Text layer",
      }),
    );
    canvas.requestRenderAll();
    refreshLayers();
  }

  function addQr(url: string) {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;
    addQrShape(canvas, fabric, url, 120, 120);
    canvas.requestRenderAll();
    refreshLayers();
  }

  function setBackground(color: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.requestRenderAll();
  }

  async function addUploadedImage(asset: UploadedAsset) {
    await addImageAsset({ ...asset, type: "image" });
  }

  async function addImageAsset(asset: StudioAsset) {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;

    const FabricImage = fabric.FabricImage ?? fabric.Image;
    if (!FabricImage) return;
    const image = await FabricImage.fromURL(asset.dataUrl);
    image.set({
      left: 80,
      top: 100,
      originX: "left",
      originY: "top",
      scaleX: 240 / image.width,
      scaleY: 240 / image.height,
      name: asset.fileName,
    });
    canvas.add(image);
    canvas.setActiveObject(image);
    canvas.requestRenderAll();
    setAssets((current) => [...current, asset]);
    refreshLayers();
  }

  async function applyAssistantActions(actions: DesignEditAction[]) {
    for (const action of actions) {
      if (action.type === "add_text") {
        addText(action.text);
      }

      if (action.type === "set_background") {
        setBackground(action.color);
      }

      if (action.type === "add_qr") {
        addQr(action.url);
      }

      if (action.type === "generate_image") {
        const response = await fetch("/api/ai/generate-image", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt: action.prompt, size: "square" }),
        });
        const payload = await response.json();

        if (payload.ok && payload.data.imageUrl) {
          await addImageAsset({
            dataUrl: payload.data.imageUrl,
            fileName: "AI generated artwork",
            mimeType: "image/png",
            type: "generated_image",
          });
        }
      }
    }
  }

  async function saveDesign() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await fetch("/api/designs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: designId === "new" ? undefined : designId,
        productSlug: template.productSlug,
        templateId: template.id,
        name: `${template.name} design`,
        canvas: {
          widthIn: template.widthIn,
          heightIn: template.heightIn,
          dpi: template.dpi,
          bleedIn: template.bleedIn,
          safeZoneIn: template.safeZoneIn,
        },
        fabricJson: canvas.toJSON(["name"]),
        assets: assets.map((asset, index) => ({
          id: `asset_${index}`,
          type: asset.type ?? "image",
          url: asset.dataUrl,
          widthPx: asset.widthPx,
          heightPx: asset.heightPx,
          mimeType: asset.mimeType,
          hasTransparency: asset.mimeType.includes("png"),
        })),
      }),
    });
  }

  async function runPreflightCheck() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = canvas
      .getObjects()
      .filter(
        (object: FabricObject) =>
          !String(object.name ?? "").startsWith("guide"),
      )
      .map((object: FabricObject, index: number) => ({
        id: object.name ?? `object_${index}`,
        type:
          object.type === "image"
            ? "image"
            : object.type === "textbox"
              ? "text"
              : "shape",
        x: object.left ?? 0,
        y: object.top ?? 0,
        width: (object.width ?? 1) * (object.scaleX ?? 1),
        height: (object.height ?? 1) * (object.scaleY ?? 1),
      }));

    const response = await fetch("/api/preflight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        canvas: {
          widthIn: template.widthIn,
          heightIn: template.heightIn,
          dpi: template.dpi,
          bleedIn: template.bleedIn,
          safeZoneIn: template.safeZoneIn,
        },
        assets: assets.map((asset, index) => ({
          id: `asset_${index}`,
          type: "image",
          widthPx: asset.widthPx,
          heightPx: asset.heightPx,
          mimeType: asset.mimeType,
          hasTransparency: asset.mimeType.includes("png"),
        })),
        objects,
      }),
    });
    const payload = await response.json();
    if (payload.ok) setPreflight(payload.data);
  }

  async function exportProof() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    setPreviewUrl(dataUrl);
    await fetch("/api/proofs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        designId,
        productName: template.name,
        widthIn: template.widthIn,
        heightIn: template.heightIn,
        warnings: preflight?.warnings.map((warning) => warning.message) ?? [],
      }),
    });
  }

  async function getQuote() {
    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug: template.productSlug,
        quantity: 100,
        options: { finish: "matte", turnaround: "standard" },
        destinationPostalCode: "85001",
      }),
    });
    const payload = await response.json();
    if (payload.ok) setQuote(payload.data);
  }

  async function addToCart() {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug: template.productSlug,
        designId,
        quantity: quote?.quantity ?? 100,
        options: { finish: "matte" },
      }),
    });
    if (response.ok) await getQuote();
  }

  async function generatePromo() {
    const response = await fetch("/api/hyperframes/render", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        designId,
        format: "tiktok-9x16",
        productName: template.name,
        handle: "@creator",
      }),
    });
    const payload = await response.json();
    if (payload.ok) {
      setPromoStatus("Promo composition ready");
      setPromoPreviewUrl(promoVideoPosterImage.src);
    } else {
      setPromoStatus(payload.error.message);
    }
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">
      <aside className="space-y-4">
        <UploadDropzone onUpload={(asset) => void addUploadedImage(asset)} />
        <BrandKitPanel onColor={setBackground} />
        <LayerPanel layers={layers} />
      </aside>
      <section className="min-w-0 rounded border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-[0]">
              {template.name}
            </h1>
            <p className="text-sm text-slate-600">
              {template.widthIn} x {template.heightIn} in, {template.dpi} DPI
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TextTool onAddText={addText} />
            <QrCodeTool onAddQr={addQr} />
            <button
              type="button"
              onClick={() => void saveDesign()}
              className="inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-black"
            >
              <Save className="size-4" aria-hidden="true" />
              Save
            </button>
            <button
              type="button"
              onClick={() => void exportProof()}
              className="inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-black"
            >
              <Download className="size-4" aria-hidden="true" />
              Proof
            </button>
          </div>
        </div>
        <div className="overflow-auto rounded bg-slate-100 p-4">
          <canvas
            ref={canvasElementRef}
            className="mx-auto"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <BleedSafeZoneOverlay />
          {quote ? (
            <span className="text-sm font-black">
              Mock quote: {formatMoney(quote.totalCents)}
            </span>
          ) : null}
        </div>
      </section>
      <aside className="space-y-4">
        <AIAssistantPanel
          designId={designId}
          layers={layers}
          productSlug={template.productSlug}
          templateId={template.id}
          onApplyActions={applyAssistantActions}
        />
        <PreflightPanel result={preflight} />
        <ProofPreview previewUrl={previewUrl} />
        <QuoteSummary quote={quote} />
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => void runPreflightCheck()}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#06131a] px-4 py-3 text-sm font-black text-white"
          >
            <FileCheck2 className="size-4" aria-hidden="true" />
            Run preflight
          </button>
          <button
            type="button"
            onClick={() => void getQuote()}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#d5ff5f] px-4 py-3 text-sm font-black text-[#06131a]"
          >
            Generate quote
          </button>
          <button
            type="button"
            onClick={() => void addToCart()}
            className="inline-flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-3 text-sm font-black"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => void generatePromo()}
            className="inline-flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-3 text-sm font-black"
          >
            <Video className="size-4" aria-hidden="true" />
            Generate promo video
          </button>
          {promoStatus ? (
            <p className="text-xs font-semibold text-[#007f88]">
              {promoStatus}
            </p>
          ) : null}
          {promoPreviewUrl ? (
            <div className="relative aspect-[9/16] overflow-hidden rounded border border-slate-200 bg-[#06131a]">
              <Image
                src={promoPreviewUrl}
                alt={promoVideoPosterImage.alt}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </aside>
    </main>
  );
}

function addQrShape(
  canvas: FabricCanvas,
  fabric: FabricModule,
  url: string,
  left: number,
  top: number,
) {
  const rect = new fabric.Rect({
    width: 116,
    height: 116,
    left,
    top,
    originX: "left",
    originY: "top",
    fill: "#ffffff",
    stroke: "#06131a",
    strokeWidth: 3,
    name: `QR ${url}`,
  });
  const finderA = new fabric.Rect({
    width: 24,
    height: 24,
    left: left + 14,
    top: top + 14,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  const finderB = new fabric.Rect({
    width: 24,
    height: 24,
    left: left + 78,
    top: top + 14,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  const finderC = new fabric.Rect({
    width: 24,
    height: 24,
    left: left + 14,
    top: top + 78,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  canvas.add(rect, finderA, finderB, finderC);
}
