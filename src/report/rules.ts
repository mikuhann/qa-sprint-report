import type { JiraIssue } from "../jira/issues.js";

const DUTY_ISSUE_KEY = "ERPBACK-7615";

export function isSprintDeliveryIssue(issue: JiraIssue): boolean {
  if (issue.key === DUTY_ISSUE_KEY) {
    return false;
  }

  if (issue.fields.parent?.key === DUTY_ISSUE_KEY) {
    return false;
  }

  return true;
}
