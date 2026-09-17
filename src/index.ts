import { buildReport } from "./report/buildReport.js";
import { writeReport } from "./report/writeReport.js";

async function main() {
  console.log("Generating sprint report...");

  const report = await buildReport();

  const outputPath = await writeReport(report);

  console.log(`Report generated: ${outputPath}`);

  if (report.warnings.unclassifiedDefects.length) {
    console.warn(
      "⚠️ Unclassified defects:",
      report.warnings.unclassifiedDefects,
    );
  }

  if (report.warnings.unassignedDefects.length) {
    console.warn("⚠️ Unassigned defects:", report.warnings.unassignedDefects);
  }
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
