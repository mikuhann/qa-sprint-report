import type { SprintReport } from "../types/report";

export async function loadReport(): Promise<SprintReport> {
  const response = await fetch("/report.json");

  if (!response.ok) {
    throw new Error(`Failed to load report: ${response.status}`);
  }

  return response.json();
}

export async function saveManualData(
  sprintId: number,
  data: SprintReport["manual"],
): Promise<SprintReport> {
  const response = await fetch(`/api/sprints/${sprintId}/manual`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = (await response.json()) as {
      error?: string;
    };

    throw new Error(
      body.error ?? `Failed to save report settings: ${response.status}`,
    );
  }

  return response.json();
}
