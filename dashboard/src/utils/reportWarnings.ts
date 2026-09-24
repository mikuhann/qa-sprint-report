import type { SprintReport } from "../types/report";

export type ReportWarningType =
  | "unclassified-defect"
  | "multiple-classifications"
  | "unassigned-defect"
  | "missing-resolution"
  | "unknown-resolution"
  | "missing-severity"
  | "unknown-severity"
  | "unknown-status";

export interface ReportWarningItem {
  key: string;
  type: ReportWarningType;
  message: string;
}

export function getReportWarnings(
  warnings: SprintReport["warnings"],
): ReportWarningItem[] {
  return [
    ...warnings.unclassifiedDefects.map((key) => ({
      key,
      type: "unclassified-defect" as const,
      message: "Для дефекта не указана классификация",
    })),

    ...warnings.multipleClassifications.map((key) => ({
      key,
      type: "multiple-classifications" as const,
      message: "У дефекта указано несколько классификаций",
    })),

    ...warnings.unassignedDefects.map((key) => ({
      key,
      type: "unassigned-defect" as const,
      message: "Для дефекта не назначен исполнитель",
    })),

    ...warnings.missingResolutions.map((key) => ({
      key,
      type: "missing-resolution" as const,
      message: "Не указана резолюция",
    })),

    ...warnings.unknownResolutions.map(({ key, value }) => ({
      key,
      type: "unknown-resolution" as const,
      message: `Неизвестная резолюция: ${value}`,
    })),

    ...warnings.missingSeverity.map((key) => ({
      key,
      type: "missing-severity" as const,
      message: "Не указан приоритет дефекта",
    })),

    ...warnings.unknownSeverity.map(({ key, value }) => ({
      key,
      type: "unknown-severity" as const,
      message: `Неизвестный приоритет: ${value}`,
    })),

    ...warnings.unknownStatuses.map(({ key, status }) => ({
      key,
      type: "unknown-status" as const,
      message: `Неизвестный статус: ${status}`,
    })),
  ];
}

export interface ReportWarningGroup {
  key: string;
  warnings: ReportWarningItem[];
}

export function groupReportWarnings(
  items: ReportWarningItem[],
): ReportWarningGroup[] {
  const groups = new Map<string, ReportWarningItem[]>();

  for (const item of items) {
    const existing = groups.get(item.key);

    if (existing) {
      existing.push(item);
      continue;
    }

    groups.set(item.key, [item]);
  }

  return [...groups.entries()].map(([key, warnings]) => ({
    key,
    warnings,
  }));
}
