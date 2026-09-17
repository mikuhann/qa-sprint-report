import {
  getDefectsForPeriod,
  getDefectsOutsideSprint,
  getSprintIssues,
  getCarryOverIssues,
  getReopenedAfterTestingIssues,
} from "../jira/issues.js";

import { getSprintReportMeta } from "./meta.js";
import { isSprintDeliveryIssue } from "./rules.js";

import {
  calculateDefectStatistics,
  calculateDefectsByDeveloper,
  calculateIssueTypeStatistics,
  calculateResolutionStatistics,
  calculateSeverityStatistics,
  calculateSprintTaskStatistics,
  validateDefectClassification,
  validateResolutions,
  validateSeverities,
  validateSprintStatuses,
} from "./statistics.js";

import type { SprintReport } from "./types.js";

export async function buildReport(): Promise<SprintReport> {
  const meta = await getSprintReportMeta();

  const issues = await getSprintIssues(meta.sprintId, meta.previousSprintIds);

  const previousSprintId = meta.previousSprintIds[0];

  const carryOverIssues = previousSprintId
    ? (
        await getCarryOverIssues(
          meta.sprintId,
          previousSprintId,
          meta.queryStartDate,
          meta.queryEndDate,
        )
      ).filter(isSprintDeliveryIssue)
    : [];

  const deliveryIssues = issues.filter(isSprintDeliveryIssue);

  const resolutionIssues = deliveryIssues.filter((issue) =>
    ["Закрыто", "Ожидает выгрузки"].includes(issue.fields.status.name),
  );

  const defects = await getDefectsForPeriod(
    meta.queryStartDate,
    meta.queryEndDate,
  );

  const defectsOutsideSprintIssues = await getDefectsOutsideSprint(
    meta.sprintId,
    meta.queryStartDate,
    meta.queryEndDate,
  );

  const reopenedIssues = (
    await getReopenedAfterTestingIssues(
      meta.sprintId,
      meta.queryStartDate,
      meta.queryEndDate,
    )
  ).filter(isSprintDeliveryIssue);

  const defectValidation = validateDefectClassification(defects);

  const resolutionValidation = validateResolutions(resolutionIssues);

  const severityValidation = validateSeverities(defects);

  const unknownStatuses = validateSprintStatuses(deliveryIssues);

  return {
    meta,

    tasks: calculateSprintTaskStatistics(issues),

    issueTypes: calculateIssueTypeStatistics(deliveryIssues),

    defects: calculateDefectStatistics(defects),

    defectsOutsideSprint: {
      total: defectsOutsideSprintIssues.length,

      issues: defectsOutsideSprintIssues.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        priority: issue.fields.priority?.name ?? null,
      })),
    },

    resolutions: calculateResolutionStatistics(resolutionIssues),

    severity: calculateSeverityStatistics(defects),

    defectsByDeveloper: calculateDefectsByDeveloper(defects),
    carryOver: {
      fromSprintId: previousSprintId ?? null,
      total: carryOverIssues.length,

      issues: carryOverIssues.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype.name,
        status: issue.fields.status.name,
      })),
    },
    reopened: {
      total: reopenedIssues.length,

      issues: reopenedIssues.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype.name,
        status: issue.fields.status.name,
        priority: issue.fields.priority?.name ?? null,
      })),
    },
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
