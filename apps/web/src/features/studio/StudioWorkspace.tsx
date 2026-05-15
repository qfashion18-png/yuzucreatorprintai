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
import { AnimatedProgress } from "@/components/ui/motion";
import { MetricTile, StatusPill, Surface } from "@/components/ui/surfaces";
import {
  buildCreatorReadiness,
  buildLaunchTimeline,
  createUniqueLayerName,
  creatorChannels,
  sampleDropMetrics,
  studioBrandKits,
  studioPlacementVariants,
} from "@/features/studio/creator-studio-model";
import {
  getVisibleLayerNames,
  mapCanvasObjectsToPreflight,
} from "@/features/studio/creator-studio-canvas";
import { formatMoney } from "@/lib/utils";
import { promoVideoPosterImage } from "@/lib/visual-assets";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  Grid2X2,
  Megaphone,
  PackageCheck,
  Save,
  ShoppingCart,
  Sparkles,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type FabricObject = {
  name?: string;
  type?: string;
  studioType?: "image" | "text" | "qr" | "shape";
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
  getHeight?: () => number;
  getObjects: () => FabricObject[];
  getWidth?: () => number;
  setActiveObject: (object: FabricObject) => void;
  requestRenderAll: () => void;
  dispose: () => void;
  toJSON: (propertiesToInclude?: string[]) => unknown;
  toDataURL: (options?: Record<string, unknown>) => string;
  sendObjectToBack?: (object: FabricObject) => void;
  loadFromJSON?: (json: unknown) => Promise<unknown>;
  on?: (
    eventName: string,
    handler: (event?: FabricCanvasEvent) => void,
  ) => void;
  off?: (
    eventName: string,
    handler: (event?: FabricCanvasEvent) => void,
  ) => void;
  backgroundColor?: string;
  height?: number;
  width?: number;
};

type FabricCanvasEvent = {
  selected?: FabricObject[];
  target?: FabricObject;
};

type FabricModule = {
  FabricObject?: {
    customProperties?: string[];
  };
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
  const [activeDesignId, setActiveDesignId] = useState<string | undefined>(
    designId === "new" ? undefined : designId,
  );
  const [activeStudioView, setActiveStudioView] = useState<
    "design" | "mockups" | "calendar" | "analytics"
  >("design");
  const [selectedLayer, setSelectedLayer] = useState<string>();
  const [activeKitId, setActiveKitId] = useState(studioBrandKits[0].id);
  const [dropName, setDropName] = useState(`${template.name} drop`);
  const [launchDate, setLaunchDate] = useState("2026-06-15");
  const [caption, setCaption] = useState(
    "Fresh print drop is almost live. Scan, save, and share it with your crew.",
  );
  const [quantity, setQuantity] = useState(100);
  const [finish, setFinish] = useState("matte");
  const [turnaround, setTurnaround] = useState("standard");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    creatorChannels
      .filter((channel) => channel.defaultSelected)
      .map((channel) => channel.id),
  );
  const [reviewedVariants, setReviewedVariants] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState("Unsaved changes");
  const [proofStatus, setProofStatus] = useState<string>();
  const [cartStatus, setCartStatus] = useState<string>();

  const activeKit =
    studioBrandKits.find((kit) => kit.id === activeKitId) ?? studioBrandKits[0];
  const readiness = buildCreatorReadiness({
    assetCount: assets.length,
    preflight,
    hasProof: Boolean(previewUrl),
    hasQuote: Boolean(quote),
    selectedVariantCount: reviewedVariants.length,
    requiredVariantCount: studioPlacementVariants.length,
    scheduledPostCount: selectedChannels.length,
  });
  const timeline = buildLaunchTimeline({
    launchDate,
    selectedChannelIds: selectedChannels,
    productName: template.name,
  });

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
      if (fabric.FabricObject) {
        fabric.FabricObject.customProperties = Array.from(
          new Set([
            ...(fabric.FabricObject.customProperties ?? []),
            "name",
            "studioType",
          ]),
        );
      }

      const viewportWidth =
        typeof window === "undefined" ? 1024 : window.innerWidth;
      const maxWidth = Math.min(780, Math.max(280, viewportWidth - 96));
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
      const syncSelectedLayer = (event?: FabricCanvasEvent) => {
        const nextSelection = event?.selected?.[0] ?? event?.target;
        setSelectedLayer(nextSelection?.name);
      };
      const clearSelectedLayer = () => setSelectedLayer(undefined);
      const syncCanvasMutation = () => {
        refreshLayers(canvas);
        markDirty();
      };

      async function seedTemplateCanvas() {
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
                studioType: "text",
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
                studioType: "image",
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
                studioType: "shape",
              }),
            );
          }
        }
      }

      async function loadSavedDesign() {
        if (designId === "new") return false;

        const response = await fetch(`/api/designs/${designId}`);
        if (!response.ok) return false;

        const payload = await response.json();
        if (!payload.ok || !payload.data?.fabricJson || !canvas.loadFromJSON) {
          return false;
        }

        await canvas.loadFromJSON(payload.data.fabricJson);
        setAssets(
          Array.isArray(payload.data.assets)
            ? payload.data.assets
                .filter(
                  (asset: Record<string, unknown>) =>
                    typeof asset.url === "string" &&
                    typeof asset.mimeType === "string",
                )
                .map((asset: Record<string, unknown>) => ({
                  dataUrl: String(asset.url),
                  fileName: String(asset.id ?? "Saved asset"),
                  mimeType: String(asset.mimeType),
                  widthPx:
                    typeof asset.widthPx === "number" ? asset.widthPx : undefined,
                  heightPx:
                    typeof asset.heightPx === "number"
                      ? asset.heightPx
                      : undefined,
                  type:
                    asset.type === "generated_image"
                      ? "generated_image"
                      : "image",
                }))
            : [],
        );
        return true;
      }

      fabricRef.current = fabric;
      canvasRef.current = canvas;
      const loadedSavedDesign = await loadSavedDesign();
      if (!loadedSavedDesign) {
        await seedTemplateCanvas();
      }

      canvas.requestRenderAll();
      refreshLayers(canvas);
      canvas.on?.("selection:created", syncSelectedLayer);
      canvas.on?.("selection:updated", syncSelectedLayer);
      canvas.on?.("selection:cleared", clearSelectedLayer);
      canvas.on?.("object:modified", syncCanvasMutation);
    }

    void setupCanvas();

    return () => {
      disposed = true;
      canvasRef.current?.dispose();
      canvasRef.current = null;
    };
  }, [designId, drawGuides, template]);

  function refreshLayers(canvas = canvasRef.current) {
    if (!canvas) return;
    const nextLayers = getVisibleLayerNames(canvas.getObjects());
    setLayers(nextLayers);
    setSelectedLayer((current) =>
      current && nextLayers.includes(current) ? current : nextLayers[0],
    );
  }

  function markDirty() {
    setSaveStatus("Unsaved changes");
    setPreviewUrl(undefined);
    setProofStatus(undefined);
    setCartStatus(undefined);
    setPromoStatus(undefined);
    setPromoPreviewUrl(undefined);
  }

  function selectLayer(layerName: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const object = canvas
      .getObjects()
      .find((item) => String(item.name ?? "") === layerName);

    if (object) {
      canvas.setActiveObject(object);
      canvas.requestRenderAll();
      setSelectedLayer(layerName);
    }
  }

  function addText(
    value: string,
    options: {
      fill?: string;
      fontSize?: number;
      left?: number;
      top?: number;
      width?: number;
    } = {},
  ) {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;
    const layerName = createUniqueLayerName(
      "Text layer",
      canvas.getObjects().map((object) => String(object.name ?? "")),
    );
    const textLayer = new fabric.Textbox(value, {
      left: options.left ?? 80,
      top: options.top ?? 80,
      originX: "left",
      originY: "top",
      width: options.width ?? 260,
      fontSize: options.fontSize ?? 32,
      fontWeight: "800",
      fill: options.fill ?? "#06131a",
      name: layerName,
      studioType: "text",
    });

    canvas.add(textLayer);
    canvas.setActiveObject(textLayer);
    canvas.requestRenderAll();
    refreshLayers();
    setSelectedLayer(layerName);
    markDirty();
  }

  function addQr(url: string, left = 120, top = 120) {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;
    const layerName = createUniqueLayerName(
      `QR ${url}`,
      canvas.getObjects().map((object) => String(object.name ?? "")),
    );
    const qrObject = addQrShape(
      canvas,
      fabric,
      url,
      left,
      top,
      layerName,
    );
    canvas.setActiveObject(qrObject);
    canvas.requestRenderAll();
    refreshLayers();
    setSelectedLayer(layerName);
    markDirty();
  }

  function setBackground(color: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.backgroundColor = color;
    canvas.requestRenderAll();
    markDirty();
  }

  function applyBrandKit() {
    const canvas = canvasRef.current;
    const canvasWidth = canvas?.getWidth?.() ?? canvas?.width ?? 620;
    const canvasHeight = canvas?.getHeight?.() ?? canvas?.height ?? 620;
    const qrLeft = Math.max(36, canvasWidth - 160);
    const qrTop = Math.max(36, canvasHeight - 160);

    setBackground(activeKit.colors.at(-1) ?? "#ffffff");
    addText(activeKit.headline, {
      left: canvasWidth * 0.08,
      top: canvasHeight * 0.08,
      width: canvasWidth * 0.46,
      fontSize: 28,
    });
    addText(activeKit.handle, {
      left: canvasWidth * 0.08,
      top: Math.max(canvasHeight - 86, canvasHeight * 0.72),
      width: canvasWidth * 0.5,
      fontSize: 20,
    });
    addQr(activeKit.url, qrLeft, qrTop);
    setCaption(
      `${activeKit.headline}: ${template.name} goes live ${formatReadableDate(launchDate)}. Save the drop link and share it with your community.`,
    );
    setSaveStatus("Brand kit applied");
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
      studioType: "image",
    });
    canvas.add(image);
    canvas.setActiveObject(image);
    canvas.requestRenderAll();
    setAssets((current) => [...current, asset]);
    refreshLayers();
    markDirty();
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
    markDirty();
  }

  async function saveDesign(): Promise<string | undefined> {
    const canvas = canvasRef.current;
    if (!canvas) return activeDesignId;
    const renderSnapshotUrl = canvas.toDataURL({
      format: "png",
      multiplier: getPrintSnapshotMultiplier(canvas, template),
    });

    setSaveStatus("Saving...");
    const response = await fetch("/api/designs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: activeDesignId,
        productSlug: template.productSlug,
        templateId: template.id,
        name: dropName,
        canvas: {
          widthIn: template.widthIn,
          heightIn: template.heightIn,
          dpi: template.dpi,
          bleedIn: template.bleedIn,
          safeZoneIn: template.safeZoneIn,
        },
        fabricJson: canvas.toJSON(["name", "studioType"]),
        renderSnapshotUrl,
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
    const payload = await response.json();

    if (payload.ok) {
      setActiveDesignId(payload.data.id);
      setSaveStatus(`Saved ${new Date().toLocaleTimeString()}`);
      return payload.data.id;
    }

    setSaveStatus(payload.error?.message ?? "Save failed");
    return activeDesignId;
  }

  async function runPreflightCheck() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const objects = mapCanvasObjectsToPreflight({
      objects: canvas.getObjects(),
      template,
      canvas,
    });

    const response = await fetch("/api/preflight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug: template.productSlug,
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
    const proofDesignId = activeDesignId ?? (await saveDesign()) ?? designId;
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    setPreviewUrl(dataUrl);
    setProofStatus("Exporting proof...");
    const response = await fetch("/api/proofs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        designId: proofDesignId,
        productName: template.name,
        widthIn: template.widthIn,
        heightIn: template.heightIn,
        warnings: preflight?.warnings.map((warning) => warning.message) ?? [],
      }),
    });
    const payload = await response.json();

    if (payload.ok) {
      const printResponse = await fetch("/api/print-files", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ designId: proofDesignId }),
      });
      const printPayload = await printResponse.json();

      if (printPayload.ok) {
        setProofStatus(
          `Proof and 4over print file ready (${payload.data.pdfBytes} PDF bytes, ${printPayload.data.byteLength} TIFF bytes)`,
        );
        return;
      }

      setProofStatus(
        `Proof ready, but print file generation needs attention: ${printPayload.error?.message ?? "Unknown error"}`,
      );
    } else {
      setProofStatus(payload.error?.message ?? "Proof export failed");
    }
  }

  async function getQuote() {
    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug: template.productSlug,
        quantity,
        options: { finish, turnaround },
        destinationPostalCode: "85001",
      }),
    });
    const payload = await response.json();
    if (payload.ok) setQuote(payload.data);
  }

  async function addToCart() {
    const cartDesignId = activeDesignId ?? (await saveDesign());
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug: template.productSlug,
        designId: cartDesignId,
        quantity: quote?.quantity ?? quantity,
        options: { finish, turnaround },
      }),
    });
    if (response.ok) {
      setCartStatus("Added to cart");
      await getQuote();
    } else {
      setCartStatus("Cart update failed");
    }
  }

  async function generatePromo() {
    const promoDesignId = activeDesignId ?? (await saveDesign()) ?? designId;
    const response = await fetch("/api/hyperframes/render", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        designId: promoDesignId,
        format: "tiktok-9x16",
        productName: template.name,
        handle: activeKit.handle,
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

  function toggleChannel(channelId: string) {
    setSelectedChannels((current) =>
      current.includes(channelId)
        ? current.filter((item) => item !== channelId)
        : [...current, channelId],
    );
  }

  function toggleVariant(variantId: string) {
    setReviewedVariants((current) =>
      current.includes(variantId)
        ? current.filter((item) => item !== variantId)
        : [...current, variantId],
    );
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-[1520px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_50px_rgba(6,19,26,0.06)]">
          <div>
            <div className="mb-3 inline-flex size-11 items-center justify-center rounded-lg bg-[#06131a] text-white shadow-[0_14px_36px_rgba(6,19,26,0.18)]">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-black tracking-[0]">Creator Studio</h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {template.name} · {template.widthIn} x {template.heightIn} in ·{" "}
              {template.dpi} DPI
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-black">
            <StatusPill tone="neutral">{saveStatus}</StatusPill>
            <StatusPill
              tone={
                readiness.status === "ready"
                  ? "good"
                  : readiness.status === "review"
                    ? "warn"
                    : "danger"
              }
            >
              {readiness.progressPercent}% launch ready
            </StatusPill>
          </div>
        </header>

        <Surface className="mb-5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-52 flex-1">
              <label className="text-xs font-black uppercase text-slate-500">
                Drop name
              </label>
              <input
                value={dropName}
                onChange={(event) => {
                  setDropName(event.target.value);
                  markDirty();
                }}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-base font-black outline-none transition focus:border-[#00a9b7]"
              />
            </div>
            <div className="min-w-40">
              <label className="text-xs font-black uppercase text-slate-500">
                Launch
              </label>
              <input
                type="date"
                value={launchDate}
                onChange={(event) => setLaunchDate(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-[#00a9b7]"
              />
            </div>
            <div className="grid min-w-56 flex-1 grid-cols-3 gap-2 text-center">
              <MetricTile
                label="Views"
                value={`${sampleDropMetrics.productViews}`}
              />
              <MetricTile
                label="Orders"
                value={`${sampleDropMetrics.orders}`}
              />
              <MetricTile
                label="Profit"
                value={formatMoney(
                  sampleDropMetrics.revenueCents - sampleDropMetrics.spendCents,
                )}
              />
            </div>
          </div>
        </Surface>

        <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <aside className="space-y-4">
            <UploadDropzone
              onUpload={(asset) => void addUploadedImage(asset)}
            />
            <BrandKitPanel
              activeKitId={activeKitId}
              kits={studioBrandKits}
              onApplyKit={applyBrandKit}
              onColor={setBackground}
              onSelectKit={setActiveKitId}
            />
            <LayerPanel
              layers={layers}
              selectedLayer={selectedLayer}
              onSelectLayer={selectLayer}
            />
            <Surface className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
                  <ClipboardCheck className="size-4" aria-hidden="true" />
                </span>
                Readiness
              </h2>
              <AnimatedProgress
                value={readiness.progressPercent}
                className="mt-3"
              />
              <div className="mt-3 space-y-2">
                {readiness.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-slate-100 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black">{item.label}</span>
                      <span
                        className={`size-2 rounded-full ${
                          item.status === "complete"
                            ? "bg-emerald-500"
                            : item.status === "warning"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </aside>

          <Surface className="min-w-0 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "design", label: "Design", icon: Grid2X2 },
                  { id: "mockups", label: "Mockups", icon: Sparkles },
                  { id: "calendar", label: "Calendar", icon: CalendarDays },
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                ].map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() =>
                        setActiveStudioView(
                          view.id as
                            | "design"
                            | "mockups"
                            | "calendar"
                            | "analytics",
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-black transition ${
                        activeStudioView === view.id
                          ? "bg-[#06131a] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-[#00a9b7] hover:bg-[#ecfeff]"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {view.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <TextTool onAddText={addText} />
                <QrCodeTool onAddQr={addQr} />
                <button
                  type="button"
                  onClick={() => void saveDesign()}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black transition hover:border-[#00a9b7] hover:bg-[#ecfeff]"
                >
                  <Save className="size-4" aria-hidden="true" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => void exportProof()}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black transition hover:border-[#00a9b7] hover:bg-[#ecfeff]"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Proof
                </button>
              </div>
            </div>

            <div className={activeStudioView === "design" ? "block" : "hidden"}>
              <div className="overflow-auto rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_25%,#eef7fb_25%,#eef7fb_50%,#f8fafc_50%,#f8fafc_75%,#eef7fb_75%,#eef7fb_100%)] bg-[length:28px_28px] p-4 shadow-inner">
                <canvas
                  ref={canvasElementRef}
                  className="mx-auto rounded-md shadow-[0_18px_50px_rgba(6,19,26,0.12)]"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <BleedSafeZoneOverlay />
                {quote ? (
                  <StatusPill tone="accent">
                    Mock quote: {formatMoney(quote.totalCents)}
                  </StatusPill>
                ) : null}
              </div>
            </div>

            {activeStudioView === "mockups" ? (
              <div className="grid gap-4 md:grid-cols-3">
                {studioPlacementVariants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3 shadow-sm"
                  >
                    <div
                      className={`grid aspect-[4/3] place-items-center rounded-md border border-slate-200 ${
                        index === 1 ? "bg-[#101820]" : "bg-white"
                      }`}
                    >
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt={`${variant.name} mockup`}
                          className="max-h-[82%] max-w-[82%] object-contain"
                        />
                      ) : (
                        <span
                          className={`text-xs font-black ${
                            index === 1 ? "text-white" : "text-slate-500"
                          }`}
                        >
                          {template.name}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-black">{variant.name}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {variant.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {activeStudioView === "calendar" ? (
              <div className="space-y-3">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-md border border-slate-200 bg-white/80 px-4 py-3 shadow-sm sm:grid-cols-[120px_1fr_120px]"
                  >
                    <span className="text-sm font-black">{item.date}</span>
                    <span>
                      <span className="block text-sm font-black">
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.channel}
                      </span>
                    </span>
                    <span className="text-xs font-black uppercase text-[#007f88]">
                      {item.status}
                    </span>
                  </div>
                ))}
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none transition focus:border-[#00a9b7]"
                />
              </div>
            ) : null}

            {activeStudioView === "analytics" ? (
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  <MetricTile
                    label="Impressions"
                    value={`${sampleDropMetrics.impressions}`}
                  />
                  <MetricTile
                    label="Product views"
                    value={`${sampleDropMetrics.productViews}`}
                  />
                  <MetricTile
                    label="Add to cart"
                    value={`${sampleDropMetrics.addToCarts}`}
                  />
                  <MetricTile
                    label="Orders"
                    value={`${sampleDropMetrics.orders}`}
                  />
                </div>
                <div className="space-y-3">
                  {sampleDropMetrics.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="rounded-md border border-slate-200 bg-white/80 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-black">
                          {variant.name}
                        </span>
                        <span className="text-xs font-black uppercase text-[#007f88]">
                          {variant.status}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
                        <span>{variant.views} views</span>
                        <span>
                          {(variant.addToCartRate * 100).toFixed(1)}% cart
                        </span>
                        <span>
                          {(variant.conversionRate * 100).toFixed(1)}% orders
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Surface>

          <aside className="space-y-4">
            <AIAssistantPanel
              designId={activeDesignId ?? designId}
              layers={layers}
              productSlug={template.productSlug}
              templateId={template.id}
              onApplyActions={applyAssistantActions}
            />
            <PreflightPanel result={preflight} />
            <Surface className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                </span>
                Variant review
              </h2>
              <div className="mt-3 space-y-2">
                {studioPlacementVariants.map((variant) => (
                  <label
                    key={variant.id}
                    className="flex items-start gap-3 rounded-md border border-slate-100 px-3 py-2 transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={reviewedVariants.includes(variant.id)}
                      onChange={() => toggleVariant(variant.id)}
                      className="mt-1 size-4 accent-[#00a9b7]"
                    />
                    <span>
                      <span className="block text-xs font-black">
                        {variant.name}
                      </span>
                      <span className="text-xs leading-5 text-slate-500">
                        {variant.detail}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </Surface>
            <Surface className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
                  <Megaphone className="size-4" aria-hidden="true" />
                </span>
                Launch channels
              </h2>
              <div className="mt-3 grid gap-2">
                {creatorChannels.map((channel) => (
                  <label
                    key={channel.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-3 py-2 text-sm font-bold transition hover:bg-slate-50"
                  >
                    {channel.name}
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                      className="size-4 accent-[#00a9b7]"
                    />
                  </label>
                ))}
              </div>
            </Surface>
            <ProofPreview previewUrl={previewUrl} />
            {proofStatus ? (
              <p className="rounded-md border border-cyan-100 bg-[#ecfeff] px-3 py-2 text-xs font-semibold text-[#007f88]">
                {proofStatus}
              </p>
            ) : null}
            <QuoteSummary quote={quote} />
            <Surface className="p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-black">
                <span className="grid size-8 place-items-center rounded-md bg-[#ecfeff] text-[#007f88]">
                  <PackageCheck className="size-4" aria-hidden="true" />
                </span>
                Production tools
              </h2>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <label className="text-xs font-black uppercase text-slate-500">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Math.max(1, Number(event.target.value)))
                    }
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-[#00a9b7]"
                  />
                </label>
                <label className="text-xs font-black uppercase text-slate-500">
                  Finish
                  <select
                    value={finish}
                    onChange={(event) => setFinish(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-[#00a9b7]"
                  >
                    <option value="matte">Matte</option>
                    <option value="gloss">Gloss</option>
                    <option value="uncoated">Uncoated</option>
                  </select>
                </label>
                <label className="text-xs font-black uppercase text-slate-500">
                  Turnaround
                  <select
                    value={turnaround}
                    onChange={(event) => setTurnaround(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-[#00a9b7]"
                  >
                    <option value="standard">Standard</option>
                    <option value="rush">Rush</option>
                  </select>
                </label>
              </div>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => void runPreflightCheck()}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06131a] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#007f88]"
                >
                  <FileCheck2 className="size-4" aria-hidden="true" />
                  Run preflight
                </button>
                <button
                  type="button"
                  onClick={() => void getQuote()}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d5ff5f] px-4 py-3 text-sm font-black text-[#06131a] shadow-sm transition hover:bg-[#c7f34f]"
                >
                  Generate quote
                </button>
                <button
                  type="button"
                  onClick={() => void addToCart()}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black transition hover:border-[#00a9b7] hover:bg-[#ecfeff]"
                >
                  <ShoppingCart className="size-4" aria-hidden="true" />
                  Add to cart
                </button>
                <button
                  type="button"
                  onClick={() => void generatePromo()}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black transition hover:border-[#00a9b7] hover:bg-[#ecfeff]"
                >
                  <Video className="size-4" aria-hidden="true" />
                  Generate promo video
                </button>
              </div>
              {cartStatus ? (
                <p className="mt-3 text-xs font-semibold text-[#007f88]">
                  {cartStatus}
                </p>
              ) : null}
              {promoStatus ? (
                <p className="mt-3 text-xs font-semibold text-[#007f88]">
                  {promoStatus}
                </p>
              ) : null}
              {promoPreviewUrl ? (
                <div className="relative mt-3 aspect-[9/16] overflow-hidden rounded-md border border-slate-200 bg-[#06131a]">
                  <Image
                    src={promoPreviewUrl}
                    alt={promoVideoPosterImage.alt}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </Surface>
          </aside>
        </div>
      </div>
    </main>
  );
}

function formatReadableDate(value: string) {
  const [year = "2026", month = "01", day = "01"] = value.split("-");
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getPrintSnapshotMultiplier(canvas: FabricCanvas, template: PrintTemplate) {
  const canvasWidth = canvas.getWidth?.() ?? canvas.width ?? template.widthIn * 100;
  const canvasHeight = canvas.getHeight?.() ?? canvas.height ?? template.heightIn * 100;
  const targetWidthPx = template.widthIn * template.dpi;
  const targetHeightPx = template.heightIn * template.dpi;

  return Math.max(targetWidthPx / canvasWidth, targetHeightPx / canvasHeight, 1);
}

function addQrShape(
  canvas: FabricCanvas,
  fabric: FabricModule,
  url: string,
  left: number,
  top: number,
  name = `QR ${url}`,
) {
  const rect = new fabric.Rect({
    width: 116,
    height: 116,
    left: 0,
    top: 0,
    originX: "left",
    originY: "top",
    fill: "#ffffff",
    stroke: "#06131a",
    strokeWidth: 3,
  });
  const finderA = new fabric.Rect({
    width: 24,
    height: 24,
    left: 14,
    top: 14,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  const finderB = new fabric.Rect({
    width: 24,
    height: 24,
    left: 78,
    top: 14,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  const finderC = new fabric.Rect({
    width: 24,
    height: 24,
    left: 14,
    top: 78,
    originX: "left",
    originY: "top",
    fill: "#06131a",
    name: "qr-block",
  });
  const qrGroup = new fabric.Group([rect, finderA, finderB, finderC], {
    left,
    top,
    originX: "left",
    originY: "top",
    name,
    studioType: "qr",
  });
  canvas.add(qrGroup);
  return qrGroup;
}
