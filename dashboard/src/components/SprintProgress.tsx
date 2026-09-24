interface SprintProgressProps {
  total: number;
  unresolved: number;
  testing: number;
  waitingRelease: number;
  closed: number;
  blocked: number;

  links: {
    total: string | null;
    unresolved: string | null;
    testing: string | null;
    waitingRelease: string | null;
    closed: string | null;
    blocked: string | null;
  };
}

export function SprintProgress({
  total,
  unresolved,
  testing,
  waitingRelease,
  closed,
  blocked,
  links,
}: SprintProgressProps) {
  const getPercent = (value: number) => {
    if (!total) {
      return 0;
    }

    return (value / total) * 100;
  };

  const items = [
    {
      label: "Не завершено",
      value: unresolved,
      width: getPercent(unresolved),
      barClass: "bg-slate-500",
      dotClass: "bg-slate-500",
      url: links.unresolved,
    },
    {
      label: "На тестировании",
      value: testing,
      width: getPercent(testing),
      barClass: "bg-blue-500",
      dotClass: "bg-blue-500",
      url: links.testing,
    },
    {
      label: "Ожидает выгрузки",
      value: waitingRelease,
      width: getPercent(waitingRelease),
      barClass: "bg-amber-500",
      dotClass: "bg-amber-500",
      url: links.waitingRelease,
    },
    {
      label: "Закрыто",
      value: closed,
      width: getPercent(closed),
      barClass: "bg-emerald-500",
      dotClass: "bg-emerald-500",
      url: links.closed,
    },
    {
      label: "Заблокировано",
      value: blocked,
      width: getPercent(blocked),
      barClass: "bg-red-500",
      dotClass: "bg-red-500",
      url: links.blocked,
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Прогресс спринта
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Распределение {total} тикетов по текущему состоянию
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-950">{closed}</div>

          <div className="text-sm text-slate-500">закрыто</div>
        </div>
      </div>

      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            title={`${item.label}: ${item.value} (${item.width.toFixed(1)}%)`}
            className={`${item.barClass} transition-opacity hover:opacity-75`}
            style={{ width: `${item.width}%` }}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => {
          const content = (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`}
                  />

                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>

                <span className="text-sm font-semibold text-slate-950">
                  {item.value}
                </span>
              </div>

              <div className="mt-1 pl-4.5 text-xs text-slate-400">
                {item.width.toFixed(1)}%
              </div>
            </>
          );

          if (!item.url) {
            return (
              <div key={item.label} className="rounded-lg px-2 py-2">
                {content}
              </div>
            );
          }

          return (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title={`Открыть «${item.label}» в Jira`}
              className="rounded-lg px-2 py-2 transition hover:bg-slate-50"
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
