export const heroImage = {
  src: "/assets/hero/creatorprint-hero.webp",
  alt: "CreatorPrint AI proof preview with sticker artwork and print readiness controls",
};

export const creatorDropKitImage = {
  src: "/assets/bundles/creator-drop-kit.webp",
  alt: "Creator Drop Kit mockup with stickers, QR cards, inserts, labels, poster, banner, and promo video",
};

export const promoVideoPosterImage = {
  src: "/assets/social/promo-video-tiktok.webp",
  alt: "Vertical social promo video poster for a creator merch drop",
};

export function productImage(slug: string, name: string) {
  return {
    src: `/assets/products/${slug}.webp`,
    alt: `${name} high-resolution print product mockup`,
  };
}

export function templateImage(id: string, name: string) {
  return {
    src: `/assets/templates/${id}.webp`,
    alt: `${name} print template preview`,
  };
}
