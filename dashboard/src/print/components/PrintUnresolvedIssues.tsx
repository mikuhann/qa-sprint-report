import { getPriorityConfig } from "../../constants/priorities";
import { ExternalLink } from "lucide-react";

import type { SprintReport } from "../../types/report";

interface PrintUnresolvedIssuesProps {
  issues: SprintReport["unresolvedIssues"];
  href: string | null;
}

export function PrintUnresolvedIssues({
  issues,
  href,
}: PrintUnresolvedIssuesProps) {
  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL;

  const sortedIssues = [...issues].sort((a, b) => {
    const aOrder = getPriorityConfig(a.priority)?.order ?? 999;
    const bOrder = getPriorityConfig(b.priority)?.order ?? 999;

    return aOrder - bOrder;
  });

  if (!sortedIssues.length) {
    return (
      <section className="pdf-avoid-break mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="font-medium text-emerald-900">
          Незавершённых задач нет
        </div>

        <div className="mt-1 text-sm text-emerald-700">
          Все тикеты спринта завершены
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5">
      <div className="pdf-avoid-break flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">
              Незавершённые задачи
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {sortedIssues.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Тикеты, по которым ещё требуется работа
          </p>
        </div>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-blue-600"
          >
            Открыть все в Jira
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <table className="pdf-unresolved-table mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-200 bg-slate-50 text-left">
            <th className="w-30 px-3 py-2 text-xs font-medium text-slate-500">
              Тикет
            </th>

            <th className="px-3 py-2 text-xs font-medium text-slate-500">
              Название
            </th>

            <th className="w-37.5 px-3 py-2 text-xs font-medium text-slate-500">
              Статус
            </th>

            <th className="w-35 px-3 py-2 text-xs font-medium text-slate-500">
              Приоритет
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedIssues.map((issue) => {
            const priority = getPriorityConfig(issue.priority);

            return (
              <tr
                key={issue.key}
                className="pdf-unresolved-row border-b border-slate-100"
              >
                <td className="px-3 py-2.5 align-top">
                  <a
                    href={`${jiraBaseUrl}/browse/${issue.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600"
                  >
                    {issue.key}
                  </a>
                </td>

                <td className="px-3 py-2.5 align-top">
                  <div className="text-sm font-medium leading-5 text-slate-900">
                    {issue.summary}
                  </div>

                  <div className="mt-0.5 text-xs text-slate-400">
                    {issue.issueType}
                  </div>
                </td>

                <td className="px-3 py-2.5 align-top">
                  <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {issue.status}
                  </span>
                </td>

                <td className="px-3 py-2.5 align-top">
                  <span
                    className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium ${
                      priority?.className ?? "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {priority?.label ?? "Без приоритета"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
