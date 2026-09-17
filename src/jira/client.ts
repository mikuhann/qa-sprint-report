import { env } from "../config/env.js";

function getAuthHeader(): string {
  const credentials = Buffer.from(
    `${env.jiraEmail}:${env.jiraApiToken}`,
  ).toString("base64");

  return `Basic ${credentials}`;
}

export async function jiraGet<T>(path: string): Promise<T> {
  const url = `https://${env.jiraDomain}${path}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Jira API error: ${response.status} ${response.statusText}\n${body}`,
    );
  }

  return response.json() as Promise<T>;
}
