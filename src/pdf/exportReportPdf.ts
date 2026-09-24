import { chromium } from "playwright";

const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "http://localhost:5173";

export async function exportReportPdf(sprintId?: number): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    const params = new URLSearchParams({
      print: "1",
    });

    if (sprintId) {
      params.set("sprint", String(sprintId));
    }

    await page.goto(`${DASHBOARD_URL}/?${params.toString()}`, {
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
