import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SprintReport } from "../../types/report";

interface DefectsByDeveloperChartProps {
  developers: SprintReport["defectsByDeveloper"];
}

export function DefectsByDeveloperChart({
  developers,
}: DefectsByDeveloperChartProps) {
  const assignedDevelopers = developers.filter(
    (developer) => developer.accountId !== null,
  );

  const maxDefects = Math.max(
    0,
    ...assignedDevelopers.map((developer) => developer.defects),
  );

  const data = developers.map((developer) => {
    const isLeader =
      developer.accountId !== null &&
      developer.defects === maxDefects &&
      maxDefects > 0;

    return {
      name: isLeader ? `👑 ${developer.name}` : developer.name,
      defects: developer.defects,
    };
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Defects by developer
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Assigned defects during the sprint
        </p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: 20,
              bottom: 0,
              left: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />

            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={145}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar dataKey="defects" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
