# 4over Integration

4over endpoints are not guessed.

Mock provider is default. `FourOverPrintProvider` is ready for real endpoint mapping once official 4over API documentation and credentials are supplied. Credentials must be stored in AWS Secrets Manager for deployed environments and never committed.

Product/provider mapping lives in the admin product view and seeded product metadata. Orders should pass preflight and proof approval before live provider submission.

Required from the account owner:

- 4over API credentials.
- Official 4over endpoint documentation.
- Account ID and sandbox/live mode rules.
- Product code and option mapping for each MVP product.
