export interface SprintReport {
  meta: {
    sprintId: number;
    sprintName: string;
    startDate: string;
    endDate: string;
    sprintDates: string;
    previousSprintIds: number[];
    queryStartDate: string;
    queryEndDate: string;
  };

  releasedVersions: {
    id: string;
    name: string;
    releaseDate: string;
    url: string;
  }[];

  tasks: {
    total: number;
    unresolved: number;
    testing: number;
    waitingRelease: number;
    closed: number;
    blocked: number;
  };

  issueTypes: {
    total: number;
    stories: number;
    tasks: number;
    bugs: number;
    other: number;
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

  defectsOutsideSprint: {
    total: number;
    issues: {
      key: string;
      summary: string;
      priority: string | null;
    }[];
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

  carryOver: {
    fromSprintId: number | null;
    total: number;
    issues: {
      key: string;
      summary: string;
      issueType: string;
      status: string;
    }[];
  };

  reopened: {
    total: number;
    issues: {
      key: string;
      summary: string;
      issueType: string;
      status: string;
      priority: string | null;
    }[];
  };

  links: {
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
  };

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

    unknownStatuses: {
      key: string;
      status: string;
    }[];
  };
}
