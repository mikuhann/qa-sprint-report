import { buildReport } from "./report/buildReport.js";

async function main() {
  const report = await buildReport();

  console.dir(report, {
    depth: null,
  });
}

main().catch((error) => {
  console.error("Failed to generate report");
  console.error(error);

  process.exitCode = 1;
});
