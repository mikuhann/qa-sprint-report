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
        const [firstGoal, ...restGoals] = group.goals;

        const renderGoal = (
          goal: (typeof group.goals)[number],
          index: number,
        ) => {
          const status = STATUS_META[goal.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={`${group.key}-${index}`}
              className="pdf-goal-item flex items-center justify-between gap-5 border-b border-slate-100 px-2 py-2.5 last:border-b-0"
            >
              <div className="text-sm leading-5 text-slate-800">
                {goal.text}
              </div>

              <div
                className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
              >
                <StatusIcon size={12} />
                {status.label}
              </div>
            </div>
          );
        };

        return (
          <section key={group.key} className="pdf-goal-group">
            <div className="pdf-goal-group-start">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
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

              {firstGoal ? (
                <div className="mt-2">{renderGoal(firstGoal, 0)}</div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">Цели не указаны</p>
              )}
            </div>

            {restGoals.length > 0 && (
              <div>
                {restGoals.map((goal, index) => renderGoal(goal, index + 1))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
