import { Bug, CheckCircle2, CircleAlert, ListTodo, Users } from "lucide-react";

import type { SprintReport } from "../types/report";

interface SprintHighlightsProps {
  report: SprintReport;
}

const TASK_STATUS_LABELS = {
  unresolved: "Unresolved",
  testing: "Testing",
  waitingRelease: "Waiting release",
  closed: "Closed",
};

const DEFECT_REASON_LABELS = {
  prodIssue: "Production issue",
  common: "Common",
  requirementsNotMet: "Requirements not met",
  regression: "Regression",
  requirementsIssue: "Requirements issue",
  missedIssue: "Missed issue",
};

export function SprintHighlights({ report }: SprintHighlightsProps) {
  const { insights, tasks, warnings } = report;

  const severeDefects = insights.severity.blocker + insights.severity.critical;

  const completedTasks = tasks.closed + tasks.waitingRelease;

  const completedPercent = tasks.total
    ? Number(((completedTasks / tasks.total) * 100).toFixed(1))
    : 0;

  const maxDeveloperDefects = Math.max(
    0,
    ...report.defectsByDeveloper
      .filter((developer) => developer.accountId !== null)
      .map((developer) => developer.defects),
  );

  const warningCount =
    warnings.unclassifiedDefects.length +
    warnings.multipleClassifications.length +
    warnings.missingResolutions.length +
    warnings.unknownResolutions.length +
    warnings.missingSeverity.length +
    warnings.unknownSeverity.length +
    warnings.unassignedDefects.length;

  const items = [
    {
      icon: <ListTodo size={20} />,
      title: "Task distribution",
      value: `${insights.dominantTaskStatus.percent}%`,
      description: `${
        TASK_STATUS_LABELS[insights.dominantTaskStatus.key]
      }: ${insights.dominantTaskStatus.count} of ${tasks.total}`,
    },

    {
      icon: <Bug size={20} />,
      title: "Most frequent defect category",
      value: insights.dominantDefectReason
        ? DEFECT_REASON_LABELS[insights.dominantDefectReason.key]
        : "No defects",
      description: insights.dominantDefectReason
        ? `${insights.dominantDefectReason.count} of ${report.defects.total} defects`
        : "No classified defects",
    },

    {
      icon: <CircleAlert size={20} />,
      title: "High severity defects",
      value: severeDefects.toString(),
      description: `${insights.severity.blocker} blocker, ${insights.severity.critical} critical`,
    },

    {
      icon: <CheckCircle2 size={20} />,
      title: "Completed or waiting release",
      value: `${completedPercent}%`,
      description: `${completedTasks} of ${tasks.total} tasks`,
    },
    {
      icon: <Users size={20} />,
      title: "Highest defects count",
      value: maxDeveloperDefects.toString(),
      description: "Maximum defects assigned to one developer",
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Sprint highlights
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Key facts from the current sprint
          </p>
        </div>

        {warningCount > 0 && (
          <div className="text-sm text-slate-500">
            {warningCount} data warning
            {warningCount === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              {item.icon}

              <span className="text-sm font-medium">{item.title}</span>
            </div>

            <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              {item.value}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
