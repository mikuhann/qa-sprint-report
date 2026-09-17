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

interface SeverityChartProps {
  severity: SprintReport["severity"];
}

export function SeverityChart({ severity }: SeverityChartProps) {
  const data = [
    {
      name: "Blocker",
      value: severity.blocker,
    },
    {
      name: "Critical",
      value: severity.critical,
    },
    {
      name: "Major",
      value: severity.major,
    },
    {
      name: "Minor",
      value: severity.minor,
    },
    {
      name: "Trivial",
      value: severity.trivial,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Severity</h2>

        <p className="mt-1 text-sm text-slate-500">Defects by priority</p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" tickLine={false} axisLine={false} />

            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

            <Tooltip />

            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
