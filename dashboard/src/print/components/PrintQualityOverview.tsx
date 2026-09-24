import type { SprintReport } from "../../types/report";

interface PrintQualityOverviewProps {
  report: SprintReport;
}

export function PrintQualityOverview({ report }: PrintQualityOverviewProps) {
  const defectReasons = [
    {
      label: "Prod issue",
      value: report.defects.prodIssue,
      href: report.links.defects.prodIssue,
    },
    {
      label: "Common",
      value: report.defects.common,
      href: report.links.defects.common,
    },
    {
      label: "Requirements are not met",
      value: report.defects.requirementsNotMet,
      href: report.links.defects.requirementsNotMet,
    },
    {
      label: "Regression",
      value: report.defects.regression,
      href: report.links.defects.regression,
    },
    {
      label: "Requirements issue",
      value: report.defects.requirementsIssue,
      href: report.links.defects.requirementsIssue,
    },
    {
      label: "Missed issue",
      value: report.defects.missedIssue,
      href: report.links.defects.missedIssue,
    },
  ];

  const severity = [
    {
      label: "Blocker",
      value: report.severity.blocker,
      href: report.links.severity.blocker,
    },
    {
      label: "Critical",
      value: report.severity.critical,
      href: report.links.severity.critical,
    },
    {
      label: "Major",
      value: report.severity.major,
      href: report.links.severity.major,
    },
    {
      label: "Minor",
      value: report.severity.minor,
      href: report.links.severity.minor,
    },
    {
      label: "Trivial",
      value: report.severity.trivial,
      href: report.links.severity.trivial,
    },
  ];

  return (
    <div className="mt-5 space-y-6">
      <section className="pdf-avoid-break">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Причины дефектов
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Распределение по классификационным меткам
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-950">
              {report.defects.total}
            </div>

            <div className="text-xs text-slate-500">всего дефектов</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {defectReasons.map((item) => (
            <a
              key={item.label}
              href={item.href ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className="text-sm text-slate-600">{item.label}</span>

              <span className="text-xl font-semibold text-slate-950">
                {item.value}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="pdf-avoid-break">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Критичность дефектов
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Распределение по приоритету
          </p>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {severity.map((item) => (
            <a
              key={item.label}
              href={item.href ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center"
            >
              <div className="text-2xl font-semibold text-slate-950">
                {item.value}
              </div>

              <div className="mt-1 text-xs text-slate-500">{item.label}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
