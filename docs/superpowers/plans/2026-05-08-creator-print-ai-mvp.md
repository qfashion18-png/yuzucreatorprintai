# CreatorPrint AI MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working AWS-first Next.js MVP for AI-assisted creator printing with mock 4over fulfillment and future-ready live adapters.

**Architecture:** Use a pnpm monorepo with a Next.js web app and domain packages for shared models, print providers, AI orchestration, rendering, templates, config, and HyperFrames composition stubs. Keep 4over behind a provider adapter, default to mock mode, and keep AWS infrastructure in CDK TypeScript.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Fabric.js, Zod, Vitest, AWS SDK v3, AWS CDK, DynamoDB/S3/Cognito/Step Functions/SQS/Bedrock/Rekognition/Secrets Manager.

---

### Task 1: Workspace And Tests

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.env.example`, `.gitignore`
- Create: package `package.json` and `tsconfig.json` files
- Test: `packages/*/test/*.test.ts`

- [x] **Step 1: Create workspace config and failing package behavior tests**
- [ ] **Step 2: Run `pnpm install` and `pnpm test` to verify missing implementation failures**
- [ ] **Step 3: Add domain implementations until package tests pass**

### Task 2: Product Catalog And Studio UI

**Files:**
- Create/modify: `packages/core/src/*`
- Modify: `apps/web/src/app/**/*`
- Create: `apps/web/src/components/**/*`

- [ ] **Step 1: Seed catalog/templates and expose product/template APIs**
- [ ] **Step 2: Build creator-friendly pages for `/`, `/products`, `/products/[slug]`, `/templates`**
- [ ] **Step 3: Build the Fabric.js studio at `/studio/[designId]` with upload, text, QR, bleed/safe-zone, save, and proof preview**

### Task 3: Mock Quote, Order, AI, HyperFrames

**Files:**
- Create/modify: `packages/print-provider/src/*`, `packages/ai/src/*`, `packages/render/src/*`, `packages/hyperframes/src/*`
- Create/modify: `apps/web/src/app/api/**/*`, `apps/web/src/app/cart`, `checkout`, `orders`, `admin`

- [ ] **Step 1: Implement mock provider, 4over placeholder adapter, and quote/order routes**
- [ ] **Step 2: Implement mock AI and Bedrock adapter placeholders**
- [ ] **Step 3: Implement proof rendering placeholder and HyperFrames composition stub**

### Task 4: AWS CDK And Documentation

**Files:**
- Create: `infra/cdk/**/*`
- Create: `docs/*.md`, `README.md`, `CODEX_IMPLEMENTATION_LOG.md`

- [ ] **Step 1: Add CDK stacks for private S3 buckets, DynamoDB, Cognito, queues, Step Functions, EventBridge, Secrets Manager, and AI permissions**
- [ ] **Step 2: Document local setup, AWS deployment, 4over integration, AI design, print rendering, HyperFrames, and security**
- [ ] **Step 3: Run lint, typecheck, tests, build, and CDK synth**
