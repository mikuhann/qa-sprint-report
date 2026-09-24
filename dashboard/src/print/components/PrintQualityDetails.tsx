import { Crown } from "lucide-react";

import type { SprintReport } from "../../types/report";

interface PrintQualityDetailsProps {
  report: SprintReport;
}

export function PrintQualityDetails({ report }: PrintQualityDetailsProps) {
  const resolutions = [
    {
      label: "Готово",
      value: report.resolutions.ready,
      href: report.links.resolutions.ready,
    },
    {
      label: "Исправлено",
      value: report.resolutions.fixed,
      href: report.links.resolutions.fixed,
    },
    {
      label: "Решено в задаче",
      value: report.resolutions.resolvedInTask,
      href: report.links.resolutions.resolvedInTask,
    },
    {
      label: "Не является багом",
      value: report.resolutions.notBug,
      href: report.links.resolutions.notBug,
    },
    {
      label: "Не воспроизводится",
      value: report.resolutions.cannotReproduce,
      href: report.links.resolutions.cannotReproduce,
    },
    {
      label: "Дубликат",
      value: report.resolutions.duplicate,
      href: report.links.resolutions.duplicate,
    },
    {
      label: "Не будет исправляться",
      value: report.resolutions.wontFix,
      href: report.links.resolutions.wontFix,
    },
    {
      label: "Не актуально",
      value: report.resolutions.notRelevant,
      href: report.links.resolutions.notRelevant,
    },
    {
      label: "Требует переформулировки",
      value: report.resolutions.needsRewording,
      href: report.links.resolutions.needsRewording,
    },
  ].filter((item) => item.value > 0);

  const assignedDevelopers = report.defectsByDeveloper.filter(
    (developer) => developer.accountId !== null,
  );

  const maxDefects = Math.max(
    0,
    ...assignedDevelopers.map((developer) => developer.defects),
  );

  const developers = [...report.defectsByDeveloper].sort(
    (a, b) => b.defects - a.defects,
  );

  return (
    <div className="mt-5 grid grid-cols-2 gap-5">
      <section className="pdf-avoid-break rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Резолюции</h2>

            <p className="mt-1 text-sm text-slate-500">
              Итоги завершённых тикетов
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-950">
              {report.resolutions.total}
            </div>

            <div className="text-xs text-slate-500">всего</div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {resolutions.map((item) => (
            <a
              key={item.label}
              href={item.href ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <span className="text-sm text-slate-600">{item.label}</span>

              <span className="text-base font-semibold text-slate-950">
                {item.value}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="pdf-avoid-break rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Дефекты по разработчикам
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Количество дефектов за период спринта
          </p>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {developers.map((developer) => {
            const isLeader =
              developer.accountId !== null &&
              developer.defects === maxDefects &&
              maxDefects > 0;

            const link = report.links.defectsByDeveloper.find(
              (item) =>
                item.accountId === developer.accountId &&
                (developer.accountId !== null || item.name === developer.name),
            );

            return (
              <a
                key={`${developer.accountId ?? "unassigned"}-${developer.name}`}
                href={link?.url ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  {isLeader && (
                    <Crown size={16} className="shrink-0 text-amber-500" />
                  )}

                  <span
                    className={`truncate text-sm ${
                      isLeader
                        ? "font-semibold text-slate-950"
                        : "text-slate-600"
                    }`}
                  >
                    {developer.name}
                  </span>
                </div>

                <span
                  className={`text-base font-semibold ${
                    isLeader ? "text-amber-600" : "text-slate-950"
                  }`}
                >
                  {developer.defects}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
