import type {
  DefectStatistics,
  DeveloperDefectStatistics,
  SeverityStatistics,
  SprintInsights,
  SprintTaskStatistics,
} from "./types.js";

function percent(part: number, total: number): number {
  if (!total) {
    return 0;
  }

  return Number(((part / total) * 100).toFixed(1));
}

export function calculateSprintInsights(
  tasks: SprintTaskStatistics,
  defects: DefectStatistics,
  severity: SeverityStatistics,
  developers: DeveloperDefectStatistics[],
): SprintInsights {
  const taskStatuses = [
    ["unresolved", tasks.unresolved],
    ["testing", tasks.testing],
    ["waitingRelease", tasks.waitingRelease],
    ["closed", tasks.closed],
  ] as const;

  const [taskStatusKey, taskStatusCount] = taskStatuses.reduce(
    (max, current) => (current[1] > max[1] ? current : max),
  );

  const defectReasons = [
    ["prodIssue", defects.prodIssue],
    ["common", defects.common],
    ["requirementsNotMet", defects.requirementsNotMet],
    ["regression", defects.regression],
    ["requirementsIssue", defects.requirementsIssue],
    ["missedIssue", defects.missedIssue],
  ] as const;

  const [defectReasonKey, defectReasonCount] = defectReasons.reduce(
    (max, current) => (current[1] > max[1] ? current : max),
  );

  const assignedDevelopers = developers.filter(
    (developer) => developer.accountId !== null,
  );

  const maxDeveloperDefects = Math.max(
    0,
    ...assignedDevelopers.map((developer) => developer.defects),
  );

  const topDevelopers = assignedDevelopers
    .filter(
      (developer) =>
        developer.defects === maxDeveloperDefects && maxDeveloperDefects > 0,
    )
    .map((developer) => ({
      accountId: developer.accountId!,
      name: developer.name,
      defects: developer.defects,
    }));

  return {
    dominantTaskStatus: {
      key: taskStatusKey,
      count: taskStatusCount,
      percent: percent(taskStatusCount, tasks.total),
    },

    dominantDefectReason:
      defectReasonCount > 0
        ? {
            key: defectReasonKey,
            count: defectReasonCount,
            percent: percent(defectReasonCount, defects.total),
          }
        : null,

    severity: {
      blocker: severity.blocker,
      critical: severity.critical,
    },

    topDevelopers,
  };
}
