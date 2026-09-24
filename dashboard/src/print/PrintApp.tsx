import { useEffect, useRef, useState } from "react";
import { Previewer } from "pagedjs";

import { PrintDocument } from "./PrintDocument";
import { loadReport } from "../api/report";
import type { SprintReport } from "../types/report";

export function PrintApp() {
  const [report, setReport] = useState<SprintReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sourceRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReport()
      .then(setReport)
      .catch((error: unknown) => {
        setError(
          error instanceof Error ? error.message : "Не удалось загрузить отчёт",
        );
      });
  }, []);

  useEffect(() => {
    if (!report || !sourceRef.current || !previewRef.current) {
      return;
    }

    const render = async () => {
      document.documentElement.dataset.pdfReady = "false";

      await document.fonts.ready;

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      const previewer = new Previewer();

      previewRef.current!.innerHTML = "";

      const pagedStyles = {
        [window.location.href]: `
    @page {
      size: A4 landscape;
      margin: 8mm;
    }
    .pdf-document,
    .pdf-document * {
      box-shadow: none !important;
    }

    .pdf-page-break {
      break-after: page;
    }

    .pdf-goals-section {
      break-after: page;
    }

    .pdf-goal-table {
      break-inside: auto;
    }

    .pdf-goal-row {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .pdf-goal-table thead {
      break-inside: avoid;
    }

    .pdf-avoid-break {
      break-inside: avoid;
    }

    a {
      color: inherit;
      text-decoration: none;
      outline: none;
    }

    a:focus,
    a:focus-visible {
      outline: none;
    }

    .pdf-details-section {
      break-after: page;
    }

    .pdf-unresolved-table {
      break-inside: auto;
    }

    .pdf-unresolved-row {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .pdf-data-quality-section {
      break-before: page;
    }

    .pdf-warning-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `,
      };

      const flow = await previewer.preview(
        sourceRef.current!.innerHTML,
        [pagedStyles],
        previewRef.current!,
      );

      document.documentElement.dataset.pdfReady = "true";

      console.log(`PDF preview: ${flow.total} pages`);
    };

    void render();
  }, [report]);

  if (error) {
    return <div className="p-8">{error}</div>;
  }

  if (!report) {
    return <div className="p-8">Подготовка отчёта...</div>;
  }

  return (
    <>
      <div
        ref={sourceRef}
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "1120px",
        }}
      >
        <PrintDocument report={report} />
      </div>

      <div ref={previewRef} />
    </>
  );
}
