import { Bug, History, RotateCcw } from "lucide-react";

import type { SprintReport } from "../types/report";
import { StatCard } from "./StatCard";

interface SprintSignalsProps {
  defectsOutsideSprint: SprintReport["defectsOutsideSprint"];
  carryOver: SprintReport["carryOver"];
  reopened: SprintReport["reopened"];
  links: {
    defectsOutsideSprint: string | null;
    carryOver: string | null;
    reopened: string | null;
  };
}

export function SprintSignals({
  defectsOutsideSprint,
  carryOver,
  reopened,
  links,
}: SprintSignalsProps) {
  return (
    <section className="mt-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">
          Дополнительные показатели
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Дополнительные сигналы о ходе и качестве спринта
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Дефекты вне спринта"
          value={defectsOutsideSprint.total}
          description="Дефекты созданы во время спринта, но не добавлены в него"
          icon={<Bug size={20} />}
          href={links.defectsOutsideSprint}
        />

        <StatCard
          label="Перенесено из прошлого спринта"
          value={carryOver.total}
          description="Тикеты, перешедшие из предыдущего спринта"
          icon={<History size={20} />}
          href={links.carryOver}
        />

        <StatCard
          label="Переоткрыто после тестирования"
          value={reopened.total}
          description="Тикеты, возвращённые в работу после тестирования"
          icon={<RotateCcw size={20} />}
          href={links.reopened}
        />
      </div>
    </section>
  );
}
