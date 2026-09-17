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

    priority?: {
      id: string;
      name: string;
    } | null;

    customfield_10204?: {
      value: string;
    } | null;
  };
}

interface JiraSearchResponse {
  issues: JiraIssue[];
  isLast: boolean;
  nextPageToken?: string;
}

async function searchIssues(
  jql: string,
  fields: string[],
): Promise<JiraIssue[]> {
  const issues: JiraIssue[] = [];

  let nextPageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      jql,
      maxResults: "100",
      fields: fields.join(","),
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

export async function getDefectsForPeriod(
  startDate: string,
  endDate: string,
): Promise<JiraIssue[]> {
  const jql =
    `project = ${env.jiraProjectKey}` +
    ` AND issuetype = Баг` +
    ` AND created >= "${startDate}"` +
    ` AND created < "${endDate}"`;

  return searchIssues(jql, [
    "summary",
    "status",
    "issuetype",
    "labels",
    "created",
    "assignee",
    "priority",
  ]);
}

export async function getDefectsOutsideSprint(
  sprintId: number,
  startDate: string,
  endDate: string,
): Promise<JiraIssue[]> {
  const jql =
    `project = ${env.jiraProjectKey}` +
    ` AND issuetype = Баг` +
    ` AND created >= "${startDate}"` +
    ` AND created < "${endDate}"` +
    ` AND (Sprint is EMPTY OR Sprint NOT IN (${sprintId}))` +
    ` AND (labels is EMPTY OR labels NOT IN ("prod_issue", "environment_issue"))`;

  return searchIssues(jql, [
    "summary",
    "status",
    "issuetype",
    "labels",
    "created",
    "assignee",
    "priority",
  ]);
}

export async function getSprintIssues(
  sprintId: number,
  previousSprintIds: number[],
): Promise<JiraIssue[]> {
  const previousSprintCondition =
    previousSprintIds.length > 0
      ? ` AND Sprint not in (${previousSprintIds.join(", ")})`
      : "";

  const jql =
    `project = ${env.jiraProjectKey}` +
    ` AND Sprint = ${sprintId}` +
    previousSprintCondition;

  return searchIssues(jql, [
    "summary",
    "status",
    "issuetype",
    "labels",
    "created",
    "assignee",
    "parent",
    "customfield_10204",
  ]);
}
