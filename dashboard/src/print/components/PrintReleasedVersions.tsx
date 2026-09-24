import { ExternalLink, PackageCheck } from "lucide-react";

import type { SprintReport } from "../../types/report";

interface PrintReleasedVersionsProps {
  versions: SprintReport["releasedVersions"];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

export function PrintReleasedVersions({
  versions,
}: PrintReleasedVersionsProps) {
  if (!versions.length) {
    return null;
  }

  return (
    <section className="pdf-avoid-break mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
          <PackageCheck size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Вышедшие релизы
          </h2>

          <p className="text-xs text-slate-500">За период спринта</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {versions.map((version) => (
          <a
            key={version.id}
            href={version.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
          >
            <div>
              <div className="text-sm font-medium text-slate-900">
                {version.name}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">
                {formatDate(version.releaseDate)}
              </div>
            </div>

            <ExternalLink size={14} className="text-slate-400" />
          </a>
        ))}
      </div>
    </section>
  );
}
