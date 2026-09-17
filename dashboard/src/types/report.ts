export interface SprintReport {
  meta: {
    sprintId: number;
    sprintName: string;
    startDate: string;
    endDate: string;
    sprintDates: string;
    previousSprintIds: number[];
  };

  tasks: {
    total: number;
    unresolved: number;
    testing: number;
    waitingRelease: number;
    closed: number;
  };

  defects: {
    total: number;
    prodIssue: number;
    common: number;
    requirementsNotMet: number;
    regression: number;
    requirementsIssue: number;
    missedIssue: number;
  };

  resolutions: {
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
  };

  severity: {
    total: number;
    blocker: number;
    critical: number;
    major: number;
    minor: number;
    trivial: number;
  };

  defectsByDeveloper: {
    accountId: string | null;
    name: string;
    defects: number;
  }[];

  warnings: {
    unclassifiedDefects: string[];
    multipleClassifications: string[];
    missingResolutions: string[];
    unknownResolutions: {
      key: string;
      value: string;
    }[];
    missingSeverity: string[];
    unknownSeverity: {
      key: string;
      value: string;
    }[];
    unassignedDefects: string[];
  };
}
