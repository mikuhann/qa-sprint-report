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

  console.log({
    allSprintIssues: issues.length,
    deliveryIssues: deliveryIssues.length,
    excludedDutyIssues: issues.length - deliveryIssues.length,
  });

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

  const classificationLabels = new Set(Object.values(DEFECT_LABELS));

  const unclassified = defects.filter((issue) => {
    return !issue.fields.labels.some((label) =>
      classificationLabels.has(
        label as (typeof DEFECT_LABELS)[keyof typeof DEFECT_LABELS],
      ),
    );
  });

  console.log(
    "Unclassified defects:",
    unclassified.map((issue) => issue.key),
  );

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
