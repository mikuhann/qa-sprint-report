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

export async function getActiveSprint(): Promise<JiraSprint | null> {
  const data = await jiraGet<JiraSprintsResponse>(
    `/rest/agile/1.0/board/${env.jiraBoardId}/sprint?state=active`,
  );

  return data.values[0] ?? null;
}

// Without sprintId: active sprint, or the latest closed one when there is no active sprint
export async function getSprintWithPrevious(sprintId?: number): Promise<{
  sprint: JiraSprint;
  previousSprints: JiraSprint[];
}> {
  const [requestedSprint, closedSprints] = await Promise.all([
    sprintId ? getSprintById(sprintId) : getActiveSprint(),
    getClosedSprints(),
  ]);

  const sprint = requestedSprint ?? closedSprints[0];

  if (!sprint) {
    throw new Error(
      `No active or closed sprints found for board ${env.jiraBoardId}`,
    );
  }

  return {
    sprint,
    previousSprints: getPreviousSprints(sprint, closedSprints),
  };
}

function getPreviousSprints(
  sprint: JiraSprint,
  closedSprints: JiraSprint[],
): JiraSprint[] {
  if (sprint.state === "active") {
    return closedSprints;
  }

  const sprintIndex = closedSprints.findIndex((item) => item.id === sprint.id);

  if (sprintIndex === -1) {
    throw new Error(`Sprint ${sprint.id} not found in closed sprints`);
  }

  return closedSprints.slice(sprintIndex + 1);
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

  return activeSprint ? [activeSprint, ...closedSprints] : closedSprints;
}
