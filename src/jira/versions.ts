import { env } from "../config/env.js";
import { jiraGet } from "./client.js";

export interface JiraVersion {
  id: string;
  name: string;
  released: boolean;
  archived: boolean;
  releaseDate?: string;
}

interface JiraVersionsResponse {
  startAt: number;
  maxResults: number;
  total: number;
  isLast: boolean;
  values: JiraVersion[];
}

export async function getReleasedVersionsForPeriod(
  startDate: string,
  endDate: string,
): Promise<JiraVersion[]> {
  const versions: JiraVersion[] = [];

  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const params = new URLSearchParams({
      startAt: String(startAt),
      maxResults: String(maxResults),
      status: "released",
      orderBy: "releaseDate",
    });

    const data = await jiraGet<JiraVersionsResponse>(
      `/rest/api/3/project/${env.jiraProjectKey}/version?${params.toString()}`,
    );

    versions.push(...data.values);

    if (data.isLast || data.values.length === 0) {
      break;
    }

    startAt += data.values.length;
  }

  return versions
    .filter((version) => {
      if (!version.released || !version.releaseDate) {
        return false;
      }

      return version.releaseDate >= startDate && version.releaseDate < endDate;
    })
    .sort((a, b) => a.releaseDate!.localeCompare(b.releaseDate!));
}
