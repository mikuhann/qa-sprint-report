import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { SprintReport } from "../../types/report";

interface DefectsByReasonChartProps {
  defects: SprintReport["defects"];
}

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
];

export function DefectsByReasonChart({ defects }: DefectsByReasonChartProps) {
  const data = [
    {
      name: "Production",
      value: defects.prodIssue,
    },
    {
      name: "Requirements not met",
      value: defects.requirementsNotMet,
    },
    {
      name: "Requirements issue",
      value: defects.requirementsIssue,
    },
    {
      name: "Missed issue",
      value: defects.missedIssue,
    },
    {
      name: "Common",
      value: defects.common,
    },
    {
      name: "Regression",
      value: defects.regression,
    },
  ].filter((item) => item.value > 0);

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
              paddingAngle={2}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center">
        <div className="text-2xl font-semibold text-slate-950">
          {defects.total}
        </div>

        <div className="text-sm text-slate-500">total defects</div>
      </div>
    </section>
  );
}
