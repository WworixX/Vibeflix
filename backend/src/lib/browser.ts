import { chromium as chromiumExtra } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser, BrowserContext } from "playwright";

// Stealth plugin: cache navigator.webdriver, fake plugins/languages,
// patch User-Agent, etc. Bypass la plupart des bot detections basiques.
chromiumExtra.use(StealthPlugin() as any);

let browser: Browser | null = null;

const HEADFUL = process.env.HEADFUL === "1";

export async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser;
  console.log(
    `[browser] launching Chromium (${HEADFUL ? "HEADFUL" : "headless"}) + stealth`
  );
  browser = (await chromiumExtra.launch({
    headless: !HEADFUL,
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-web-security",
      "--autoplay-policy=no-user-gesture-required",
    ],
  })) as Browser;
  return browser;
}

export async function newContext(): Promise<BrowserContext> {
  const b = await getBrowser();
  return b.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
    locale: "fr-FR",
    bypassCSP: true,
    extraHTTPHeaders: {
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    },
  });
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await closeBrowser();
  process.exit(0);
});
