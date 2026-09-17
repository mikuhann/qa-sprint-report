import type { SprintReport } from "../types/report";

export async function loadReport(): Promise<SprintReport> {
  const response = await fetch("/report.json");

  if (!response.ok) {
    throw new Error(`Failed to load report: ${response.status}`);
  }

  return response.json();
}
