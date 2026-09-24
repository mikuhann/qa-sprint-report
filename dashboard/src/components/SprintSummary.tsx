import { Gauge, ShieldCheck } from "lucide-react";

import type { SprintReport } from "../types/report";

interface SprintSummaryProps {
  manual: SprintReport["manual"];
}

const ASSESSMENT_META = {
  good: {
    label: "Хорошо",
    className: "bg-emerald-100 text-emerald-700",
  },
  average: {
    label: "Средне",
    className: "bg-amber-100 text-amber-700",
  },
  poor: {
    label: "Плохо",
    className: "bg-red-100 text-red-700",
  },
} as const;

export function SprintSummary({ manual }: SprintSummaryProps) {
  const assessment = manual.qaAssessment
    ? ASSESSMENT_META[manual.qaAssessment]
    : null;

  if (manual.completionRate === null && !assessment) {
    return null;
  }

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
              <Gauge size={18} />
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">
                Выполнение плана
              </div>

              <div className="mt-0.5 text-xs text-slate-400">
                Указано QA вручную
              </div>
            </div>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-slate-950">
            {manual.completionRate !== null
              ? `${manual.completionRate}%`
              : "Не указано"}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
              <ShieldCheck size={18} />
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700">
                Оценка QA
              </div>

              <div className="mt-0.5 text-xs text-slate-400">
                Общая оценка качества спринта
              </div>
            </div>
          </div>

          {assessment ? (
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${assessment.className}`}
            >
              {assessment.label}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              Не указано
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
