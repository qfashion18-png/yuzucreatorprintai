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

export type VisualTheme = {
  id: "music-artist" | "chef" | "event-promoter";
  label: string;
  description: string;
};

export type ThemedImage = {
  src: string;
  alt: string;
  theme: VisualTheme;
};

export const visualThemes: VisualTheme[] = [
  {
    id: "music-artist",
    label: "Music artist",
    description: "Merch drops, album launches, posters, and QR fan cards",
  },
  {
    id: "chef",
    label: "Chef",
    description: "Menus, labels, packaging, recipe cards, and pop-up promos",
  },
  {
    id: "event-promoter",
    label: "Event promoter",
    description: "Flyers, tickets, wristbands, posters, and venue signage",
  },
];

export function productImage(slug: string, name: string) {
  return {
    src: `/assets/products/${slug}.webp`,
    alt: `${name} high-resolution print product mockup`,
  };
}

export function productThemeImages(slug: string, name: string): ThemedImage[] {
  return visualThemes.map((theme) => ({
    src: `/assets/product-themes/${slug}-${theme.id}.webp`,
    alt: `${name} idea mockup for a ${theme.label.toLowerCase()} launch`,
    theme,
  }));
}

export function templateThemeImages(
  productSlug: string,
  name: string,
): ThemedImage[] {
  return visualThemes.map((theme) => ({
    src: `/assets/product-themes/${productSlug}-${theme.id}.webp`,
    alt: `${name} template idea for a ${theme.label.toLowerCase()} launch`,
    theme,
  }));
}

export function templateImage(id: string, name: string) {
  return {
    src: `/assets/templates/${id}.webp`,
    alt: `${name} print template preview`,
  };
}
