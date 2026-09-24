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

export async function downloadReportPdf(sprintId: number): Promise<void> {
  const response = await fetch("/api/export/pdf");

  if (!response.ok) {
    throw new Error(`Failed to export PDF: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `qa-sprint-${sprintId}.pdf`;

  document.body.appendChild(link);

  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
