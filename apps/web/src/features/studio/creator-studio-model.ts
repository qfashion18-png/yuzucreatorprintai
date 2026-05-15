import type { PreflightResult } from "@creator-print-ai/core";

export type CreatorChannel = {
  id: "tiktok" | "instagram" | "youtube" | "email" | "storefront";
  name: string;
  defaultSelected: boolean;
  taskOffsetDays: number;
  taskLabel: string;
};

export type ReadinessItem = {
  id: "assets" | "preflight" | "proof" | "quote" | "variants" | "schedule";
  label: string;
  detail: string;
  status: "complete" | "warning" | "blocked";
};

export type CreatorReadiness = {
  status: "ready" | "review" | "blocked";
  progressPercent: number;
  blockingCount: number;
  warningCount: number;
  items: ReadinessItem[];
};

export type LaunchTimelineItem = {
  id: string;
  label: string;
  channel: string;
  date: string;
  status: "done" | "due" | "scheduled";
};

export type DropMetricVariant = {
  id: string;
  name: string;
  views: number;
  addToCartRate: number;
  conversionRate: number;
  status: "testing" | "winner" | "needs-copy";
};

export const creatorChannels: CreatorChannel[] = [
  {
    id: "tiktok",
    name: "TikTok",
    defaultSelected: true,
    taskOffsetDays: -7,
    taskLabel: "Schedule short-form reveal",
  },
  {
    id: "instagram",
    name: "Instagram",
    defaultSelected: true,
    taskOffsetDays: -7,
    taskLabel: "Schedule short-form reveal",
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    defaultSelected: false,
    taskOffsetDays: -5,
    taskLabel: "Queue Shorts teaser",
  },
  {
    id: "email",
    name: "Email list",
    defaultSelected: true,
    taskOffsetDays: -3,
    taskLabel: "Draft email drop",
  },
  {
    id: "storefront",
    name: "Storefront",
    defaultSelected: true,
    taskOffsetDays: -1,
    taskLabel: "Publish product page",
  },
];

export const studioBrandKits = [
  {
    id: "creator-pop",
    name: "Creator Pop",
    colors: ["#06131a", "#00a9b7", "#ff6f61", "#d5ff5f", "#ffffff"],
    headline: "DROP DAY",
    handle: "@yourhandle",
    url: "https://creatorprint.ai/drop",
  },
  {
    id: "soft-shop",
    name: "Soft Shop",
    colors: ["#14213d", "#fca311", "#e5e5e5", "#ffffff", "#0f172a"],
    headline: "New release",
    handle: "@studio",
    url: "https://creatorprint.ai/shop",
  },
  {
    id: "night-market",
    name: "Night Market",
    colors: ["#101820", "#f2aa4c", "#f7fff7", "#2ec4b6", "#ff3366"],
    headline: "Limited run",
    handle: "@dropclub",
    url: "https://creatorprint.ai/limited",
  },
];

export const studioPlacementVariants = [
  {
    id: "standard",
    name: "Standard print",
    detail: "Base trim, bleed, and safe-zone review",
  },
  {
    id: "dark-surface",
    name: "Dark surface",
    detail: "Contrast and white-space review",
  },
  {
    id: "small-format",
    name: "Small format",
    detail: "Text legibility and QR scan review",
  },
];

export const sampleDropMetrics = {
  spendCents: 12200,
  revenueCents: 28400,
  impressions: 18400,
  productViews: 2860,
  addToCarts: 312,
  orders: 74,
  variants: [
    {
      id: "mockup-a",
      name: "Clean product mockup",
      views: 1040,
      addToCartRate: 0.12,
      conversionRate: 0.037,
      status: "winner",
    },
    {
      id: "mockup-b",
      name: "Lifestyle crop",
      views: 920,
      addToCartRate: 0.09,
      conversionRate: 0.028,
      status: "testing",
    },
    {
      id: "title-c",
      name: "Urgency title",
      views: 900,
      addToCartRate: 0.07,
      conversionRate: 0.021,
      status: "needs-copy",
    },
  ] satisfies DropMetricVariant[],
};

export function buildCreatorReadiness({
  assetCount,
  preflight,
  hasProof,
  hasQuote,
  selectedVariantCount,
  requiredVariantCount,
  scheduledPostCount,
}: {
  assetCount: number;
  preflight?: PreflightResult;
  hasProof: boolean;
  hasQuote: boolean;
  selectedVariantCount: number;
  requiredVariantCount: number;
  scheduledPostCount: number;
}): CreatorReadiness {
  const preflightStatus = getPreflightStatus(preflight);
  const items: ReadinessItem[] = [
    {
      id: "assets",
      label: "Artwork added",
      detail:
        assetCount > 0
          ? `${assetCount} uploaded or generated asset${assetCount === 1 ? "" : "s"}`
          : "Upload or generate at least one artwork asset.",
      status: assetCount > 0 ? "complete" : "blocked",
    },
    {
      id: "preflight",
      label: "Print checks",
      detail: preflightStatus.detail,
      status: preflightStatus.status,
    },
    {
      id: "proof",
      label: "Proof exported",
      detail: hasProof
        ? "Proof preview is ready for review."
        : "Export a proof before launch approval.",
      status: hasProof ? "complete" : "blocked",
    },
    {
      id: "quote",
      label: "Quote generated",
      detail: hasQuote
        ? "Mock production price is available."
        : "Generate a quote for margin review.",
      status: hasQuote ? "complete" : "blocked",
    },
    {
      id: "variants",
      label: "Variant placement",
      detail: `${selectedVariantCount}/${requiredVariantCount} required placement views reviewed.`,
      status:
        selectedVariantCount >= requiredVariantCount ? "complete" : "blocked",
    },
    {
      id: "schedule",
      label: "Launch schedule",
      detail:
        scheduledPostCount > 0
          ? `${scheduledPostCount} launch channel${scheduledPostCount === 1 ? "" : "s"} planned.`
          : "Choose at least one launch channel.",
      status: scheduledPostCount > 0 ? "complete" : "blocked",
    },
  ];

  const completeCount = items.filter(
    (item) => item.status !== "blocked",
  ).length;
  const blockingCount = items.filter(
    (item) => item.status === "blocked",
  ).length;
  const warningCount = items.filter((item) => item.status === "warning").length;

  return {
    status:
      blockingCount > 0 ? "blocked" : warningCount > 0 ? "review" : "ready",
    progressPercent: Math.round((completeCount / items.length) * 100),
    blockingCount,
    warningCount,
    items,
  };
}

export function buildLaunchTimeline({
  launchDate,
  selectedChannelIds,
  productName,
}: {
  launchDate: string;
  selectedChannelIds: string[];
  productName: string;
}): LaunchTimelineItem[] {
  const channels = creatorChannels.filter((channel) =>
    selectedChannelIds.includes(channel.id),
  );
  const launch = parseDate(launchDate);
  const items: LaunchTimelineItem[] = [
    {
      id: "proof-approval",
      label: "Approve print proof",
      channel: "Studio",
      date: formatDate(addDays(launch, -10)),
      status: "due",
    },
    ...channels.map((channel) => ({
      id:
        channel.id === "tiktok" || channel.id === "instagram"
          ? "short-video"
          : channel.id === "storefront"
            ? "storefront"
            : `${channel.id}-drop`,
      label: channel.taskLabel,
      channel: channel.name,
      date: formatDate(addDays(launch, channel.taskOffsetDays)),
      status: "scheduled" as const,
    })),
    {
      id: "launch-day",
      label: `Launch ${productName}`,
      channel: "Storefront",
      date: formatDate(launch),
      status: "scheduled",
    },
  ];

  return dedupeTimeline(items).sort((a, b) => a.date.localeCompare(b.date));
}

export function createUniqueLayerName(
  baseName: string,
  existingNames: string[],
) {
  if (!existingNames.includes(baseName)) return baseName;

  let suffix = 2;
  while (existingNames.includes(`${baseName} ${suffix}`)) {
    suffix += 1;
  }

  return `${baseName} ${suffix}`;
}

function getPreflightStatus(
  preflight?: PreflightResult,
): Pick<ReadinessItem, "detail" | "status"> {
  if (!preflight) {
    return {
      detail: "Run preflight to check DPI, file type, and safe-zone issues.",
      status: "blocked",
    };
  }

  if (preflight.status === "fail") {
    return {
      detail: "Preflight has blocking print issues.",
      status: "blocked",
    };
  }

  if (preflight.status === "warning") {
    return {
      detail: `${preflight.warnings.length} print warning${preflight.warnings.length === 1 ? "" : "s"} need review.`,
      status: "warning",
    };
  }

  return {
    detail: "Preflight passed with no blocking issues.",
    status: "complete",
  };
}

function dedupeTimeline(items: LaunchTimelineItem[]): LaunchTimelineItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function parseDate(value: string): Date {
  const [year = "2026", month = "01", day = "01"] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
