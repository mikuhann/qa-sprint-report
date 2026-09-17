import { getDefectsForPeriod, getSprintIssues } from "./jira/issues.js";

import { getSprintReportMeta } from "./report/meta.js";

import { isSprintDeliveryIssue } from "./report/rules.js";

import {
  calculateDefectStatistics,
  calculateResolutionStatistics,
  calculateSeverityStatistics,
  calculateSprintTaskStatistics,
  validateDefectClassification,
  validateResolutions,
  validateSeverities,
} from "./report/statistics.js";

async function main() {
  const meta = await getSprintReportMeta();

  const issues = await getSprintIssues(meta.sprintId, meta.previousSprintIds);

  const resolutionIssues = issues
    .filter(isSprintDeliveryIssue)
    .filter((issue) =>
      ["Закрыто", "Ожидает выгрузки"].includes(issue.fields.status.name),
    );

  console.log("\nResolution issues:", resolutionIssues.length);

  const resolutionStatistics = calculateResolutionStatistics(resolutionIssues);

  const resolutionValidation = validateResolutions(resolutionIssues);

  console.log("\nResolution statistics:");
  console.log(resolutionStatistics);

  if (resolutionValidation.missing.length) {
    console.warn("⚠️ Missing resolutions:", resolutionValidation.missing);
  }

  if (resolutionValidation.unknown.length) {
    console.warn("⚠️ Unknown resolutions:", resolutionValidation.unknown);
  }

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

  const severityStatistics = calculateSeverityStatistics(defects);

  const severityValidation = validateSeverities(defects);

  console.log("\nSeverity statistics:");
  console.log(severityStatistics);

  if (severityValidation.missing.length) {
    console.warn("⚠️ Missing severity:", severityValidation.missing);
  }

  if (severityValidation.unknown.length) {
    console.warn("⚠️ Unknown severity:", severityValidation.unknown);
  }
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
