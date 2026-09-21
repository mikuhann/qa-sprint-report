import type { JiraIssue } from "./issues.js";
import { jiraPost } from "./client.js";

interface JiraChangelogItem {
  field: string;
  fieldId?: string;

  from?: string | null;
  fromString?: string | null;

  to?: string | null;
  toString?: string | null;
}

interface JiraChangeHistory {
  id: string;
  created: string | number;
  items: JiraChangelogItem[];
}

interface JiraIssueChangeLog {
  issueId: string;
  changeHistories: JiraChangeHistory[];
}

interface BulkChangelogResponse {
  issueChangeLogs: JiraIssueChangeLog[];
  nextPageToken?: string;
}

export interface HistoricalAssignee {
  accountId: string;
  name: string;
}

export interface IssueAssigneeHistory {
  issueId: string;
  issueKey: string;
  currentAssignee: HistoricalAssignee | null;
  historicalAssignees: HistoricalAssignee[];
}

export async function getAssigneeHistory(
  issues: JiraIssue[],
): Promise<IssueAssigneeHistory[]> {
  if (issues.length === 0) {
    return [];
  }

  const changeLogs: JiraIssueChangeLog[] = [];

  let nextPageToken: string | undefined;

  do {
    const data = await jiraPost<BulkChangelogResponse>(
      "/rest/api/3/changelog/bulkfetch",
      {
        issueIdsOrKeys: issues.map((issue) => issue.id),
        fieldIds: ["assignee"],
        maxResults: 1000,
        ...(nextPageToken ? { nextPageToken } : {}),
      },
    );

    changeLogs.push(...data.issueChangeLogs);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  const changelogByIssueId = new Map(
    changeLogs.map((item) => [item.issueId, item.changeHistories]),
  );

  return issues.map((issue) => {
    const assignees = new Map<string, HistoricalAssignee>();

    const histories = changelogByIssueId.get(issue.id) ?? [];

    for (const history of histories) {
      for (const item of history.items) {
        if (
          item.fieldId !== "assignee" &&
          item.field.toLowerCase() !== "assignee"
        ) {
          continue;
        }

        if (item.from && item.fromString) {
          assignees.set(item.from, {
            accountId: item.from,
            name: item.fromString,
          });
        }

        if (item.to && item.toString) {
          assignees.set(item.to, {
            accountId: item.to,
            name: item.toString,
          });
        }
      }
    }

    const currentAssignee = issue.fields.assignee
      ? {
          accountId: issue.fields.assignee.accountId,
          name: issue.fields.assignee.displayName,
        }
      : null;

    if (currentAssignee) {
      assignees.set(currentAssignee.accountId, currentAssignee);
    }

    return {
      issueId: issue.id,
      issueKey: issue.key,
      currentAssignee,
      historicalAssignees: [...assignees.values()],
    };
  });
}
