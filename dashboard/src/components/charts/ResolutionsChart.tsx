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

interface ResolutionsChartProps {
  resolutions: SprintReport["resolutions"];
  links: SprintReport["links"]["resolutions"];
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

export function ResolutionsChart({
  resolutions,
  links,
}: ResolutionsChartProps) {
  const data = [
    {
      name: "Готово",
      value: resolutions.ready,
      url: links.ready,
    },
    {
      name: "Исправлено",
      value: resolutions.fixed,
      url: links.fixed,
    },
    {
      name: "Решено в задаче",
      value: resolutions.resolvedInTask,
      url: links.resolvedInTask,
    },
    {
      name: "Не является багом",
      value: resolutions.notBug,
      url: links.notBug,
    },
    {
      name: "Не воспроизводится",
      value: resolutions.cannotReproduce,
      url: links.cannotReproduce,
    },
    {
      name: "Дубликат",
      value: resolutions.duplicate,
      url: links.duplicate,
    },
    {
      name: "Не будет исправляться",
      value: resolutions.wontFix,
      url: links.wontFix,
    },
    {
      name: "Не актуально",
      value: resolutions.notRelevant,
      url: links.notRelevant,
    },
    {
      name: "Требует переформулировки",
      value: resolutions.needsRewording,
      url: links.needsRewording,
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
        <h2 className="text-lg font-semibold text-slate-950">Резолюции</h2>

        <p className="mt-1 text-sm text-slate-500">
          Распределение завершённых тикетов по резолюциям
        </p>
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
              paddingAngle={0}
              shape={renderSector}
            />

            <Tooltip formatter={(value) => [value, "Тикетов"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {links.total ? (
            <a
              href={links.total}
              target="_blank"
              rel="noreferrer"
              title="Открыть завершённые тикеты в Jira"
              className="pointer-events-auto rounded-lg px-3 py-2 text-center transition hover:bg-slate-50"
            >
              <div className="text-2xl font-semibold text-slate-950">
                {resolutions.total}
              </div>

              <div className="text-xs text-slate-500">всего</div>
            </a>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-950">
                {resolutions.total}
              </div>

              <div className="text-xs text-slate-500">всего</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
