import {
  CheckCircle2,
  CircleDot,
  Monitor,
  Server,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type { SprintReport } from "../../types/report";

interface PrintSprintGoalsProps {
  manual: SprintReport["manual"];
}

const STATUS_META = {
  planned: {
    label: "Запланировано",
    className: "bg-slate-100 text-slate-600",
    icon: CircleDot,
  },
  done: {
    label: "Выполнено",
    className: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  moved: {
    label: "Перенесено",
    className: "bg-amber-100 text-amber-700",
    icon: CircleDot,
  },
  failed: {
    label: "Не выполнено",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
} as const;

export function PrintSprintGoals({ manual }: PrintSprintGoalsProps) {
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

  return (
    <div className="mt-5 space-y-5">
      {groups.map((group) => {
        const Icon = group.icon;

        return (
          <table
            key={group.key}
            className="pdf-goal-table w-full border-collapse"
          >
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="border-b border-slate-200 pb-2 text-left font-normal"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                      <Icon size={17} />
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">
                      {group.title}
                    </h3>

                    <span className="text-sm text-slate-400">
                      {group.goals.length}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {group.goals.length ? (
                group.goals.map((goal, index) => {
                  const status = STATUS_META[goal.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={`${group.key}-${index}`}
                      className="pdf-goal-row border-b border-slate-100 last:border-b-0"
                    >
                      <td className="py-2.5 pl-2 pr-5 text-sm leading-5 text-slate-800">
                        {goal.text}
                      </td>

                      <td className="w-1 whitespace-nowrap py-2.5 pr-2 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="pdf-goal-row">
                  <td colSpan={2} className="py-3 pl-2 text-sm text-slate-400">
                    Цели не указаны
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );
      })}
    </div>
  );
}
