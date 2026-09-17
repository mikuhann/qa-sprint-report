import { env } from "./config/env.js";

console.log("Jira config loaded");
console.log({
  domain: env.jiraDomain,
  boardId: env.jiraBoardId,
  projectKey: env.jiraProjectKey,
});
