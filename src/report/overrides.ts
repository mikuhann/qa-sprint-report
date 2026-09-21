import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  QaAssessment,
  SprintGoal,
  SprintGoalStatus,
  SprintManualData,
} from "./types.js";

const EMPTY_MANUAL_DATA: SprintManualData = {
  qaAssessment: null,
  comment: null,
  goals: {
    backend: [],
    frontend: [],
    qa: [],
  },
};

const GOAL_STATUSES = new Set<SprintGoalStatus>([
  "planned",
  "done",
  "moved",
  "failed",
]);

const QA_ASSESSMENTS = new Set<QaAssessment>(["good", "average", "poor"]);

function getSprintOverridePath(sprintId: number) {
  return join(process.cwd(), "config", "sprints", `${sprintId}.json`);
}

function validateGoal(
  value: unknown,
  path: string,
): asserts value is SprintGoal {
  if (!value || typeof value !== "object") {
    throw new Error(`${path} must be an object`);
  }

  const goal = value as Record<string, unknown>;

  if (typeof goal.text !== "string" || !goal.text.trim()) {
    throw new Error(`${path}.text must be a non-empty string`);
  }

  if (
    typeof goal.status !== "string" ||
    !GOAL_STATUSES.has(goal.status as SprintGoalStatus)
  ) {
    throw new Error(
      `${path}.status must be one of: ${[...GOAL_STATUSES].join(", ")}`,
    );
  }
}

export function validateManualData(
  value: unknown,
): asserts value is SprintManualData {
  if (!value || typeof value !== "object") {
    throw new Error("Sprint override must be an object");
  }

  const data = value as Record<string, unknown>;

  if (
    data.qaAssessment !== null &&
    data.qaAssessment !== undefined &&
    (typeof data.qaAssessment !== "string" ||
      !QA_ASSESSMENTS.has(data.qaAssessment as QaAssessment))
  ) {
    throw new Error(
      `qaAssessment must be one of: ${[...QA_ASSESSMENTS].join(", ")}`,
    );
  }

  if (
    data.comment !== null &&
    data.comment !== undefined &&
    typeof data.comment !== "string"
  ) {
    throw new Error("comment must be a string");
  }

  if (!data.goals || typeof data.goals !== "object") {
    throw new Error("goals must be an object");
  }

  const goals = data.goals as Record<string, unknown>;

  for (const group of ["backend", "frontend", "qa"]) {
    const items = goals[group];

    if (!Array.isArray(items)) {
      throw new Error(`goals.${group} must be an array`);
    }

    items.forEach((goal, index) => {
      validateGoal(goal, `goals.${group}[${index}]`);
    });
  }
}

export async function loadSprintOverrides(
  sprintId: number,
): Promise<SprintManualData> {
  const path = getSprintOverridePath(sprintId);

  try {
    const content = await readFile(path, "utf8");
    const data: unknown = JSON.parse(content);

    validateManualData(data);

    return data;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return EMPTY_MANUAL_DATA;
    }

    throw new Error(
      `Failed to load sprint overrides for ${sprintId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export async function saveSprintOverrides(
  sprintId: number,
  data: unknown,
): Promise<SprintManualData> {
  validateManualData(data);

  const directory = join(process.cwd(), "config", "sprints");

  const path = getSprintOverridePath(sprintId);

  await mkdir(directory, {
    recursive: true,
  });

  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  return data;
}
