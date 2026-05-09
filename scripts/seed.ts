import { creatorDropKit, productCatalog, templates } from "@creator-print-ai/core";

console.log("CreatorPrint AI seed data");
console.log(`Products: ${productCatalog.length}`);
console.log(`Templates: ${templates.length}`);
console.log(`Bundle: ${creatorDropKit.name}`);
console.log("Mock pricing is loaded from packages/core/src/catalog.ts and used by MockPrintProvider.");
