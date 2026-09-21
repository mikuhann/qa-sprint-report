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
        <h2 className="text-lg font-semibold text-slate-950">Sprint signals</h2>

        <p className="mt-1 text-sm text-slate-500">
          Additional indicators affecting sprint quality
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Defects outside sprint"
          value={defectsOutsideSprint.total}
          description="Defects created during the sprint but not included in it"
          icon={<Bug size={20} />}
          href={links.defectsOutsideSprint}
        />

        <StatCard
          label="Carry over"
          value={carryOver.total}
          description="Issues carried over from the previous sprint"
          icon={<History size={20} />}
          href={links.carryOver}
        />

        <StatCard
          label="Reopened after testing"
          value={reopened.total}
          description="Issues returned to work after testing"
          icon={<RotateCcw size={20} />}
          href={links.reopened}
        />
      </div>
    </section>
  );
}
