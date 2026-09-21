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
      message: "Defect has no classification",
    })),

    ...warnings.multipleClassifications.map((key) => ({
      key,
      type: "multiple-classifications" as const,
      message: "Defect has multiple classifications",
    })),

    ...warnings.unassignedDefects.map((key) => ({
      key,
      type: "unassigned-defect" as const,
      message: "Defect has no assignee",
    })),

    ...warnings.missingResolutions.map((key) => ({
      key,
      type: "missing-resolution" as const,
      message: "Resolution is missing",
    })),

    ...warnings.unknownResolutions.map(({ key, value }) => ({
      key,
      type: "unknown-resolution" as const,
      message: `Unknown resolution: ${value}`,
    })),

    ...warnings.missingSeverity.map((key) => ({
      key,
      type: "missing-severity" as const,
      message: "Severity is missing",
    })),

    ...warnings.unknownSeverity.map(({ key, value }) => ({
      key,
      type: "unknown-severity" as const,
      message: `Unknown severity: ${value}`,
    })),

    ...warnings.unknownStatuses.map(({ key, status }) => ({
      key,
      type: "unknown-status" as const,
      message: `Unknown status: ${status}`,
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
