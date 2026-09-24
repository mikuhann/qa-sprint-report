import { Gauge, ShieldCheck } from "lucide-react";

import type { SprintReport } from "../types/report";

interface SprintSummaryProps {
  manual: SprintReport["manual"];
}

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

export function SprintSummary({ manual }: SprintSummaryProps) {
  const assessment = manual.qaAssessment
    ? ASSESSMENT_META[manual.qaAssessment]
    : null;

  if (manual.completionRate === null && !assessment) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Sprint summary</h2>

        <p className="mt-1 text-sm text-slate-500">
          Manual QA assessment of sprint results
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Gauge size={17} />
            Completion rate
          </div>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {manual.completionRate !== null
              ? `${manual.completionRate}%`
              : "Not set"}
          </div>

          <p className="mt-1 text-xs text-slate-400">Provided manually by QA</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={17} />
            QA assessment
          </div>

          <div className="mt-3">
            {assessment ? (
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${assessment.className}`}
              >
                {assessment.label}
              </span>
            ) : (
              <span className="text-2xl font-semibold text-slate-950">
                Not set
              </span>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Overall sprint quality assessment
          </p>
        </div>
      </div>
    </section>
  );
}
