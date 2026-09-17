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
