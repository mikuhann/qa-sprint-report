import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  description?: string;
}

export function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </div>
  );
}
