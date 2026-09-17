import { env } from "../config/env.js";
import { jiraGet } from "./client.js";

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;

    status: {
      id: string;
      name: string;
    };

    issuetype: {
      id: string;
      name: string;
    };

    labels: string[];

    created: string;

    assignee: {
      accountId: string;
      displayName: string;
    } | null;

    parent?: {
      id: string;
      key: string;
    };
  };
}

interface JiraSearchResponse {
  issues: JiraIssue[];
  isLast: boolean;
  nextPageToken?: string;
}

export async function getSprintIssues(
  sprintId: number,
  previousSprintIds: number[],
): Promise<JiraIssue[]> {
  const issues: JiraIssue[] = [];

  let nextPageToken: string | undefined;

  const previousSprintCondition =
    previousSprintIds.length > 0
      ? ` AND Sprint not in (${previousSprintIds.join(", ")})`
      : "";

  const jql =
    `project = ${env.jiraProjectKey}` +
    ` AND Sprint = ${sprintId}` +
    previousSprintCondition;

  do {
    const params = new URLSearchParams({
      jql,
      maxResults: "100",
      fields: [
        "summary",
        "status",
        "issuetype",
        "labels",
        "created",
        "assignee",
        "parent",
      ].join(","),
    });

    if (nextPageToken) {
      params.set("nextPageToken", nextPageToken);
    }

    const data = await jiraGet<JiraSearchResponse>(
      `/rest/api/3/search/jql?${params.toString()}`,
    );

    issues.push(...data.issues);

    nextPageToken = data.nextPageToken;

    if (data.isLast) {
      break;
    }
  } while (nextPageToken);

  return issues;
}
