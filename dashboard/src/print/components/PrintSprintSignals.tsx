import { Bug, History, RotateCcw } from "lucide-react";

import type { SprintReport } from "../../types/report";

interface PrintSprintSignalsProps {
  defectsOutsideSprint: SprintReport["defectsOutsideSprint"];
  carryOver: SprintReport["carryOver"];
  reopened: SprintReport["reopened"];
}

export function PrintSprintSignals({
  defectsOutsideSprint,
  carryOver,
  reopened,
}: PrintSprintSignalsProps) {
  const items = [
    {
      label: "Дефекты вне спринта",
      value: defectsOutsideSprint.total,
      icon: Bug,
    },
    {
      label: "Перенесено из прошлого",
      value: carryOver.total,
      icon: History,
    },
    {
      label: "Переоткрыто после QA",
      value: reopened.total,
      icon: RotateCcw,
    },
  ];

  return (
    <section className="pdf-avoid-break mt-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Дополнительные показатели
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Дополнительные сигналы по спринту
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <Icon size={17} />
                </div>

                <span className="text-sm text-slate-600">{item.label}</span>
              </div>

              <span className="text-xl font-semibold text-slate-950">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
