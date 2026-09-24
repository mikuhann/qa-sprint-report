import { BookOpen, Bug, ClipboardList, Layers3 } from "lucide-react";

import type { SprintReport } from "../types/report";

interface IssueBreakdownProps {
  issueTypes: SprintReport["issueTypes"];
  links: SprintReport["links"]["issueTypes"];
}

export function IssueBreakdown({ issueTypes, links }: IssueBreakdownProps) {
  const items = [
    {
      label: "Истории",
      value: issueTypes.stories,
      icon: BookOpen,
      url: links.stories,
    },
    {
      label: "Задачи",
      value: issueTypes.tasks,
      icon: ClipboardList,
      url: links.tasks,
    },
    {
      label: "Баги",
      value: issueTypes.bugs,
      icon: Bug,
      url: links.bugs,
    },
    {
      label: "Другое",
      value: issueTypes.other,
      icon: Layers3,
      url: links.other,
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Состав спринта</h2>

        <p className="mt-1 text-sm text-slate-500">
          Распределение {issueTypes.total} тикетов по типам
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          const percent = issueTypes.total
            ? (item.value / issueTypes.total) * 100
            : 0;

          const content = (
            <>
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
            </>
          );

          if (!item.url) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
              >
                {content}
              </div>
            );
          }

          return (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={`Открыть «${item.label}» в Jira`}
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
