import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieSectorShapeProps,
} from "recharts";

import type { SprintReport } from "../../types/report";

interface DefectsByReasonChartProps {
  defects: SprintReport["defects"];
  links: SprintReport["links"]["defects"];
}

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
];

export function DefectsByReasonChart({
  defects,
  links,
}: DefectsByReasonChartProps) {
  const data = [
    {
      name: "prod_issue",
      value: defects.prodIssue,
      url: links.prodIssue,
    },
    {
      name: "Requirements_are_not_met",
      value: defects.requirementsNotMet,
      url: links.requirementsNotMet,
    },
    {
      name: "Requirements_issue",
      value: defects.requirementsIssue,
      url: links.requirementsIssue,
    },
    {
      name: "missed_issue",
      value: defects.missedIssue,
      url: links.missedIssue,
    },
    {
      name: "Common",
      value: defects.common,
      url: links.common,
    },
    {
      name: "Regression",
      value: defects.regression,
      url: links.regression,
    },
  ]
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));

  const renderSector = (props: PieSectorShapeProps) => {
    const item = data[props.index];

    return (
      <Sector
        {...props}
        fill={item?.fill}
        stroke="#ffffff"
        strokeWidth={4}
        style={{
          filter: props.isActive ? "brightness(0.9)" : "brightness(1)",
          transition: "filter 150ms ease",
          cursor: item?.url ? "pointer" : "default",
        }}
      />
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Причины дефектов
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Распределение дефектов по классификационным меткам
        </p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={0}
              shape={renderSector}
              onClick={(_, index) => {
                const item = data[index];

                if (!item?.url) {
                  return;
                }

                window.open(item.url, "_blank", "noopener,noreferrer");
              }}
            />
            <Tooltip formatter={(value) => [value, "Дефектов"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center">
        {links.total ? (
          <a
            href={links.total}
            target="_blank"
            rel="noreferrer"
            title="Открыть все дефекты в Jira"
            className="inline-block rounded-lg px-3 py-1 transition hover:bg-slate-50"
          >
            <div className="text-2xl font-semibold text-slate-950">
              {defects.total}
            </div>

            <div className="text-sm text-slate-500">всего дефектов</div>
          </a>
        ) : (
          <>
            <div className="text-2xl font-semibold text-slate-950">
              {defects.total}
            </div>

            <div className="text-sm text-slate-500">всего дефектов</div>
          </>
        )}
      </div>
    </section>
  );
}
