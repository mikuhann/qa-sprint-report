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
      name: "Blocker",
      value: severity.blocker,
      url: links.blocker,
    },
    {
      name: "Critical",
      value: severity.critical,
      url: links.critical,
    },
    {
      name: "Major",
      value: severity.major,
      url: links.major,
    },
    {
      name: "Minor",
      value: severity.minor,
      url: links.minor,
    },
    {
      name: "Trivial",
      value: severity.trivial,
      url: links.trivial,
    },
  ];

  const renderBar = (props: BarShapeProps) => {
    const item = data[props.index];

    return (
      <Rectangle
        {...props}
        fill="#6366f1"
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
        <h2 className="text-lg font-semibold text-slate-950">Severity</h2>

        <p className="mt-1 text-sm text-slate-500">Defects by priority</p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" tickLine={false} axisLine={false} />

            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

            <Tooltip cursor={false} />

            <Bar dataKey="value" shape={renderBar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
