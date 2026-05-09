# Architecture

CreatorPrint AI is a pnpm monorepo with a Next.js app and domain packages:

- `apps/web`: App Router UI, route handlers, local mock storage, studio editor.
- `packages/core`: shared models, Zod schemas, catalog, templates, preflight.
- `packages/print-provider`: provider interface, mock adapter, 4over placeholder adapter.
- `packages/ai`: mock assistant and Bedrock adapter.
- `packages/render`: proof PDF/image placeholder rendering.
- `packages/hyperframes`: social promo composition stubs.
- `infra/cdk`: AWS infrastructure.

The provider boundary keeps 4over out of UI/business logic. The local MVP uses route handlers and in-memory mock storage; package logic can move behind Lambda/API Gateway later.
