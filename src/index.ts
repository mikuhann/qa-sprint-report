import { getActiveSprint } from "./jira/sprints.js";

async function main() {
  console.log("Loading active sprint...");

  const sprint = await getActiveSprint();

  console.log("Active sprint found");

  console.log({
    id: sprint.id,
    name: sprint.name,
    state: sprint.state,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    goal: sprint.goal,
  });
}

main().catch((error) => {
  console.error("Failed to load active sprint");
  console.error(error);

  process.exitCode = 1;
});
