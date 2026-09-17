import { jiraGet } from "./client.js";

export interface JiraField {
  id: string;
  name: string;
  custom: boolean;
}

export async function getJiraFields(): Promise<JiraField[]> {
  return jiraGet<JiraField[]>("/rest/api/3/field");
}
