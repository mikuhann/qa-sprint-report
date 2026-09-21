import {
  CheckCircle2,
  CircleDot,
  Monitor,
  Server,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type { SprintReport } from "../types/report";

interface SprintGoalsProps {
  manual: SprintReport["manual"];
}

const STATUS_META = {
  planned: {
    label: "Planned",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    icon: CircleDot,
  },
  done: {
    label: "Done",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  moved: {
    label: "Moved",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: CircleDot,
  },
  failed: {
    label: "Failed",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
} as const;

const ASSESSMENT_META = {
  good: {
    label: "Good",
    className: "bg-emerald-100 text-emerald-700",
  },
  average: {
    label: "Average",
    className: "bg-amber-100 text-amber-700",
  },
  poor: {
    label: "Poor",
    className: "bg-red-100 text-red-700",
  },
} as const;

export function SprintGoals({ manual }: SprintGoalsProps) {
  const groups = [
    {
      key: "backend",
      title: "Backend",
      icon: Server,
      goals: manual.goals.backend,
    },
    {
      key: "frontend",
      title: "Frontend",
      icon: Monitor,
      goals: manual.goals.frontend,
    },
    {
      key: "qa",
      title: "QA",
      icon: ShieldCheck,
      goals: manual.goals.qa,
    },
  ];

  const hasGoals = groups.some((group) => group.goals.length > 0);

  const assessment = manual.qaAssessment
    ? ASSESSMENT_META[manual.qaAssessment]
    : null;

  if (!hasGoals && !assessment && !manual.comment) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Sprint goals</h2>

          <p className="mt-1 text-sm text-slate-500">
            Goals and QA assessment for the sprint
          </p>
        </div>

        {assessment && (
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${assessment.className}`}
          >
            QA assessment: {assessment.label}
          </div>
        )}
      </div>

      {hasGoals && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {groups.map((group) => {
            const Icon = group.icon;

            return (
              <div key={group.key} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
                    <Icon size={18} />
                  </div>

                  <h3 className="font-medium text-slate-900">{group.title}</h3>
                </div>

                {group.goals.length ? (
                  <div className="mt-4 space-y-3">
                    {group.goals.map((goal, index) => {
                      const status = STATUS_META[goal.status];

                      const StatusIcon = status.icon;

                      return (
                        <div
                          key={`${group.key}-${index}`}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <div className="text-sm text-slate-800">
                            {goal.text}
                          </div>

                          <div
                            className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${status.className}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">No goals</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {manual.comment && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <div className="text-sm font-medium text-slate-700">Comment</div>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {manual.comment}
          </p>
        </div>
      )}
    </section>
  );
}
