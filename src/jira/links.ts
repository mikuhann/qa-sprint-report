import { env } from "../config/env.js";
import type { JiraIssue } from "./issues.js";

type IssueKeySource = Pick<JiraIssue, "key">;

export function buildJiraSearchLink(jql: string): string {
  return `https://${env.jiraDomain}/issues/?jql=` + encodeURIComponent(jql);
}

export function buildIssueSearchLink(issues: IssueKeySource[]): string | null {
  const keys = [...new Set(issues.map((issue) => issue.key))];

  if (keys.length === 0) {
    return null;
  }

  return buildJiraSearchLink(`key in (${keys.join(", ")}) ORDER BY key DESC`);
}

export function buildVersionIssuesLink(versionId: string): string {
  return buildJiraSearchLink(
    `project = ${env.jiraProjectKey} AND fixVersion = ${versionId} ORDER BY key DESC`,
  );
}
