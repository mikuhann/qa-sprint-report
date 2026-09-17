import { env } from "../config/env.js";
import { getActiveSprint, getPreviousSprints } from "../jira/sprints.js";

import type { SprintReportMeta } from "./types.js";

interface DateParts {
  year: string;
  month: string;
  day: string;
}

function getDateParts(value: string): DateParts {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid Jira date: ${value}`);
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: env.reportTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes): string => {
    return parts.find((part) => part.type === type)?.value ?? "";
  };

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
  };
}

function toIsoDate(value: string): string {
  const { year, month, day } = getDateParts(value);

  return `${year}-${month}-${day}`;
}

function toShortDate(value: string): string {
  const { month, day } = getDateParts(value);

  return `${day}.${month}`;
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);

  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

export async function getSprintReportMeta(): Promise<SprintReportMeta> {
  const sprint = await getActiveSprint();
  const previousSprints = await getPreviousSprints(2);

  if (!sprint.startDate || !sprint.endDate) {
    throw new Error(`Sprint ${sprint.id} has no startDate or endDate`);
  }

  const startDate = toIsoDate(sprint.startDate);
  const endDate = toIsoDate(sprint.endDate);

  return {
    sprintId: sprint.id,
    sprintName: sprint.name,

    startDate,
    endDate,

    sprintDates: `${toShortDate(
      sprint.startDate,
    )} - ${toShortDate(sprint.endDate)}`,

    queryStartDate: startDate,
    queryEndDate: addDays(endDate, 1),

    previousSprintIds: previousSprints.map((item) => item.id),
  };
}
