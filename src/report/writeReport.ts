import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { SprintReport } from "./types.js";

export async function writeReport(report: SprintReport): Promise<{
  outputPath: string;
  dashboardPath: string;
}> {
  const json = JSON.stringify(report, null, 2);

  const outputDir = join(
    process.cwd(),
    "output",
    `sprint-${report.meta.sprintId}`,
  );

  const dashboardDir = join(process.cwd(), "dashboard", "public");

  await Promise.all([
    mkdir(outputDir, { recursive: true }),
    mkdir(dashboardDir, { recursive: true }),
  ]);

  const outputPath = join(outputDir, "report.json");
  const dashboardPath = join(dashboardDir, "report.json");

  await Promise.all([
    writeFile(outputPath, json, "utf8"),
    writeFile(dashboardPath, json, "utf8"),
  ]);

  return {
    outputPath,
    dashboardPath,
  };
}
