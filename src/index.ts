import { jiraGet } from "./jira/client.js";

interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
}

async function main() {
  console.log("Connecting to Jira...");

  const user = await jiraGet<JiraUser>("/rest/api/3/myself");

  console.log("Connected successfully");
  console.log({
    accountId: user.accountId,
    displayName: user.displayName,
    email: user.emailAddress,
  });
}

main().catch((error) => {
  console.error("Failed to connect to Jira");
  console.error(error);

  process.exitCode = 1;
});
