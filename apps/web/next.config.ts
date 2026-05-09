import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
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
