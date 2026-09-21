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

interface DefectsByDeveloperChartProps {
  developers: SprintReport["defectsByDeveloper"];
  links: SprintReport["links"]["defectsByDeveloper"];
}

export function DefectsByDeveloperChart({
  developers,
  links,
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

    const link = links.find(
      (item) =>
        item.accountId === developer.accountId &&
        (developer.accountId !== null || item.name === developer.name),
    );

    return {
      name: isLeader ? `👑 ${developer.name}` : developer.name,
      defects: developer.defects,
      url: link?.url ?? null,
    };
  });

  const renderBar = (props: BarShapeProps) => {
    const item = data[props.index];

    return (
      <Rectangle
        {...props}
        fill="#6366f1"
        radius={[0, 6, 6, 0]}
        cursor={item?.url ? "pointer" : "default"}
        style={{
          transition: "filter 150ms ease",
        }}
        onMouseEnter={(event) => {
          if (item?.url) {
            event.currentTarget.style.filter = "brightness(0.82)";
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.filter = "brightness(1)";
        }}
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

            <Tooltip cursor={false} />

            <Bar dataKey="defects" shape={renderBar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
