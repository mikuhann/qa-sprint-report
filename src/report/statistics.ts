import type { JiraIssue } from "../jira/issues.js";
import { isSprintDeliveryIssue } from "./rules.js";

export interface SprintTaskStatistics {
  total: number;
  unresolved: number;
  testing: number;
  waitingRelease: number;
  closed: number;
}

const UNRESOLVED_STATUSES = new Set([
  "В работу",
  "В процессе",
  "Отложена",
  "CODE REVIEW",
]);

const TESTING_STATUSES = new Set([
  "Отправлено в тестирование",
  "Тестирование в процессе",
]);

export function calculateSprintTaskStatistics(
  issues: JiraIssue[],
): SprintTaskStatistics {
  const deliveryIssues = issues.filter(isSprintDeliveryIssue);

  const total = deliveryIssues.length;

  const unresolved = deliveryIssues.filter((issue) =>
    UNRESOLVED_STATUSES.has(issue.fields.status.name),
  ).length;

  const testing = deliveryIssues.filter((issue) =>
    TESTING_STATUSES.has(issue.fields.status.name),
  ).length;

  const waitingRelease = deliveryIssues.filter(
    (issue) => issue.fields.status.name === "Ожидает выгрузки",
  ).length;

  const closed = deliveryIssues.filter(
    (issue) => issue.fields.status.name === "Закрыто",
  ).length;

  return {
    total,
    unresolved,
    testing,
    waitingRelease,
    closed,
  };
}

export interface DefectStatistics {
  total: number;
  prodIssue: number;
  common: number;
  requirementsNotMet: number;
  regression: number;
  requirementsIssue: number;
  missedIssue: number;
}

const DEFECT_LABELS = {
  prodIssue: "prod_issue",
  common: "Common",
  requirementsNotMet: "Requirements_are_not_met",
  regression: "Regression",
  requirementsIssue: "Requirements_issue",
  missedIssue: "missed_issue",
} as const;

export function calculateDefectStatistics(
  defects: JiraIssue[],
): DefectStatistics {
  const hasLabel = (issue: JiraIssue, label: string): boolean => {
    return issue.fields.labels.includes(label);
  };

  return {
    total: defects.length,

    prodIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.prodIssue),
    ).length,

    common: defects.filter((issue) => hasLabel(issue, DEFECT_LABELS.common))
      .length,

    requirementsNotMet: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.requirementsNotMet),
    ).length,

    regression: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.regression),
    ).length,

    requirementsIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.requirementsIssue),
    ).length,

    missedIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.missedIssue),
    ).length,
  };
}

export interface DefectClassificationValidation {
  unclassified: string[];
  multipleClassifications: string[];
}

export function validateDefectClassification(
  defects: JiraIssue[],
): DefectClassificationValidation {
  const classificationLabels = new Set(Object.values(DEFECT_LABELS));

  const unclassified: string[] = [];
  const multipleClassifications: string[] = [];

  for (const issue of defects) {
    const matchedLabels = issue.fields.labels.filter((label) =>
      classificationLabels.has(
        label as (typeof DEFECT_LABELS)[keyof typeof DEFECT_LABELS],
      ),
    );

    if (matchedLabels.length === 0) {
      unclassified.push(issue.key);
    }

    if (matchedLabels.length > 1) {
      multipleClassifications.push(issue.key);
    }
  }

  return {
    unclassified,
    multipleClassifications,
  };
}

export interface ResolutionStatistics {
  total: number;
  ready: number;
  fixed: number;
  resolvedInTask: number;
  notBug: number;
  cannotReproduce: number;
  duplicate: number;
  wontFix: number;
  notRelevant: number;
  needsRewording: number;
}

const RESOLUTIONS = {
  ready: "Готово",
  fixed: "Исправлено",
  resolvedInTask: "Решено в задаче",
  notBug: "Не является багом",
  cannotReproduce: "Не воспроизводится",
  duplicate: "Дубликат",
  wontFix: "Не будет исправляться",
  notRelevant: "Не актуально",
  needsRewording: "Требует переформулировки",
} as const;

export function calculateResolutionStatistics(
  issues: JiraIssue[],
): ResolutionStatistics {
  const getResolution = (issue: JiraIssue) =>
    issue.fields.customfield_10204?.value;

  const count = (value: string) =>
    issues.filter((issue) => getResolution(issue) === value).length;

  return {
    total: issues.length,
    ready: count(RESOLUTIONS.ready),
    fixed: count(RESOLUTIONS.fixed),
    resolvedInTask: count(RESOLUTIONS.resolvedInTask),
    notBug: count(RESOLUTIONS.notBug),
    cannotReproduce: count(RESOLUTIONS.cannotReproduce),
    duplicate: count(RESOLUTIONS.duplicate),
    wontFix: count(RESOLUTIONS.wontFix),
    notRelevant: count(RESOLUTIONS.notRelevant),
    needsRewording: count(RESOLUTIONS.needsRewording),
  };
}

export interface ResolutionValidation {
  missing: string[];
  unknown: Array<{
    key: string;
    value: string;
  }>;
}

export function validateResolutions(issues: JiraIssue[]): ResolutionValidation {
  const knownValues = new Set(Object.values(RESOLUTIONS));

  const missing: string[] = [];
  const unknown: Array<{
    key: string;
    value: string;
  }> = [];

  for (const issue of issues) {
    const value = issue.fields.customfield_10204?.value;

    if (!value) {
      missing.push(issue.key);
      continue;
    }

    if (
      !knownValues.has(value as (typeof RESOLUTIONS)[keyof typeof RESOLUTIONS])
    ) {
      unknown.push({
        key: issue.key,
        value,
      });
    }
  }

  return {
    missing,
    unknown,
  };
}

export interface SeverityStatistics {
  total: number;
  blocker: number;
  critical: number;
  major: number;
  minor: number;
  trivial: number;
}

const SEVERITIES = {
  blocker: "Блокер",
  critical: "Критический",
  major: "Серьезный",
  minor: "Незначительный",
  trivial: "Тривиальный",
} as const;

export function calculateSeverityStatistics(
  defects: JiraIssue[],
): SeverityStatistics {
  const count = (priority: string) =>
    defects.filter((issue) => issue.fields.priority?.name === priority).length;

  return {
    total: defects.length,
    blocker: count(SEVERITIES.blocker),
    critical: count(SEVERITIES.critical),
    major: count(SEVERITIES.major),
    minor: count(SEVERITIES.minor),
    trivial: count(SEVERITIES.trivial),
  };
}

export interface SeverityValidation {
  missing: string[];
  unknown: Array<{
    key: string;
    value: string;
  }>;
}

export function validateSeverities(defects: JiraIssue[]): SeverityValidation {
  const knownValues = new Set(Object.values(SEVERITIES));

  const missing: string[] = [];
  const unknown: Array<{
    key: string;
    value: string;
  }> = [];

  for (const issue of defects) {
    const priority = issue.fields.priority?.name;

    if (!priority) {
      missing.push(issue.key);
      continue;
    }

    if (
      !knownValues.has(priority as (typeof SEVERITIES)[keyof typeof SEVERITIES])
    ) {
      unknown.push({
        key: issue.key,
        value: priority,
      });
    }
  }

  return {
    missing,
    unknown,
  };
}
