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

export async function getPreviousSprintsFor(
  sprint: JiraSprint,
  count = 2,
): Promise<JiraSprint[]> {
  const closedSprints = await getClosedSprints();

  if (sprint.state === "active") {
    return closedSprints.slice(0, count);
  }

  const sprintIndex = closedSprints.findIndex((item) => item.id === sprint.id);

  if (sprintIndex === -1) {
    throw new Error(`Sprint ${sprint.id} not found in closed sprints`);
  }

  return closedSprints.slice(sprintIndex + 1, sprintIndex + 1 + count);
}

export async function getSprintById(sprintId: number): Promise<JiraSprint> {
  return jiraGet<JiraSprint>(`/rest/agile/1.0/sprint/${sprintId}`);
}

async function getClosedSprints(): Promise<JiraSprint[]> {
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
    );
}

export async function getAvailableSprints(): Promise<JiraSprint[]> {
  const [activeSprint, closedSprints] = await Promise.all([
    getActiveSprint(),
    getClosedSprints(),
  ]);

  return [activeSprint, ...closedSprints];
}
