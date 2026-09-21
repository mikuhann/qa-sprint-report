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
      name: "Production",
      value: defects.prodIssue,
      url: links.prodIssue,
    },
    {
      name: "Requirements not met",
      value: defects.requirementsNotMet,
      url: links.requirementsNotMet,
    },
    {
      name: "Requirements issue",
      value: defects.requirementsIssue,
      url: links.requirementsIssue,
    },
    {
      name: "Missed issue",
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
          filter: props.isActive ? "brightness(0.95)" : "brightness(1)",
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
          Defects by reason
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of classified defects
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
            <Tooltip />
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
            title="Open all defects in Jira"
            className="inline-block rounded-lg px-3 py-1 transition hover:bg-slate-50"
          >
            <div className="text-2xl font-semibold text-slate-950">
              {defects.total}
            </div>

            <div className="text-sm text-slate-500">total defects</div>
          </a>
        ) : (
          <>
            <div className="text-2xl font-semibold text-slate-950">
              {defects.total}
            </div>

            <div className="text-sm text-slate-500">total defects</div>
          </>
        )}
      </div>
    </section>
  );
}
