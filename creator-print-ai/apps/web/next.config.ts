import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@creator-print-ai/core",
    "@creator-print-ai/print-provider",
    "@creator-print-ai/ai",
    "@creator-print-ai/render",
    "@creator-print-ai/config",
    "@creator-print-ai/hyperframes",
  ],
};

export default nextConfig;
