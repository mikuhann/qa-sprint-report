import { AlertTriangle, ExternalLink } from "lucide-react";

import type { SprintReport } from "../types/report";

interface DataQualityProps {
  warnings: SprintReport["warnings"];
}

interface WarningItem {
  key: string;
  message: string;
}

export function DataQuality({ warnings }: DataQualityProps) {
  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL;

  const items: WarningItem[] = [
    ...warnings.unclassifiedDefects.map((key) => ({
      key,
      message: "Defect has no classification",
    })),

    ...warnings.multipleClassifications.map((key) => ({
      key,
      message: "Defect has multiple classifications",
    })),

    ...warnings.unassignedDefects.map((key) => ({
      key,
      message: "Defect has no assignee",
    })),

    ...warnings.missingResolutions.map((key) => ({
      key,
      message: "Resolution is missing",
    })),

    ...warnings.unknownResolutions.map(({ key, value }) => ({
      key,
      message: `Unknown resolution: ${value}`,
    })),

    ...warnings.missingSeverity.map((key) => ({
      key,
      message: "Severity is missing",
    })),

    ...warnings.unknownSeverity.map(({ key, value }) => ({
      key,
      message: `Unknown severity: ${value}`,
    })),
  ];

  if (!items.length) {
    return (
      <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-semibold text-emerald-900">Data quality</h2>

        <p className="mt-1 text-sm text-emerald-700">No data issues found</p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
          <AlertTriangle size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">Data quality</h2>

          <p className="mt-1 text-sm text-slate-600">
            {items.length} issue{items.length === 1 ? "" : "s"} require
            attention
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-amber-200">
        {items.map((item) => (
          <div
            key={`${item.key}-${item.message}`}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div>
              <div className="font-medium text-slate-900">{item.key}</div>

              <div className="mt-0.5 text-sm text-slate-600">
                {item.message}
              </div>
            </div>

            <a
              href={`${jiraBaseUrl}/browse/${item.key}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-950"
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
