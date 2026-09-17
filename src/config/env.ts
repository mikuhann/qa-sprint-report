import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

export const env = {
  jiraDomain: getRequiredEnv("JIRA_DOMAIN"),
  jiraEmail: getRequiredEnv("JIRA_EMAIL"),
  jiraApiToken: getRequiredEnv("JIRA_API_TOKEN"),
  jiraBoardId: Number(getRequiredEnv("JIRA_BOARD_ID")),
  jiraProjectKey: getRequiredEnv("JIRA_PROJECT_KEY"),
};
