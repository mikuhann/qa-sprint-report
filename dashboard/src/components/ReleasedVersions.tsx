import { ExternalLink, PackageCheck } from "lucide-react";

import type { SprintReport } from "../types/report";

interface ReleasedVersionsProps {
  versions: SprintReport["releasedVersions"];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

export function ReleasedVersions({ versions }: ReleasedVersionsProps) {
  if (!versions.length) {
    return null;
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
          <PackageCheck size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Released versions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Releases published during the sprint
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {versions.map((version) => (
          <a
            key={version.id}
            href={version.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 py-3"
          >
            <div>
              <div className="font-medium text-slate-900">{version.name}</div>

              <div className="mt-1 text-sm text-slate-500">
                {formatDate(version.releaseDate)}
              </div>
            </div>

            <ExternalLink size={16} className="text-slate-400" />
          </a>
        ))}
      </div>
    </section>
  );
}
