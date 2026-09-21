export interface SprintReportMeta {
  sprintId: number;
  sprintName: string;
  startDate: string;
  endDate: string;
  sprintDates: string;
  previousSprintIds: number[];
  queryStartDate: string;
  queryEndDate: string;
}

export interface SprintTaskStatistics {
  total: number;
  unresolved: number;
  testing: number;
  waitingRelease: number;
  closed: number;
  blocked: number;
}

export interface IssueTypeStatistics {
  total: number;
  stories: number;
  tasks: number;
  bugs: number;
  other: number;
}

export interface UnknownStatus {
  key: string;
  status: string;
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

export interface SeverityStatistics {
  total: number;
  blocker: number;
  critical: number;
  major: number;
  minor: number;
  trivial: number;
}

export interface DeveloperDefectStatistics {
  accountId: string | null;
  name: string;
  defects: number;
}

export interface ReportWarnings {
  unclassifiedDefects: string[];
  multipleClassifications: string[];
  missingResolutions: string[];
  unknownResolutions: Array<{
    key: string;
    value: string;
  }>;
  missingSeverity: string[];
  unknownSeverity: Array<{
    key: string;
    value: string;
  }>;
  unassignedDefects: string[];
  unknownStatuses: UnknownStatus[];
}

export interface SprintReport {
  meta: SprintReportMeta;
  tasks: SprintTaskStatistics;
  issueTypes: IssueTypeStatistics;
  defects: DefectStatistics;
  defectsOutsideSprint: DefectsOutsideSprint;
  resolutions: ResolutionStatistics;
  severity: SeverityStatistics;
  defectsByDeveloper: DeveloperDefectStatistics[];
  carryOver: CarryOverStatistics;
  reopened: ReopenedStatistics;
  releasedVersions: ReleasedVersion[];
  links: ReportLinks;
  warnings: ReportWarnings;
  manual: SprintManualData;
}

export interface DefectsOutsideSprint {
  total: number;

  issues: {
    key: string;
    summary: string;
    priority: string | null;
  }[];
}

export interface CarryOverStatistics {
  fromSprintId: number | null;
  total: number;

  issues: {
    key: string;
    summary: string;
    issueType: string;
    status: string;
  }[];
}

export interface ReopenedStatistics {
  total: number;

  issues: {
    key: string;
    summary: string;
    issueType: string;
    status: string;
    priority: string | null;
  }[];
}

export interface ReportLinks {
  tasks: {
    total: string | null;
    unresolved: string | null;
    testing: string | null;
    waitingRelease: string | null;
    closed: string | null;
    blocked: string | null;
  };

  issueTypes: {
    total: string | null;
    stories: string | null;
    tasks: string | null;
    bugs: string | null;
    other: string | null;
  };

  defects: {
    total: string | null;
    prodIssue: string | null;
    common: string | null;
    requirementsNotMet: string | null;
    regression: string | null;
    requirementsIssue: string | null;
    missedIssue: string | null;
  };

  defectsOutsideSprint: string | null;

  resolutions: {
    total: string | null;
    ready: string | null;
    fixed: string | null;
    resolvedInTask: string | null;
    notBug: string | null;
    cannotReproduce: string | null;
    duplicate: string | null;
    wontFix: string | null;
    notRelevant: string | null;
    needsRewording: string | null;
  };

  severity: {
    total: string | null;
    blocker: string | null;
    critical: string | null;
    major: string | null;
    minor: string | null;
    trivial: string | null;
  };

  defectsByDeveloper: {
    accountId: string | null;
    name: string;
    url: string | null;
  }[];
  carryOver: string | null;
  reopened: string | null;
}

export interface ReleasedVersion {
  id: string;
  name: string;
  releaseDate: string;
  url: string;
}

export type SprintGoalStatus = "planned" | "done" | "moved" | "failed";

export type QaAssessment = "good" | "average" | "poor";

export interface SprintGoal {
  text: string;
  status: SprintGoalStatus;
}

export interface SprintManualData {
  qaAssessment: QaAssessment | null;
  comment: string | null;

  goals: {
    backend: SprintGoal[];
    frontend: SprintGoal[];
    qa: SprintGoal[];
  };
}
