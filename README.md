# CreatorPrint AI

CreatorPrint AI is a Next.js MVP for creator-first print drops. It lets creators browse popular print products, pick templates, upload artwork, edit designs in a browser studio, run basic print readiness checks, generate proofs, quote/checkout in mock mode, submit mock orders, and prepare for 4over fulfillment behind a provider adapter.

## Run Locally

```bash
pnpm install
pnpm seed
pnpm dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm cdk:synth
```

## Mock And Live Modes

Copy `.env.example` to `.env.local` for local development. Mock mode is default:

```bash
PRINT_PROVIDER=mock
AI_PROVIDER=mock
MOCK_CHECKOUT=true
```

To prepare live 4over mode, set `PRINT_PROVIDER=4over` and store credentials in AWS Secrets Manager with `SECRETS_MANAGER_4OVER_SECRET_ID`. The live adapter intentionally does not call any 4over endpoint until official endpoint documentation is supplied and mapped.

To prepare live Bedrock mode, set `AI_PROVIDER=bedrock` plus `BEDROCK_TEXT_MODEL_ID`, `BEDROCK_IMAGE_MODEL_ID`, and optional Guardrail IDs.

## AWS CDK

The CDK app is in `infra/cdk` and creates private S3 buckets, DynamoDB tables, Cognito, Secrets Manager, EventBridge, SQS queues, a Step Functions skeleton, AI permissions, and an Amplify hosting placeholder.

```bash
pnpm cdk:synth
pnpm cdk:diff
pnpm cdk:deploy
```

Do not deploy until AWS account, region, permissions, and environment names are confirmed.

To connect Amplify to GitHub for a Next.js SSR build, create/push the repo, store a GitHub token in Secrets Manager, then run:

```powershell
pnpm amplify:connect -- -RepositoryUrl "https://github.com/qfashion18-png/yuzucreatorprintai.git" -GitHubTokenSecretId "creatorprint/amplify/github"
```

## Known Limitations

4over endpoints are not guessed. Payments are mock-only. PDF output is a placeholder proof renderer. Bedrock image generation and Rekognition moderation are adapter-ready but require AWS access/model configuration. HyperFrames returns a renderable HTML composition stub unless the external render pipeline is wired.
