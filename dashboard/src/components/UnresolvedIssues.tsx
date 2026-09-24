import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import { PRIORITY_VALUES, getPriorityConfig } from "../constants/priorities";

import type { SprintReport } from "../types/report";

interface UnresolvedIssuesProps {
  issues: SprintReport["unresolvedIssues"];
  href: string | null;
}

export function UnresolvedIssues({ issues, href }: UnresolvedIssuesProps) {
  const [expanded, setExpanded] = useState(false);

  const jiraBaseUrl = import.meta.env.VITE_JIRA_BASE_URL;

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      const aOrder = getPriorityConfig(a.priority)?.order ?? 999;

      const bOrder = getPriorityConfig(b.priority)?.order ?? 999;

      return aOrder - bOrder;
    });
  }, [issues]);

  const prioritySummary = useMemo(() => {
    const counts = new Map<string, number>();

    for (const issue of issues) {
      const key = issue.priority ?? "none";

      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
  }, [issues]);

  const visibleIssues = expanded ? sortedIssues : sortedIssues.slice(0, 5);

  if (!issues.length) {
    return null;
  }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">
              Unresolved issues
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {issues.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Issues that still require work
          </p>
        </div>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-800"
          >
            Open all in Jira
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4">
        {PRIORITY_VALUES.map((priority) => {
          const count = prioritySummary.get(priority.label) ?? 0;

          if (!count) {
            return null;
          }

          return (
            <span
              key={priority.label}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${priority.className}`}
            >
              {priority.shortLabel} · {count}
            </span>
          );
        })}

        {(prioritySummary.get("none") ?? 0) > 0 && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            No priority · {prioritySummary.get("none")}
          </span>
        )}
      </div>
      <div className="border-t border-slate-100">
        {visibleIssues.map((issue) => {
          const priority = getPriorityConfig(issue.priority);

          return (
            <a
              key={issue.key}
              href={`${jiraBaseUrl}/browse/${issue.key}`}
              target="_blank"
              rel="noreferrer"
              className="grid gap-3 border-b border-slate-100 px-6 py-4 transition last:border-b-0 hover:bg-slate-50 md:grid-cols-[130px_1fr_180px_130px]"
            >
              <div className="font-medium text-blue-600">{issue.key}</div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900">
                  {issue.summary}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {issue.issueType}
                </div>
              </div>

              <div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {issue.status}
                </span>
              </div>

              <div>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    priority?.className ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {priority?.shortLabel ?? "No priority"}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {issues.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          {expanded ? "Show less" : `Show all ${issues.length} issues`}

          <ChevronDown
            size={16}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </section>
  );
}
