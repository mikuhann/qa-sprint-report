import { useEffect, useState } from "react";
import {
  Bug,
  CheckCircle2,
  ClipboardList,
  TriangleAlert,
  Settings,
} from "lucide-react";

import { StatCard } from "./components/StatCard";
import { SprintProgress } from "./components/SprintProgress";
import { DefectsByReasonChart } from "./components/charts/DefectsByReasonChart";
import { SeverityChart } from "./components/charts/SeverityChart";
import { DefectsByDeveloperChart } from "./components/charts/DefectsByDeveloperChart";
import { ResolutionsChart } from "./components/charts/ResolutionsChart";
import { DataQuality } from "./components/DataQuality";
import { IssueBreakdown } from "./components/IssueBreakdown";
import { SprintSignals } from "./components/SprintSignals";
import { ReleasedVersions } from "./components/ReleasedVersions";
import { getReportWarnings, groupReportWarnings } from "./utils/reportWarnings";
import { SprintGoals } from "./components/SprintGoals";
import { ReportSettingsDrawer } from "./components/ReportSettingsDrawer";
import { SprintSummary } from "./components/SprintSummary";

import { loadReport, saveManualData } from "./api/report";
import type { SprintReport } from "./types/report";

function App() {
  const [report, setReport] = useState<SprintReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const warningItems = getReportWarnings(report.warnings);
  const warningGroups = groupReportWarnings(warningItems);

  const handleSaveManualData = async (data: SprintReport["manual"]) => {
    const updatedReport = await saveManualData(report.meta.sprintId, data);

    setReport(updatedReport);
    setSettingsOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              QA Sprint Report
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {report.meta.sprintName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {report.meta.sprintDates}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Settings size={17} />
            Report settings
          </button>
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
            label="Data quality"
            value={warningGroups.length}
            description={`${warningItems.length} warnings`}
            icon={<TriangleAlert size={20} />}
          />
        </div>

        <SprintSummary manual={report.manual} />

        <SprintGoals manual={report.manual} />

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

        <ReleasedVersions versions={report.releasedVersions} />

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
        <DataQuality groups={warningGroups} />
      </div>
      {settingsOpen && (
        <ReportSettingsDrawer
          manual={report.manual}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveManualData}
        />
      )}
    </main>
  );
}

export default App;
