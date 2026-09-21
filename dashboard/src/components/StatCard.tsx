import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  description?: string;
  href?: string | null;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  href,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {icon && (
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="mt-3 text-sm text-slate-400">{description}</p>
      )}
    </>
  );

  const className =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`Open ${label} in Jira`}
      className={`${className} block transition hover:border-slate-300 hover:shadow-md`}
    >
      {content}
    </a>
  );
}
