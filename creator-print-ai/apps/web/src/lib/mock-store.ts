import type { Cart, Design, Order, Quote } from "@creator-print-ai/core";

export type CreatorPrintStore = {
  designs: Map<string, Design>;
  cart: Cart;
  orders: Map<string, Order>;
  quotes: Map<string, Quote>;
};

declare global {
  var __creatorPrintStore: CreatorPrintStore | undefined;
}

const now = new Date().toISOString();

export function getStore(): CreatorPrintStore {
  if (!globalThis.__creatorPrintStore) {
    globalThis.__creatorPrintStore = {
      designs: new Map(),
      cart: {
        id: "cart_mock",
        userId: "local-user",
        items: [],
        updatedAt: now,
      },
      orders: new Map(),
      quotes: new Map(),
    };
  }

  return globalThis.__creatorPrintStore;
}

export function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
