export const PRIORITIES = {
  blocker: {
    label: "Блокер",
    shortLabel: "Blocker",
    order: 0,
    className: "bg-red-100 text-red-700",
  },

  critical: {
    label: "Критический",
    shortLabel: "Critical",
    order: 1,
    className: "bg-orange-100 text-orange-700",
  },

  major: {
    label: "Серьезный",
    shortLabel: "Major",
    order: 2,
    className: "bg-amber-100 text-amber-700",
  },

  minor: {
    label: "Незначительный",
    shortLabel: "Minor",
    order: 3,
    className: "bg-blue-100 text-blue-700",
  },

  trivial: {
    label: "Тривиальный",
    shortLabel: "Trivial",
    order: 4,
    className: "bg-slate-100 text-slate-600",
  },
} as const;

export type PriorityKey = keyof typeof PRIORITIES;

export const PRIORITY_VALUES = Object.values(PRIORITIES);

export function getPriorityConfig(priority: string | null) {
  return PRIORITY_VALUES.find((item) => item.label === priority);
}
