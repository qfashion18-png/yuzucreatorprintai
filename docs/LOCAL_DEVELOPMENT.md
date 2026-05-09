# Local Development

```bash
pnpm install
pnpm seed
pnpm dev
```

The app runs in mock mode without 4over or Bedrock credentials. Use `/studio/new` to open the editor, add text/QR/artwork, run preflight, export a proof, generate a quote, add to cart, and place a mock order.

Optional smoke test after the dev server is running:

```bash
pnpm tsx scripts/playwright-smoke.ts
```
