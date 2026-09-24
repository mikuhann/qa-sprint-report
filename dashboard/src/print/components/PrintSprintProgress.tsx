import type { SprintReport } from "../../types/report";

interface PrintSprintProgressProps {
  tasks: SprintReport["tasks"];
  links: SprintReport["links"]["tasks"];
}

export function PrintSprintProgress({
  tasks,
  links,
}: PrintSprintProgressProps) {
  const getPercent = (value: number) =>
    tasks.total ? (value / tasks.total) * 100 : 0;

  const items = [
    {
      label: "Не завершено",
      value: tasks.unresolved,
      className: "bg-slate-500",
      href: links.unresolved,
    },
    {
      label: "На тестировании",
      value: tasks.testing,
      className: "bg-blue-500",
      href: links.testing,
    },
    {
      label: "Ожидает выгрузки",
      value: tasks.waitingRelease,
      className: "bg-amber-500",
      href: links.waitingRelease,
    },
    {
      label: "Закрыто",
      value: tasks.closed,
      className: "bg-emerald-500",
      href: links.closed,
    },
    {
      label: "Заблокировано",
      value: tasks.blocked,
      className: "bg-red-500",
      href: links.blocked,
    },
  ].map((item) => ({
    ...item,
    percent: getPercent(item.value),
  }));

  return (
    <section className="pdf-avoid-break mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Прогресс спринта
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Распределение {tasks.total} тикетов по текущему состоянию
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold">{tasks.closed}</div>

          <div className="text-xs text-slate-500">закрыто</div>
        </div>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            className={item.className}
            style={{
              width: `${item.percent}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-3">
        {items.map((item) => {
          const content = (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.className}`}
                />

                <span className="text-xs text-slate-600">{item.label}</span>
              </div>

              <div className="mt-1 pl-4.5">
                <span className="text-sm font-semibold text-slate-950">
                  {item.value}
                </span>

                <span className="ml-2 text-xs text-slate-400">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
