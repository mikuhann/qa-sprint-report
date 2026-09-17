import { jiraGet } from "./client.js";

export interface JiraPriority {
  id: string;
  name: string;
}

interface JiraPrioritiesResponse {
  values: JiraPriority[];
  isLast: boolean;
}

export async function getJiraPriorities(): Promise<JiraPriority[]> {
  const data = await jiraGet<JiraPrioritiesResponse>(
    "/rest/api/3/priority/search?maxResults=100",
  );

  return data.values;
}
