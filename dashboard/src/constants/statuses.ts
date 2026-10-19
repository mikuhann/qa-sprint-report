const STATUS_CLASSES: Record<string, string> = {
  "В работу": "bg-slate-100 text-slate-600",
  "В процессе": "bg-amber-100 text-amber-800",
  Отложена: "bg-slate-100 text-slate-600",
  "CODE REVIEW": "bg-violet-100 text-violet-700",
  "Отправлено в тестирование": "bg-sky-100 text-sky-700",
  "Тестирование в процессе": "bg-sky-100 text-sky-700",
  "Ожидает выгрузки": "bg-emerald-100 text-emerald-700",
  Закрыто: "bg-emerald-100 text-emerald-700",
  "Тестирование заблокировано": "bg-red-100 text-red-700",
};

export function getStatusClassName(status: string): string {
  return STATUS_CLASSES[status] ?? "bg-slate-100 text-slate-600";
}
