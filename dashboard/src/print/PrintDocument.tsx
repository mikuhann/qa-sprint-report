import { Bug, CheckCircle2, ClipboardList, ListTodo } from "lucide-react";

import { IssueBreakdown } from "../components/IssueBreakdown";
import { SprintSummary } from "../components/SprintSummary";
import { StatCard } from "../components/StatCard";

import type { SprintReport } from "../types/report";
import { PrintSprintProgress } from "./components/PrintSprintProgress";
import { PrintSprintSignals } from "./components/PrintSprintSignals";
import { PrintSprintGoals } from "./components/PrintSprintGoals";

interface PrintDocumentProps {
  report: SprintReport;
}

export function PrintDocument({ report }: PrintDocumentProps) {
  return (
    <main className="bg-white text-slate-950">
      <section className="pdf-page pdf-page-break px-8 py-7">
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
            QA-отчёт по спринту
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {report.meta.sprintName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {report.meta.sprintDates}
          </p>
        </header>

        <SprintSummary manual={report.manual} />

        <div className="mt-7">
          <div>
            <h2 className="text-xl font-semibold">Обзор спринта</h2>

            <p className="mt-1 text-sm text-slate-500">
              Основные показатели текущего спринта
            </p>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
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

        <div className="mt-7">
          <IssueBreakdown
            issueTypes={report.issueTypes}
            links={report.links.issueTypes}
          />
        </div>
      </section>

      <section className="pdf-goals-section px-8 py-7">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Цели спринта
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Цели Backend, Frontend и QA
          </p>
        </div>

        <PrintSprintGoals manual={report.manual} />
      </section>

      <section className="pdf-page px-8 py-7">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Ход спринта</h2>

          <p className="mt-1 text-sm text-slate-500">
            Текущее состояние задач и дополнительные показатели
          </p>
        </div>

        {report.manual.comment && (
          <section className="pdf-avoid-break mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-800">
              Комментарий QA
            </div>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              {report.manual.comment}
            </p>
          </section>
        )}
        <PrintSprintProgress tasks={report.tasks} />

        <PrintSprintSignals
          defectsOutsideSprint={report.defectsOutsideSprint}
          carryOver={report.carryOver}
          reopened={report.reopened}
        />
      </section>
    </main>
  );
}
