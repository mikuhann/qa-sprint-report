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
  warnings: ReportWarnings;
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
