# Codex Implementation Log

## Built

- Bootstrapped a pnpm monorepo under `creator-print-ai`.
- Created the Next.js TypeScript app with Tailwind, route handlers, and reusable creator-print components.
- Added product catalog, seeded templates, Creator Drop Kit, markup rules, and preflight logic.
- Implemented Fabric.js studio MVP with upload, text, QR, brand colors, bleed/safe-zone guides, save, proof export, preflight, quote, cart, and promo-video actions.
- Added mock AI, Bedrock adapter scaffold, mock print provider, and 4over adapter placeholders.
- Added proof rendering placeholder and HyperFrames HTML composition stub.
- Added CDK stacks for AWS-native services and Amplify hosting placeholder.
- Added tests, docs, `.env.example`, `.gitignore`, and Amplify build spec.

## Tooling Notes

- `corepack enable` failed on Windows due permission to write under `C:\Program Files\nodejs`, but `corepack prepare pnpm@latest --activate` succeeded and pnpm is usable.
- Installed `aws-cdk` and `hyperframes` globally.
- `codex plugin marketplace add` failed because `codex.exe` is blocked by Windows access permissions.
- HyperFrames skills installed successfully through `npx skills add heygen-com/hyperframes`.

## AWS Notes

- AWS MCP `sts:GetCallerIdentity` succeeded for the MCP role.
- Local AWS CLI had TLS/certificate validation issues in this environment, so deployment used AWS Tools for PowerShell with credentials loaded ephemerally from the provided CSV.
- Deployed `CreatorPrintCore-dev`, `CreatorPrintAi-dev`, and `CreatorPrintWeb-dev` to AWS account `374587466106` in `us-east-1`.
- Created Amplify app `dfasxx3um10jb` with branch `main`; the branch URL responds at `https://main.dfasxx3um10jb.amplifyapp.com`.
- Added CDK context and `scripts/connect-amplify-git.ps1` support for a Git-connected Amplify release job using `https://github.com/qfashion18-png/yuzucreatorprintai.git`.
- Amplify requires a valid GitHub/OAuth token before it will connect a repository and start a Git-backed SSR build.
- The Next.js SSR runtime source still needs a GitHub repo connection; Amplify manual deployments are not appropriate for SSR route-handler apps.
