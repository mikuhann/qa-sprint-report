import { useState } from "react";
import { Monitor, Plus, Server, ShieldCheck, Trash2, X } from "lucide-react";

import type { SprintReport } from "../types/report";

interface ReportSettingsDrawerProps {
  manual: SprintReport["manual"];
  onClose: () => void;
  onSave: (data: SprintReport["manual"]) => Promise<void>;
}

type GoalGroup = keyof SprintReport["manual"]["goals"];

export function ReportSettingsDrawer({
  manual,
  onClose,
  onSave,
}: ReportSettingsDrawerProps) {
  const [draft, setDraft] = useState(manual);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const addGoal = (group: GoalGroup) => {
    setDraft((current) => ({
      ...current,
      goals: {
        ...current.goals,
        [group]: [
          ...current.goals[group],
          {
            text: "",
            status: "planned" as const,
          },
        ],
      },
    }));
  };

  const updateGoal = (
    group: GoalGroup,
    index: number,
    changes: Partial<SprintReport["manual"]["goals"][GoalGroup][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      goals: {
        ...current.goals,
        [group]: current.goals[group].map((goal, goalIndex) =>
          goalIndex === index
            ? {
                ...goal,
                ...changes,
              }
            : goal,
        ),
      },
    }));
  };

  const removeGoal = (group: GoalGroup, index: number) => {
    setDraft((current) => ({
      ...current,
      goals: {
        ...current.goals,
        [group]: current.goals[group].filter(
          (_, goalIndex) => goalIndex !== index,
        ),
      },
    }));
  };

  const hasInvalidCompletionRate =
    draft.completionRate !== null &&
    (!Number.isFinite(draft.completionRate) ||
      draft.completionRate < 0 ||
      draft.completionRate > 100);

  const hasEmptyGoals = Object.values(draft.goals)
    .flat()
    .some((goal) => !goal.text.trim());

  const handleSave = async () => {
    if (hasEmptyGoals || hasInvalidCompletionRate || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const normalized: SprintReport["manual"] = {
      ...draft,

      comment: draft.comment?.trim() || null,

      goals: {
        backend: draft.goals.backend.map((goal) => ({
          ...goal,
          text: goal.text.trim(),
        })),

        frontend: draft.goals.frontend.map((goal) => ({
          ...goal,
          text: goal.text.trim(),
        })),

        qa: draft.goals.qa.map((goal) => ({
          ...goal,
          text: goal.text.trim(),
        })),
      },
    };

    try {
      await onSave(normalized);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить настройки отчёта",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Закрыть настройки отчёта"
        disabled={isSaving}
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Настройки отчёта
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Цели спринта, выполнение плана и оценка QA
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="qa-assessment"
                className="text-sm font-medium text-slate-800"
              >
                Оценка QA
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Общая оценка качества спринта
              </p>

              <select
                id="qa-assessment"
                value={draft.qaAssessment ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  setDraft((current) => ({
                    ...current,
                    qaAssessment:
                      value === ""
                        ? null
                        : (value as SprintReport["manual"]["qaAssessment"]),
                  }));
                }}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Не указано</option>
                <option value="good">Хорошо</option>
                <option value="average">Средне</option>
                <option value="poor">Плохо</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="completion-rate"
                className="text-sm font-medium text-slate-800"
              >
                Выполнение плана
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Процент выполнения целей спринта по оценке QA
              </p>

              <div className="relative mt-3">
                <input
                  id="completion-rate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={draft.completionRate ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    setDraft((current) => ({
                      ...current,
                      completionRate: value === "" ? null : Number(value),
                    }));
                  }}
                  placeholder="46.94"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
                  %
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="sprint-comment"
                className="text-sm font-medium text-slate-800"
              >
                Комментарий
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Дополнительный комментарий QA по итогам спринта
              </p>

              <textarea
                id="sprint-comment"
                rows={5}
                value={draft.comment ?? ""}
                onChange={(event) => {
                  setDraft((current) => ({
                    ...current,
                    comment: event.target.value || null,
                  }));
                }}
                placeholder="Добавить комментарий..."
                className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Цели спринта
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Цели для Backend, Frontend и QA
                </p>
              </div>

              <div className="mt-5 space-y-6">
                {[
                  {
                    key: "backend" as const,
                    title: "Backend",
                    icon: Server,
                  },
                  {
                    key: "frontend" as const,
                    title: "Frontend",
                    icon: Monitor,
                  },
                  {
                    key: "qa" as const,
                    title: "QA",
                    icon: ShieldCheck,
                  },
                ].map((group) => {
                  const Icon = group.icon;
                  const goals = draft.goals[group.key];

                  return (
                    <div key={group.key}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={17} className="text-slate-500" />

                          <span className="text-sm font-medium text-slate-800">
                            {group.title}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => addGoal(group.key)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Plus size={15} />
                          Добавить цель
                        </button>
                      </div>

                      {goals.length > 0 ? (
                        <div className="mt-3 space-y-3">
                          {goals.map((goal, index) => (
                            <div
                              key={`${group.key}-${index}`}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                            >
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={goal.text}
                                  onChange={(event) =>
                                    updateGoal(group.key, index, {
                                      text: event.target.value,
                                    })
                                  }
                                  placeholder="Описание цели..."
                                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeGoal(group.key, index)}
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label={`Удалить цель ${group.title}`}
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>

                              <select
                                value={goal.status}
                                onChange={(event) =>
                                  updateGoal(group.key, index, {
                                    status: event.target
                                      .value as typeof goal.status,
                                  })
                                }
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                              >
                                <option value="planned">Запланировано</option>
                                <option value="done">Выполнено</option>
                                <option value="moved">Перенесено</option>
                                <option value="failed">Не выполнено</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-400">
                          Цели не добавлены
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}
        {hasEmptyGoals && (
          <p className="px-6 pb-3 text-sm text-amber-600">
            Описание цели не должно быть пустым.
          </p>
        )}

        {hasInvalidCompletionRate && (
          <p className="px-6 pb-3 text-sm text-red-600">
            Процент выполнения должен быть от 0 до 100.
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || hasEmptyGoals || hasInvalidCompletionRate}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
