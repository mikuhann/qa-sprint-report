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

  const hasEmptyGoals = Object.values(draft.goals)
    .flat()
    .some((goal) => !goal.text.trim());

  const handleSave = async () => {
    if (hasEmptyGoals || isSaving) {
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
          : "Failed to save report settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close report settings"
        disabled={isSaving}
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Report settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sprint goals and QA assessment
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
                QA assessment
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Overall QA assessment for the sprint
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
                <option value="">Not set</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sprint-comment"
                className="text-sm font-medium text-slate-800"
              >
                Comment
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Additional QA notes for the sprint
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
                placeholder="Add sprint comment..."
                className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Sprint goals
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Goals planned for Backend, Frontend and QA
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
                          Add goal
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
                                  placeholder="Goal description..."
                                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeGoal(group.key, index)}
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label={`Remove ${group.title} goal`}
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
                                <option value="planned">Planned</option>
                                <option value="done">Done</option>
                                <option value="moved">Moved</option>
                                <option value="failed">Failed</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-400">
                          No {group.title.toLowerCase()} goals
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
            Goal description cannot be empty.
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || hasEmptyGoals}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
