import { env } from "../config/env.js";

function getAuthHeader(): string {
  const credentials = Buffer.from(
    `${env.jiraEmail}:${env.jiraApiToken}`,
  ).toString("base64");

  return `Basic ${credentials}`;
}

async function jiraRequest<T>(path: string, init: RequestInit): Promise<T> {
  const url = `https://${env.jiraDomain}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
      ...init.headers,
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

export function jiraGet<T>(path: string): Promise<T> {
  return jiraRequest<T>(path, {
    method: "GET",
  });
}

export function jiraPost<T>(path: string, body: unknown): Promise<T> {
  return jiraRequest<T>(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
