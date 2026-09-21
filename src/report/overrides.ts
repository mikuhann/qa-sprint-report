import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { SprintManualData } from "./types.js";

const EMPTY_MANUAL_DATA: SprintManualData = {
  qaAssessment: null,
  comment: null,
  goals: {
    backend: [],
    frontend: [],
    qa: [],
  },
};

export async function loadSprintOverrides(
  sprintId: number,
): Promise<SprintManualData> {
  const path = join(process.cwd(), "config", "sprints", `${sprintId}.json`);

  try {
    const content = await readFile(path, "utf8");

    return JSON.parse(content) as SprintManualData;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return EMPTY_MANUAL_DATA;
    }

    throw error;
  }
}
