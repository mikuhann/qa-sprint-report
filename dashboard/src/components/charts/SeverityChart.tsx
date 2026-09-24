import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";

import type { SprintReport } from "../../types/report";

interface SeverityChartProps {
  severity: SprintReport["severity"];
  links: SprintReport["links"]["severity"];
}

export function SeverityChart({ severity, links }: SeverityChartProps) {
  const data = [
    {
      name: "Блокер",
      value: severity.blocker,
      url: links.blocker,
      fill: "#ef4444",
    },
    {
      name: "Критический",
      value: severity.critical,
      url: links.critical,
      fill: "#f97316",
    },
    {
      name: "Серьезный",
      value: severity.major,
      url: links.major,
      fill: "#f59e0b",
    },
    {
      name: "Незначительный",
      value: severity.minor,
      url: links.minor,
      fill: "#3b82f6",
    },
    {
      name: "Тривиальный",
      value: severity.trivial,
      url: links.trivial,
      fill: "#94a3b8",
    },
  ];

  const renderBar = (props: BarShapeProps) => {
    const item = data[props.index];

    return (
      <Rectangle
        {...props}
        fill={item?.fill ?? "#6366f1"}
        radius={[6, 6, 0, 0]}
        cursor={item?.url ? "pointer" : "default"}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={() => {
          if (!item?.url) {
            return;
          }

          window.open(item.url, "_blank", "noopener,noreferrer");
        }}
      />
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Критичность дефектов
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Распределение дефектов по приоритету
        </p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11 }}
            />

            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

            <Tooltip
              cursor={false}
              formatter={(value) => [value, "Дефектов"]}
            />

            <Bar dataKey="value" shape={renderBar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
