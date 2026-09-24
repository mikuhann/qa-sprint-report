import {
  getDefectsForPeriod,
  getDefectsOutsideSprint,
  getSprintIssues,
  getCarryOverIssues,
  getReopenedAfterTestingIssues,
} from "../jira/issues.js";

import { getSprintReportMeta } from "./meta.js";
import { isSprintDeliveryIssue } from "./rules.js";
import { buildIssueSearchLink, buildVersionIssuesLink } from "../jira/links.js";
import { getReleasedVersionsForPeriod } from "../jira/versions.js";
import { loadSprintOverrides } from "./overrides.js";
import { calculateSprintInsights } from "./insights.js";

import {
  calculateDefectStatistics,
  calculateDefectsByDeveloper,
  calculateIssueTypeStatistics,
  calculateResolutionStatistics,
  calculateSeverityStatistics,
  calculateSprintTaskStatistics,
  getSprintTaskGroups,
  validateDefectClassification,
  validateResolutions,
  validateSeverities,
  validateSprintStatuses,
  getIssueTypeGroups,
  getDefectGroups,
  getSeverityGroups,
  getResolutionGroups,
  getDefectsByDeveloperGroups,
} from "./statistics.js";
import { getAssigneeHistory } from "../jira/changelog.js";

import type { SprintReport } from "./types.js";

export async function buildReport(sprintId?: number): Promise<SprintReport> {
  const meta = await getSprintReportMeta(sprintId);

  const releasedVersions = await getReleasedVersionsForPeriod(
    meta.queryStartDate,
    meta.queryEndDate,
  );

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

  const taskGroups = getSprintTaskGroups(issues);

  const issueTypeGroups = getIssueTypeGroups(issues);

  const resolutionIssues = deliveryIssues.filter((issue) =>
    ["Закрыто", "Ожидает выгрузки"].includes(issue.fields.status.name),
  );

  const resolutionGroups = getResolutionGroups(resolutionIssues);

  const defects = await getDefectsForPeriod(
    meta.queryStartDate,
    meta.queryEndDate,
  );

  const assigneeHistory = await getAssigneeHistory(defects);

  const defectGroups = getDefectGroups(defects);
  const severityGroups = getSeverityGroups(defects);

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

  const developerGroups = getDefectsByDeveloperGroups(defects, assigneeHistory);

  const manual = await loadSprintOverrides(meta.sprintId);

  const tasksStatistics = calculateSprintTaskStatistics(issues);

  const defectStatistics = calculateDefectStatistics(defects);

  const resolutionStatistics = calculateResolutionStatistics(resolutionIssues);

  const severityStatistics = calculateSeverityStatistics(defects);

  const developerStatistics = calculateDefectsByDeveloper(
    defects,
    assigneeHistory,
  );

  return {
    meta,

    releasedVersions: releasedVersions.map((version) => ({
      id: version.id,
      name: version.name,
      releaseDate: version.releaseDate!,
      url: buildVersionIssuesLink(version.id),
    })),

    tasks: tasksStatistics,

    unresolvedIssues: taskGroups.unresolved.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      issueType: issue.fields.issuetype.name,
      status: issue.fields.status.name,
      priority: issue.fields.priority?.name ?? null,
    })),

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

    defectsByDeveloper: calculateDefectsByDeveloper(defects, assigneeHistory),
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
    links: {
      tasks: {
        total: buildIssueSearchLink(taskGroups.total),
        unresolved: buildIssueSearchLink(taskGroups.unresolved),
        testing: buildIssueSearchLink(taskGroups.testing),
        waitingRelease: buildIssueSearchLink(taskGroups.waitingRelease),
        closed: buildIssueSearchLink(taskGroups.closed),
        blocked: buildIssueSearchLink(taskGroups.blocked),
      },

      issueTypes: {
        total: buildIssueSearchLink(issueTypeGroups.total),
        stories: buildIssueSearchLink(issueTypeGroups.stories),
        tasks: buildIssueSearchLink(issueTypeGroups.tasks),
        bugs: buildIssueSearchLink(issueTypeGroups.bugs),
        other: buildIssueSearchLink(issueTypeGroups.other),
      },

      defects: {
        total: buildIssueSearchLink(defectGroups.total),
        prodIssue: buildIssueSearchLink(defectGroups.prodIssue),
        common: buildIssueSearchLink(defectGroups.common),
        requirementsNotMet: buildIssueSearchLink(
          defectGroups.requirementsNotMet,
        ),
        regression: buildIssueSearchLink(defectGroups.regression),
        requirementsIssue: buildIssueSearchLink(defectGroups.requirementsIssue),
        missedIssue: buildIssueSearchLink(defectGroups.missedIssue),
      },

      defectsOutsideSprint: buildIssueSearchLink(defectsOutsideSprintIssues),

      resolutions: {
        total: buildIssueSearchLink(resolutionGroups.total),

        ready: buildIssueSearchLink(resolutionGroups.ready),

        fixed: buildIssueSearchLink(resolutionGroups.fixed),

        resolvedInTask: buildIssueSearchLink(resolutionGroups.resolvedInTask),

        notBug: buildIssueSearchLink(resolutionGroups.notBug),

        cannotReproduce: buildIssueSearchLink(resolutionGroups.cannotReproduce),

        duplicate: buildIssueSearchLink(resolutionGroups.duplicate),

        wontFix: buildIssueSearchLink(resolutionGroups.wontFix),

        notRelevant: buildIssueSearchLink(resolutionGroups.notRelevant),

        needsRewording: buildIssueSearchLink(resolutionGroups.needsRewording),
      },

      severity: {
        total: buildIssueSearchLink(severityGroups.total),
        blocker: buildIssueSearchLink(severityGroups.blocker),
        critical: buildIssueSearchLink(severityGroups.critical),
        major: buildIssueSearchLink(severityGroups.major),
        minor: buildIssueSearchLink(severityGroups.minor),
        trivial: buildIssueSearchLink(severityGroups.trivial),
      },

      defectsByDeveloper: developerGroups.map((group) => ({
        accountId: group.accountId,
        name: group.name,
        url: buildIssueSearchLink(group.issues),
      })),

      carryOver: buildIssueSearchLink(carryOverIssues),

      reopened: buildIssueSearchLink(reopenedIssues),
    },
    insights: calculateSprintInsights(
      tasksStatistics,
      defectStatistics,
      severityStatistics,
      developerStatistics,
    ),
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
    manual,
  };
}
