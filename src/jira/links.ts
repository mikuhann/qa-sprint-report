import { env } from "../config/env.js";
import type { JiraIssue } from "./issues.js";

type IssueKeySource = Pick<JiraIssue, "key">;

export function buildIssueSearchLink(issues: IssueKeySource[]): string | null {
  const keys = [...new Set(issues.map((issue) => issue.key))];

  if (keys.length === 0) {
    return null;
  }

  const jql = `key in (${keys.join(", ")}) ` + `ORDER BY key DESC`;

  return `https://${env.jiraDomain}/issues/?jql=` + encodeURIComponent(jql);
}
