import { useEffect, useState } from "react";
import { Bug, CheckCircle2, ClipboardList, TriangleAlert } from "lucide-react";

import { StatCard } from "./components/StatCard";
import { SprintProgress } from "./components/SprintProgress";
import { DefectsByReasonChart } from "./components/charts/DefectsByReasonChart";
import { SeverityChart } from "./components/charts/SeverityChart";
import { DefectsByDeveloperChart } from "./components/charts/DefectsByDeveloperChart";
import { ResolutionsChart } from "./components/charts/ResolutionsChart";
import { DataQuality } from "./components/DataQuality";
import { IssueBreakdown } from "./components/IssueBreakdown";
import { SprintSignals } from "./components/SprintSignals";

import { loadReport } from "./api/report";
import type { SprintReport } from "./types/report";

function App() {
  const [report, setReport] = useState<SprintReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport()
      .then(setReport)
      .catch((error: unknown) => {
        setError(
          error instanceof Error ? error.message : "Failed to load report",
        );
      });
  }, []);

  if (error) {
    return <div className="p-8">{error}</div>;
  }

  if (!report) {
    return <div className="p-8">Loading report...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
            QA Sprint Report
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {report.meta.sprintName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {report.meta.sprintDates}
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tasks"
            value={report.tasks.total}
            icon={<ClipboardList size={20} />}
            href={report.links.tasks.total}
          />

          <StatCard
            label="Defects"
            value={report.defects.total}
            icon={<Bug size={20} />}
            href={report.links.defects.total}
          />

          <StatCard
            label="Resolutions"
            value={report.resolutions.total}
            icon={<CheckCircle2 size={20} />}
            href={report.links.resolutions.total}
          />

          <StatCard
            label="Data warnings"
            value={
              report.warnings.unclassifiedDefects.length +
              report.warnings.unassignedDefects.length +
              report.warnings.multipleClassifications.length
            }
            icon={<TriangleAlert size={20} />}
          />
        </div>
        <SprintProgress
          total={report.tasks.total}
          unresolved={report.tasks.unresolved}
          testing={report.tasks.testing}
          waitingRelease={report.tasks.waitingRelease}
          closed={report.tasks.closed}
          blocked={report.tasks.blocked}
          links={report.links.tasks}
        />

        <IssueBreakdown
          issueTypes={report.issueTypes}
          links={report.links.issueTypes}
        />

        <SprintSignals
          defectsOutsideSprint={report.defectsOutsideSprint}
          carryOver={report.carryOver}
          reopened={report.reopened}
          links={{
            defectsOutsideSprint: report.links.defectsOutsideSprint,
            carryOver: report.links.carryOver,
            reopened: report.links.reopened,
          }}
        />

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <DefectsByReasonChart
            defects={report.defects}
            links={report.links.defects}
          />

          <SeverityChart
            severity={report.severity}
            links={report.links.severity}
          />
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <ResolutionsChart
            resolutions={report.resolutions}
            links={report.links.resolutions}
          />

          <DefectsByDeveloperChart
            developers={report.defectsByDeveloper}
            links={report.links.defectsByDeveloper}
          />
        </section>
        <DataQuality warnings={report.warnings} />
      </div>
    </main>
  );
}

export default App;
