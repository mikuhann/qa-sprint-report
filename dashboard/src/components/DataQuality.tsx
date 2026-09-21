import { AlertTriangle, ExternalLink } from "lucide-react";

import type { ReportWarningGroup } from "../utils/reportWarnings";

interface DataQualityProps {
  groups: ReportWarningGroup[];
}

export function DataQuality({ groups }: DataQualityProps) {
  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL;

  if (!groups.length) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-semibold text-emerald-900">Data quality</h2>

        <p className="mt-1 text-sm text-emerald-700">No data issues found</p>
      </section>
    );
  }

  const warningsCount = groups.reduce(
    (total, group) => total + group.warnings.length,
    0,
  );

  return (
    <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
          <AlertTriangle size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">Data quality</h2>

          <p className="mt-1 text-sm text-slate-600">
            {groups.length} issue
            {groups.length === 1 ? "" : "s"} require attention
            {" · "}
            {warningsCount} warning
            {warningsCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-amber-200">
        {groups.map((group) => (
          <div
            key={group.key}
            className="flex items-start justify-between gap-4 py-4"
          >
            <div>
              <div className="font-medium text-slate-900">{group.key}</div>

              <div className="mt-2 space-y-1">
                {group.warnings.map((warning) => (
                  <div key={warning.type} className="text-sm text-slate-600">
                    {warning.message}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`${jiraBaseUrl}/browse/${group.key}`}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-950"
            >
              Jira
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
