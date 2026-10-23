# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

QA sprint report generator: pulls data from Jira Cloud, computes sprint/defect statistics, shows them in a React dashboard and exports to PDF. README.md (in Russian) covers setup and `.env` variables (`.env`, `dashboard/.env`; see the `.env.example` files).

Two separate npm projects: root (Node backend, ESM + TypeScript run via `tsx`) and `dashboard/` (Vite + React 19 + Tailwind 4 + Recharts). Install both: `npm ci && npm --prefix dashboard ci`.

## Commands

- `npm run dev` — generates the active-sprint report, then runs API (`:3001`) and Vite dashboard (`:5173`) concurrently
- `npm run report [-- --sprint <id>]` — generate report JSON for the active or given sprint
- `npm run server` / `npm run dashboard` — API / dashboard separately
- `npm run build` — `tsc` (backend → `dist/`) + dashboard build
- `npm run lint` — ESLint, **dashboard only** (backend has no linter)
- PDF export needs `npx playwright install chromium` once
- No test suite exists.

## Architecture

**Data flow:** `src/jira/*` (Jira REST client, issues/sprints/versions/changelog queries) → `src/report/buildReport.ts` (orchestrator; uses `statistics.ts`, `insights.ts`, `rules.ts`, `developers.ts`, `meta.ts`) → `SprintReport` (`src/report/types.ts`) → `writeReport.ts` writes it to `output/sprint-<id>/report.json` and copies to `dashboard/public/report.json`.

- `dashboard/src/types/report.ts` is a hand-maintained mirror of `src/report/types.ts`; change both together.
- Sprint period/timezone handling lives in `meta.ts` (`REPORT_TIME_ZONE`); previous sprints are used for carry-over / reopened-after-testing logic.
- `rules.ts` excludes the duty issue `ERPBACK-7615` and its subtasks from delivery stats — hardcoded project-specific rule.
- Env is loaded in `src/config/env.ts` (required vars validated there).

**Manual data:** goals, QA assessment, completion rate and comment are not from Jira. They are stored per sprint in `config/sprints/<id>.json` (validated in `src/report/overrides.ts`) and merged into the report as `report.manual`. These files are tracked in git.

**API (`src/server.ts`, plain `node:http`, no framework):** `GET /api/sprints`, `GET /api/reports/:id` (builds live from Jira), `PUT /api/sprints/:id/manual` (saves overrides, rebuilds, rewrites report files), `GET /api/export/pdf?sprint=`. Vite proxies `/api` to `:3001`. The dashboard loads `/report.json` (static file) when no sprint is selected, otherwise `/api/reports/:id`.

**PDF export:** `src/pdf/exportReportPdf.ts` drives headless Chromium (Playwright) to open the running dashboard at `DASHBOARD_URL/?print=1&sprint=<id>` and waits for `document.documentElement.dataset.pdfReady === "true"`. `dashboard/src/main.tsx` renders `print/PrintApp` (separate print layout using `pagedjs`, A4 landscape) instead of `App` in that mode. So PDF export requires the dashboard to be running, and print-layout changes go in `dashboard/src/print/`, not the regular components.

## Gotchas

- Backend imports use `.js` extensions (NodeNext module resolution) even for `.ts` sources.
- `src/config/env.js` is a tracked compiled artifact next to `env.ts`; edit `env.ts`.
- `output/` and `dist/` are gitignored; `dashboard/public/report.json` is tracked and gets rewritten on every report generation.
- Status names and labels in the Jira data are Russian (e.g. "Закрыто", "Ожидает выгрузки"); stats match on these literal strings.
