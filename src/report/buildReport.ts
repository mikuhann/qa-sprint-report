import { getDefectsForPeriod, getSprintIssues } from "../jira/issues.js";

import { getSprintReportMeta } from "./meta.js";
import { isSprintDeliveryIssue } from "./rules.js";

import {
  calculateDefectStatistics,
  calculateDefectsByDeveloper,
  calculateResolutionStatistics,
  calculateSeverityStatistics,
  calculateSprintTaskStatistics,
  validateDefectClassification,
  validateResolutions,
  validateSeverities,
  calculateIssueTypeStatistics,
  validateSprintStatuses,
} from "./statistics.js";

import type { SprintReport } from "./types.js";

export async function buildReport(): Promise<SprintReport> {
  const meta = await getSprintReportMeta();

  const issues = await getSprintIssues(meta.sprintId, meta.previousSprintIds);

  const deliveryIssues = issues.filter(isSprintDeliveryIssue);

  const resolutionIssues = deliveryIssues.filter((issue) =>
    ["Закрыто", "Ожидает выгрузки"].includes(issue.fields.status.name),
  );

  const defects = await getDefectsForPeriod(meta.startDate, meta.endDate);

  const defectValidation = validateDefectClassification(defects);

  const resolutionValidation = validateResolutions(resolutionIssues);

  const severityValidation = validateSeverities(defects);

  const unknownStatuses = validateSprintStatuses(issues);

  return {
    meta,

    tasks: calculateSprintTaskStatistics(issues),

    issueTypes: calculateIssueTypeStatistics(issues),

    defects: calculateDefectStatistics(defects),

    resolutions: calculateResolutionStatistics(resolutionIssues),

    severity: calculateSeverityStatistics(defects),

    defectsByDeveloper: calculateDefectsByDeveloper(defects),

    warnings: {
      unclassifiedDefects: defectValidation.unclassified,

      multipleClassifications: defectValidation.multipleClassifications,

      missingResolutions: resolutionValidation.missing,

      unknownResolutions: resolutionValidation.unknown,

      missingSeverity: severityValidation.missing,

      unknownSeverity: severityValidation.unknown,
      unknownStatuses,
      unassignedDefects: defects
        .filter((issue) => !issue.fields.assignee)
        .map((issue) => issue.key),
    },
  };
}
