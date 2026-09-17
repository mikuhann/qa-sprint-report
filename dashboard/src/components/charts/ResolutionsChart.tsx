import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { SprintReport } from "../../types/report";

interface ResolutionsChartProps {
  resolutions: SprintReport["resolutions"];
}

const COLORS = [
  "#10b981",
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
  "#ec4899",
  "#14b8a6",
];

export function ResolutionsChart({ resolutions }: ResolutionsChartProps) {
  const data = [
    {
      name: "Ready",
      value: resolutions.ready,
    },
    {
      name: "Fixed",
      value: resolutions.fixed,
    },
    {
      name: "Resolved in task",
      value: resolutions.resolvedInTask,
    },
    {
      name: "Not a bug",
      value: resolutions.notBug,
    },
    {
      name: "Cannot reproduce",
      value: resolutions.cannotReproduce,
    },
    {
      name: "Duplicate",
      value: resolutions.duplicate,
    },
    {
      name: "Won't fix",
      value: resolutions.wontFix,
    },
    {
      name: "Not relevant",
      value: resolutions.notRelevant,
    },
    {
      name: "Needs rewording",
      value: resolutions.needsRewording,
    },
  ].filter((item) => item.value > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Resolutions</h2>

        <p className="mt-1 text-sm text-slate-500">Resolution distribution</p>
      </div>

      <div className="relative mt-6 h-80">
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

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-slate-950">
              {resolutions.total}
            </div>

            <div className="text-xs text-slate-500">total</div>
          </div>
        </div>
      </div>
    </section>
  );
}
