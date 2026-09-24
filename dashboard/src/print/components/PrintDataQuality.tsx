import { AlertTriangle, CircleCheck, ExternalLink } from "lucide-react";

import type { SprintReport } from "../../types/report";

import {
  getReportWarnings,
  groupReportWarnings,
} from "../../utils/reportWarnings";

interface PrintDataQualityProps {
  warnings: SprintReport["warnings"];
}

export function PrintDataQuality({ warnings }: PrintDataQualityProps) {
  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL;

  const items = getReportWarnings(warnings);
  const groups = groupReportWarnings(items);

  if (!groups.length) {
    return (
      <section className="pdf-avoid-break mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
          <CircleCheck size={18} />
        </div>

        <div>
          <div className="text-sm font-semibold text-emerald-900">
            Проблем с данными не найдено
          </div>

          <div className="mt-0.5 text-sm text-emerald-700">
            Все данные отчёта прошли проверки
          </div>
        </div>
      </section>
    );
  }

  const warningsCount = groups.reduce(
    (total, group) => total + group.warnings.length,
    0,
  );

  return (
    <div className="mt-5">
      <section className="pdf-avoid-break flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
            <AlertTriangle size={18} />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">
              Найдены проблемы с данными
            </div>

            <div className="mt-0.5 text-sm text-slate-600">
              Требуется проверить данные в Jira
            </div>
          </div>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <div className="text-xl font-semibold text-slate-950">
              {groups.length}
            </div>

            <div className="text-xs text-slate-500">тикетов</div>
          </div>

          <div>
            <div className="text-xl font-semibold text-slate-950">
              {warningsCount}
            </div>

            <div className="text-xs text-slate-500">предупреждений</div>
          </div>
        </div>
      </section>

      <div className="mt-4 divide-y divide-slate-100">
        {groups.map((group) => (
          <section
            key={group.key}
            className="pdf-warning-item flex items-start justify-between gap-5 py-3"
          >
            <div>
              <a
                href={`${jiraBaseUrl}/browse/${group.key}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600"
              >
                {group.key}
              </a>

              <div className="mt-1.5 space-y-1">
                {group.warnings.map((warning) => (
                  <div
                    key={warning.type}
                    className="text-sm leading-5 text-slate-600"
                  >
                    {warning.message}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`${jiraBaseUrl}/browse/${group.key}`}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400"
            >
              Jira
              <ExternalLink size={12} />
            </a>
          </section>
        ))}
      </div>
    </div>
  );
}
