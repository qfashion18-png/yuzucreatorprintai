import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.getByText("Launch your next creator drop.").waitFor();
  await page.goto(`${baseUrl}/products`, { waitUntil: "domcontentloaded" });
  await page.locator('a[href="/products/die-cut-stickers"]').first().click();
  await page.locator('a[href^="/studio/new"]').first().click();
  await page.locator("canvas").waitFor();
  await page.getByRole("button", { name: /text/i }).click();
  await page.getByRole("button", { name: /^qr$/i }).click();
  await page.getByRole("button", { name: /run preflight/i }).click();
  await page.getByRole("button", { name: /proof/i }).click();
  await page.getByRole("button", { name: /generate quote/i }).click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.goto(`${baseUrl}/checkout`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /place mock order/i }).click();
  await page.waitForURL(/\/orders\/order_/);

  await browser.close();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
