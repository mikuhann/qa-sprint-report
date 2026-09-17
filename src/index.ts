import { getDefectsForPeriod, getSprintIssues } from "./jira/issues.js";
import { getSprintReportMeta } from "./report/meta.js";
import {
  calculateDefectStatistics,
  calculateSprintTaskStatistics,
  validateDefectClassification,
} from "./report/statistics.js";

async function main() {
  const meta = await getSprintReportMeta();

  const issues = await getSprintIssues(meta.sprintId, meta.previousSprintIds);

  const statistics = calculateSprintTaskStatistics(issues);

  console.log("\nSprint statistics:");
  console.log(statistics);

  console.log("\nLoading defects...");

  const defects = await getDefectsForPeriod(meta.startDate, meta.endDate);

  console.log(`Defects: ${defects.length}`);

  const defectStatistics = calculateDefectStatistics(defects);
  const defectValidation = validateDefectClassification(defects);

  console.log("\nDefect statistics:");
  console.log(defectStatistics);

  if (defectValidation.unclassified.length) {
    console.warn("⚠️ Unclassified defects:", defectValidation.unclassified);
  }

  if (defectValidation.multipleClassifications.length) {
    console.warn(
      "⚠️ Defects with multiple classifications:",
      defectValidation.multipleClassifications,
    );
  }

  const labels = [
    ...new Set(defects.flatMap((issue) => issue.fields.labels)),
  ].sort();

  console.log("\nDefect labels:");
  console.log(labels);
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
