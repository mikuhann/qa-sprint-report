import type { JiraIssue } from "../jira/issues.js";
import { isSprintDeliveryIssue } from "./rules.js";
import type {
  IssueTypeStatistics,
  SprintTaskStatistics,
  UnknownStatus,
} from "./types.js";

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

const BLOCKED_STATUSES = new Set(["Тестирование заблокировано"]);

export function calculateSprintTaskStatistics(
  issues: JiraIssue[],
): SprintTaskStatistics {
  const groups = getSprintTaskGroups(issues);

  return {
    total: groups.total.length,
    unresolved: groups.unresolved.length,
    testing: groups.testing.length,
    waitingRelease: groups.waitingRelease.length,
    closed: groups.closed.length,
    blocked: groups.blocked.length,
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

export interface DefectGroups {
  total: JiraIssue[];
  prodIssue: JiraIssue[];
  common: JiraIssue[];
  requirementsNotMet: JiraIssue[];
  regression: JiraIssue[];
  requirementsIssue: JiraIssue[];
  missedIssue: JiraIssue[];
}

export function getDefectGroups(defects: JiraIssue[]): DefectGroups {
  const hasLabel = (issue: JiraIssue, label: string) =>
    issue.fields.labels.includes(label);

  return {
    total: defects,

    prodIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.prodIssue),
    ),

    common: defects.filter((issue) => hasLabel(issue, DEFECT_LABELS.common)),

    requirementsNotMet: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.requirementsNotMet),
    ),

    regression: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.regression),
    ),

    requirementsIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.requirementsIssue),
    ),

    missedIssue: defects.filter((issue) =>
      hasLabel(issue, DEFECT_LABELS.missedIssue),
    ),
  };
}

export function calculateDefectStatistics(
  defects: JiraIssue[],
): DefectStatistics {
  const groups = getDefectGroups(defects);

  return {
    total: groups.total.length,
    prodIssue: groups.prodIssue.length,
    common: groups.common.length,
    requirementsNotMet: groups.requirementsNotMet.length,
    regression: groups.regression.length,
    requirementsIssue: groups.requirementsIssue.length,
    missedIssue: groups.missedIssue.length,
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

export interface ResolutionGroups {
  total: JiraIssue[];
  ready: JiraIssue[];
  fixed: JiraIssue[];
  resolvedInTask: JiraIssue[];
  notBug: JiraIssue[];
  cannotReproduce: JiraIssue[];
  duplicate: JiraIssue[];
  wontFix: JiraIssue[];
  notRelevant: JiraIssue[];
  needsRewording: JiraIssue[];
}

export function getResolutionGroups(issues: JiraIssue[]): ResolutionGroups {
  const byResolution = (value: string) =>
    issues.filter((issue) => issue.fields.customfield_10204?.value === value);

  return {
    total: issues,

    ready: byResolution(RESOLUTIONS.ready),
    fixed: byResolution(RESOLUTIONS.fixed),
    resolvedInTask: byResolution(RESOLUTIONS.resolvedInTask),
    notBug: byResolution(RESOLUTIONS.notBug),
    cannotReproduce: byResolution(RESOLUTIONS.cannotReproduce),
    duplicate: byResolution(RESOLUTIONS.duplicate),
    wontFix: byResolution(RESOLUTIONS.wontFix),
    notRelevant: byResolution(RESOLUTIONS.notRelevant),
    needsRewording: byResolution(RESOLUTIONS.needsRewording),
  };
}

export function calculateResolutionStatistics(
  issues: JiraIssue[],
): ResolutionStatistics {
  const groups = getResolutionGroups(issues);

  return {
    total: groups.total.length,
    ready: groups.ready.length,
    fixed: groups.fixed.length,
    resolvedInTask: groups.resolvedInTask.length,
    notBug: groups.notBug.length,
    cannotReproduce: groups.cannotReproduce.length,
    duplicate: groups.duplicate.length,
    wontFix: groups.wontFix.length,
    notRelevant: groups.notRelevant.length,
    needsRewording: groups.needsRewording.length,
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

export interface SeverityGroups {
  total: JiraIssue[];
  blocker: JiraIssue[];
  critical: JiraIssue[];
  major: JiraIssue[];
  minor: JiraIssue[];
  trivial: JiraIssue[];
}

export function getSeverityGroups(defects: JiraIssue[]): SeverityGroups {
  const byPriority = (priority: string) =>
    defects.filter((issue) => issue.fields.priority?.name === priority);

  return {
    total: defects,

    blocker: byPriority(SEVERITIES.blocker),
    critical: byPriority(SEVERITIES.critical),
    major: byPriority(SEVERITIES.major),
    minor: byPriority(SEVERITIES.minor),
    trivial: byPriority(SEVERITIES.trivial),
  };
}

export function calculateSeverityStatistics(
  defects: JiraIssue[],
): SeverityStatistics {
  const groups = getSeverityGroups(defects);

  return {
    total: groups.total.length,
    blocker: groups.blocker.length,
    critical: groups.critical.length,
    major: groups.major.length,
    minor: groups.minor.length,
    trivial: groups.trivial.length,
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

export interface DeveloperDefectStatistics {
  accountId: string | null;
  name: string;
  defects: number;
}

export interface DeveloperDefectGroup {
  accountId: string | null;
  name: string;
  issues: JiraIssue[];
}

export function getDefectsByDeveloperGroups(
  defects: JiraIssue[],
): DeveloperDefectGroup[] {
  const groups = new Map<string, DeveloperDefectGroup>();

  for (const issue of defects) {
    const assignee = issue.fields.assignee;

    const key = assignee?.accountId ?? "unassigned";

    const existing = groups.get(key);

    if (existing) {
      existing.issues.push(issue);
      continue;
    }

    groups.set(key, {
      accountId: assignee?.accountId ?? null,
      name: assignee?.displayName ?? "Unassigned",
      issues: [issue],
    });
  }

  return [...groups.values()].sort((a, b) => b.issues.length - a.issues.length);
}

export function calculateDefectsByDeveloper(
  defects: JiraIssue[],
): DeveloperDefectStatistics[] {
  return getDefectsByDeveloperGroups(defects).map((group) => ({
    accountId: group.accountId,
    name: group.name,
    defects: group.issues.length,
  }));
}

export interface IssueTypeGroups {
  total: JiraIssue[];
  stories: JiraIssue[];
  tasks: JiraIssue[];
  bugs: JiraIssue[];
  other: JiraIssue[];
}

export function getIssueTypeGroups(issues: JiraIssue[]): IssueTypeGroups {
  const deliveryIssues = issues.filter(isSprintDeliveryIssue);

  const stories = deliveryIssues.filter(
    (issue) => issue.fields.issuetype.name === "История",
  );

  const tasks = deliveryIssues.filter(
    (issue) => issue.fields.issuetype.name === "Задача",
  );

  const bugs = deliveryIssues.filter(
    (issue) => issue.fields.issuetype.name === "Баг",
  );

  const other = deliveryIssues.filter(
    (issue) =>
      !["История", "Задача", "Баг"].includes(issue.fields.issuetype.name),
  );

  return {
    total: deliveryIssues,
    stories,
    tasks,
    bugs,
    other,
  };
}

export function calculateIssueTypeStatistics(
  issues: JiraIssue[],
): IssueTypeStatistics {
  const groups = getIssueTypeGroups(issues);

  return {
    total: groups.total.length,
    stories: groups.stories.length,
    tasks: groups.tasks.length,
    bugs: groups.bugs.length,
    other: groups.other.length,
  };
}

const KNOWN_STATUSES = new Set([
  "В работу",
  "В процессе",
  "Отложена",
  "CODE REVIEW",
  "Отправлено в тестирование",
  "Тестирование в процессе",
  "Ожидает выгрузки",
  "Закрыто",
  "Тестирование заблокировано",
]);

export function validateSprintStatuses(issues: JiraIssue[]): UnknownStatus[] {
  return issues
    .filter(isSprintDeliveryIssue)
    .filter((issue) => !KNOWN_STATUSES.has(issue.fields.status.name))
    .map((issue) => ({
      key: issue.key,
      status: issue.fields.status.name,
    }));
}

export interface SprintTaskGroups {
  total: JiraIssue[];
  unresolved: JiraIssue[];
  testing: JiraIssue[];
  waitingRelease: JiraIssue[];
  closed: JiraIssue[];
  blocked: JiraIssue[];
}

export function getSprintTaskGroups(issues: JiraIssue[]): SprintTaskGroups {
  const deliveryIssues = issues.filter(isSprintDeliveryIssue);

  return {
    total: deliveryIssues,

    unresolved: deliveryIssues.filter((issue) =>
      UNRESOLVED_STATUSES.has(issue.fields.status.name),
    ),

    testing: deliveryIssues.filter((issue) =>
      TESTING_STATUSES.has(issue.fields.status.name),
    ),

    waitingRelease: deliveryIssues.filter(
      (issue) => issue.fields.status.name === "Ожидает выгрузки",
    ),

    closed: deliveryIssues.filter(
      (issue) => issue.fields.status.name === "Закрыто",
    ),

    blocked: deliveryIssues.filter((issue) =>
      BLOCKED_STATUSES.has(issue.fields.status.name),
    ),
  };
}
