export interface SprintReportMeta {
  sprintId: number;
  sprintName: string;

  startDate: string;
  endDate: string;
  sprintDates: string;

  previousSprintIds: number[];
}
