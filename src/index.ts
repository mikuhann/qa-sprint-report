import { getSprintIssues } from "./jira/issues.js";
import { getSprintReportMeta } from "./report/meta.js";

async function main() {
  console.log("Generating report metadata...");

  const meta = await getSprintReportMeta();

  console.log(meta);

  console.log("\nLoading sprint issues...");

  const issues = await getSprintIssues(meta.sprintId, meta.previousSprintIds);

  console.log(`Issues: ${issues.length}`);

  const statuses = [
    ...new Set(issues.map((issue) => issue.fields.status.name)),
  ].sort();

  const issueTypes = [
    ...new Set(issues.map((issue) => issue.fields.issuetype.name)),
  ].sort();

  const labels = [
    ...new Set(issues.flatMap((issue) => issue.fields.labels)),
  ].sort();

  console.log("\nStatuses:");
  console.log(statuses);

  console.log("\nIssue types:");
  console.log(issueTypes);

  console.log("\nLabels:");
  console.log(labels);
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
