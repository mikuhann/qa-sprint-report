import { BookOpen, Bug, ClipboardList, Layers3 } from "lucide-react";

import type { SprintReport } from "../types/report";

interface IssueBreakdownProps {
  issueTypes: SprintReport["issueTypes"];
}

export function IssueBreakdown({ issueTypes }: IssueBreakdownProps) {
  const items = [
    {
      label: "Stories",
      value: issueTypes.stories,
      icon: BookOpen,
    },
    {
      label: "Tasks",
      value: issueTypes.tasks,
      icon: ClipboardList,
    },
    {
      label: "Bugs",
      value: issueTypes.bugs,
      icon: Bug,
    },
    {
      label: "Other",
      value: issueTypes.other,
      icon: Layers3,
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Issue breakdown
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of {issueTypes.total} sprint issues by type
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          const percent = issueTypes.total
            ? (item.value / issueTypes.total) * 100
            : 0;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
            >
              <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">{item.label}</span>

                  <span className="text-lg font-semibold text-slate-950">
                    {item.value}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {percent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
