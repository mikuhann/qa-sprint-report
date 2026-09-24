import { useEffect, useState } from "react";
import {
  Bug,
  CheckCircle2,
  ClipboardList,
  ListTodo,
  TriangleAlert,
  Settings,
  Download,
  LoaderCircle,
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

import { downloadReportPdf, loadReport, saveManualData } from "./api/report";
import type { SprintReport } from "./types/report";
import { UnresolvedIssues } from "./components/UnresolvedIssues";

function App() {
  const [report, setReport] = useState<SprintReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);

  useEffect(() => {
    loadReport()
      .then(setReport)
      .catch((error: unknown) => {
        setError(
          error instanceof Error ? error.message : "Не удалось загрузить отчёт",
        );
      });
  }, []);

  if (error) {
    return <div className="p-8">{error}</div>;
  }

  if (!report) {
    return <div className="p-8">Загрузка отчёта...</div>;
  }

  const warningItems = getReportWarnings(report.warnings);
  const warningGroups = groupReportWarnings(warningItems);

  const handleSaveManualData = async (data: SprintReport["manual"]) => {
    const updatedReport = await saveManualData(report.meta.sprintId, data);

    setReport(updatedReport);
    setSettingsOpen(false);
  };
  const handleExportPdf = async () => {
    try {
      setPdfExporting(true);

      await downloadReportPdf(report.meta.sprintId);
    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setPdfExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              QA-отчёт по спринту
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {report.meta.sprintName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {report.meta.sprintDates}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {warningGroups.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                <TriangleAlert size={16} />
                Проблем с данными: {warningGroups.length}
              </div>
            )}

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={pdfExporting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
            >
              {pdfExporting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Download size={17} />
              )}

              {pdfExporting ? "Формируем PDF..." : "Экспорт PDF"}
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Settings size={17} />
              Настройки отчёта
            </button>
          </div>
        </header>

        <SprintSummary manual={report.manual} />

        <div className="mt-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Обзор спринта
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Основные показатели текущего спринта
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Всего тикетов"
              value={report.tasks.total}
              icon={<ClipboardList size={20} />}
              href={report.links.tasks.total}
            />

            <StatCard
              label="Закрыто"
              value={report.tasks.closed}
              icon={<CheckCircle2 size={20} />}
              href={report.links.tasks.closed}
            />

            <StatCard
              label="На тестировании"
              value={report.tasks.testing}
              icon={<ListTodo size={20} />}
              href={report.links.tasks.testing}
            />

            <StatCard
              label="Дефекты за период"
              value={report.defects.total}
              icon={<Bug size={20} />}
              href={report.links.defects.total}
            />
          </div>
        </div>

        <div className="mt-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              План и состав спринта
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Цели спринта и распределение задач по типам
            </p>
          </div>

          <SprintGoals manual={report.manual} />

          <IssueBreakdown
            issueTypes={report.issueTypes}
            links={report.links.issueTypes}
          />
        </div>

        <div className="mt-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Ход спринта
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Текущее состояние задач и дополнительные показатели
            </p>
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

          <div
            className={
              report.releasedVersions.length
                ? "grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"
                : ""
            }
          >
            <UnresolvedIssues
              issues={report.unresolvedIssues}
              href={report.links.tasks.unresolved}
            />

            <ReleasedVersions versions={report.releasedVersions} />
          </div>
        </div>

        <div className="mt-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Качество спринта
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Анализ дефектов, критичности и результатов исправления
            </p>
          </div>

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
        </div>

        <div className="mt-10">
          <DataQuality groups={warningGroups} />
        </div>
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
