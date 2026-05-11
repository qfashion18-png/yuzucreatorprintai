import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const sharp = require("sharp");

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const publicDir = path.join(rootDir, "apps", "web", "public");
const sourceDir = path.join(publicDir, "assets", "sources");

const sources = {
  stickers: "stickers.png",
  labels: "labels.png",
  cards: "cards.png",
  inserts: "inserts.png",
  flyersPosters: "flyersPosters.png",
  banner: "banner.png",
  kit: "kit.png",
  promo: "promo.png",
  contactSheet: "contactSheet.png",
};

const productSources = {
  "die-cut-stickers": sources.stickers,
  "roll-labels": sources.labels,
  "business-creator-cards": sources.cards,
  postcards: sources.inserts,
  flyers: sources.flyersPosters,
  posters: sources.flyersPosters,
  banners: sources.banner,
  "thank-you-insert-cards": sources.inserts,
  "qr-creator-cards": sources.cards,
  "packaging-labels": sources.labels,
};

const templateSources = {
  "tpl-sticker-bold-face": sources.stickers,
  "tpl-label-beauty-drop": sources.labels,
  "tpl-card-link-in-bio": sources.cards,
  "tpl-postcard-launch-note": sources.inserts,
  "tpl-flyer-pop-up": sources.flyersPosters,
  "tpl-poster-music-night": sources.flyersPosters,
  "tpl-banner-drop-zone": sources.banner,
  "tpl-insert-unboxing": sources.inserts,
  "tpl-qr-podcast-card": sources.cards,
  "tpl-packaging-clean-seal": sources.labels,
};

async function main() {
  await Promise.all(
    [
      "assets/products",
      "assets/templates",
      "assets/hero",
      "assets/bundles",
      "assets/social",
      "mock",
    ].map((directory) =>
      mkdir(path.join(publicDir, directory), { recursive: true }),
    ),
  );

  for (const [slug, source] of Object.entries(productSources)) {
    await writePhotoWebp(source, `assets/products/${slug}.webp`, 1800, 1350);
  }

  for (const [id, source] of Object.entries(templateSources)) {
    await writePhotoWebp(source, `assets/templates/${id}.webp`, 1800, 1350);
  }

  await writePhotoWebp(
    sources.kit,
    "assets/hero/creatorprint-hero.webp",
    2400,
    1800,
  );
  await writePhotoWebp(
    sources.kit,
    "assets/bundles/creator-drop-kit.webp",
    2400,
    1400,
  );
  await writePhotoWebp(
    sources.promo,
    "assets/social/promo-video-tiktok.webp",
    1080,
    1920,
  );
  await writePng(sources.stickers, "mock/generated-sticker.png", 1600, 1600);

  console.log(
    "Generated high-end CreatorPrint AI photo assets from curated sources.",
  );
}

async function writePhotoWebp(sourceFile, outputRel, width, height) {
  await sharp(path.join(sourceDir, sourceFile))
    .resize(width, height, { fit: "cover", position: "attention" })
    .modulate({ saturation: 1.04, brightness: 1.01 })
    .sharpen({ sigma: 0.45, m1: 0.8, m2: 1.1 })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(publicDir, outputRel));
}

async function writePng(sourceFile, outputRel, width, height) {
  await sharp(path.join(sourceDir, sourceFile))
    .resize(width, height, { fit: "cover", position: "attention" })
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, outputRel));
}

async function writeContactCrop(col, row, outputRel, width, height) {
  const input = path.join(sourceDir, sources.contactSheet);
  const meta = await sharp(input).metadata();
  const gutters = 12;
  const cellW = Math.floor((meta.width - gutters * 3) / 4);
  const cellH = Math.floor((meta.height - gutters * 2) / 3);
  const left = col * (cellW + gutters);
  const top = row * (cellH + gutters);

  await sharp(input)
    .extract({ left, top, width: cellW, height: cellH })
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(publicDir, outputRel));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
