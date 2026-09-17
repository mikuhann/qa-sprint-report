import { env } from "../config/env.js";
import { jiraGet } from "./client.js";

export interface JiraSprint {
  id: number;
  self: string;
  state: "active" | "closed" | "future";
  name: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
  originBoardId: number;
  goal?: string;
}

interface JiraSprintsResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  values: JiraSprint[];
}

export async function getActiveSprint(): Promise<JiraSprint> {
  const data = await jiraGet<JiraSprintsResponse>(
    `/rest/agile/1.0/board/${env.jiraBoardId}/sprint?state=active`,
  );

  const sprint = data.values[0];

  if (!sprint) {
    throw new Error(`Active sprint not found for board ${env.jiraBoardId}`);
  }

  return sprint;
}

export async function getPreviousSprints(count = 2): Promise<JiraSprint[]> {
  const allSprints: JiraSprint[] = [];

  let startAt = 0;
  const maxResults = 50;
  let isLast = false;

  while (!isLast) {
    const data = await jiraGet<JiraSprintsResponse>(
      `/rest/agile/1.0/board/${env.jiraBoardId}/sprint?state=closed&startAt=${startAt}&maxResults=${maxResults}`,
    );

    allSprints.push(...data.values);

    isLast = data.isLast;

    startAt += data.values.length;

    if (data.values.length === 0) {
      break;
    }
  }

  return allSprints
    .filter((sprint) => sprint.endDate)
    .sort(
      (a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime(),
    )
    .slice(0, count);
}
