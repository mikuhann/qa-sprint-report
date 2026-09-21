import { createServer } from "node:http";

import { buildReport } from "./report/buildReport.js";
import { saveSprintOverrides } from "./report/overrides.js";
import { writeReport } from "./report/writeReport.js";

const PORT = 3001;

async function readJsonBody(request: NodeJS.ReadableStream): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks).toString("utf8");

  if (!body) {
    throw new Error("Request body is required");
  }

  return JSON.parse(body) as unknown;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "localhost"}`,
    );

    const match = url.pathname.match(/^\/api\/sprints\/(\d+)\/manual$/);

    if (request.method === "PUT" && match) {
      const sprintId = Number(match[1]);

      const data = await readJsonBody(request);

      await saveSprintOverrides(sprintId, data);

      const report = await buildReport();

      if (report.meta.sprintId !== sprintId) {
        response.writeHead(409, {
          "Content-Type": "application/json",
        });

        response.end(
          JSON.stringify({
            error: `Sprint ${sprintId} is not the active sprint`,
          }),
        );

        return;
      }

      await writeReport(report);

      response.writeHead(200, {
        "Content-Type": "application/json",
      });

      response.end(JSON.stringify(report));

      return;
    }

    response.writeHead(404, {
      "Content-Type": "application/json",
    });

    response.end(
      JSON.stringify({
        error: "Not found",
      }),
    );
  } catch (error) {
    console.error(error);

    response.writeHead(400, {
      "Content-Type": "application/json",
    });

    response.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Report API running at http://localhost:${PORT}`);
});
