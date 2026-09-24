import { buildReport } from "./report/buildReport.js";
import { writeReport } from "./report/writeReport.js";

function getSprintIdFromArgs(): number | undefined {
  const index = process.argv.indexOf("--sprint");

  if (index === -1) {
    return undefined;
  }

  const value = process.argv[index + 1];
  const sprintId = Number(value);

  if (!value || !Number.isInteger(sprintId)) {
    throw new Error("Sprint ID must be an integer. Example: --sprint 1041");
  }

  return sprintId;
}

async function main() {
  const sprintId = getSprintIdFromArgs();
  console.log(
    sprintId
      ? `Generating report for sprint ${sprintId}...`
      : "Generating report for active sprint...",
  );

  const report = await buildReport(sprintId);

  const paths = await writeReport(report);

  console.log(`Report generated: ${paths.outputPath}`);
  console.log(`Dashboard data: ${paths.dashboardPath}`);

  if (report.warnings.unclassifiedDefects.length) {
    console.warn(
      "⚠️ Unclassified defects:",
      report.warnings.unclassifiedDefects,
    );
  }

  if (report.warnings.unassignedDefects.length) {
    console.warn("⚠️ Unassigned defects:", report.warnings.unassignedDefects);
  }

  if (report.warnings.unknownStatuses.length) {
    console.warn(
      "⚠️ Unknown sprint statuses:",
      report.warnings.unknownStatuses,
    );
  }
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
