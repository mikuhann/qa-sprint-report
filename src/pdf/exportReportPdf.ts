import { chromium } from "playwright";

const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "http://localhost:5173";

export async function exportReportPdf(): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.goto(`${DASHBOARD_URL}/?print=1`, {
      waitUntil: "networkidle",
    });

    await page.waitForFunction(
      () => document.documentElement.dataset.pdfReady === "true",
      undefined,
      {
        timeout: 30_000,
      },
    );

    return await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}
