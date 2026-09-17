import { getActiveSprint, getPreviousSprints } from "./jira/sprints.js";

async function main() {
  console.log("Loading sprint data...");

  const activeSprint = await getActiveSprint();
  const previousSprints = await getPreviousSprints(2);

  console.log("Active sprint:");

  console.log({
    id: activeSprint.id,
    name: activeSprint.name,
    startDate: activeSprint.startDate,
    endDate: activeSprint.endDate,
  });

  console.log("Previous sprints:");

  console.log(
    previousSprints.map((sprint) => ({
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    })),
  );
}

main().catch((error) => {
  console.error("Failed to load sprint data");
  console.error(error);

  process.exitCode = 1;
});
