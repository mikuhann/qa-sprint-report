import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { SprintReport } from "./types.js";

export async function writeReport(report: SprintReport): Promise<string> {
  const outputDir = join(
    process.cwd(),
    "output",
    `sprint-${report.meta.sprintId}`,
  );

  await mkdir(outputDir, {
    recursive: true,
  });

  const outputPath = join(outputDir, "report.json");

  await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");

  return outputPath;
}
