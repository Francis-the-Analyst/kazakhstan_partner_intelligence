# Executive Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add live executive context and filtered CSV export without reducing dashboard functionality.

**Architecture:** Extend the shared `app-core.js` with pure summary and CSV functions, then inject one shared context component into each proposal at boot. Update values during the existing render cycle and use a scoped CSS layer for visual hierarchy and city-selection emphasis.

**Tech Stack:** Static HTML, CSS Grid, browser JavaScript, Blob downloads, Node.js built-in test runner, Playwright CLI.

**Spec:** `docs/superpowers/specs/2026-09-03-executive-context.md`

## Global Constraints

- Preserve all existing filters, views, KPI shortcuts, maps, tables, dossiers, routes, and themes.
- Do not represent 3 September 2026 as the research date.
- Export only the currently filtered rows.
- Keep all dynamic text accessible and all actions keyboard operable.

---

### Task 1: Pure executive-summary and CSV helpers

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app-core.js`

**Interfaces:**
- Produces: `executiveSummary(rows, filters)`, `prospectsCSV(rows)`, and `exportFilename(filters)` on `window.KZCore`.

- [ ] Write failing tests for all-city and selected-city summaries, Excel-safe CSV content, and city-scoped filenames.
- [ ] Run `node --test tests/site.test.mjs` and confirm the new tests fail because the helpers do not exist.
- [ ] Implement the three pure helpers with canonical city ordering and escaped quoted CSV fields.
- [ ] Run `node --test tests/site.test.mjs` and confirm all tests pass.

### Task 2: Context strip, interaction guidance, and selected-city emphasis

**Files:**
- Modify: `app-core.js`
- Modify: `base.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `executiveSummary(rows, filters)` during `render()`.
- Produces: `[data-executive-context]`, live metric targets, `[data-export-csv]`, and `.map-guidance`.

- [ ] Add source-contract tests for the context component, export action, date wording, guidance, and selected-city CSS selector.
- [ ] Run the focused tests and confirm failure.
- [ ] Inject the component once per positioning panel during boot and update its contents during every render.
- [ ] Implement the CSV download using Blob and a temporary anchor, then revoke the object URL.
- [ ] Add responsive context-strip styling and a signal-colour selected state scoped to city buttons.
- [ ] Run `npm.cmd test` and confirm all repository tests pass.

### Task 3: Visual verification and production deployment

**Files:**
- Verify: `proposal_A.html`
- Verify: `proposal_B.html`
- Verify: production URLs

**Interfaces:**
- Consumes: validated shared source.
- Produces: deployed executive context and downloadable filtered CSV.

- [ ] Verify locally that all-city, one-city, two-city, and additional-filter states update the strip correctly.
- [ ] Verify the CSV download contains the displayed number of prospects and opens with the expected headers.
- [ ] Inspect Proposal A and Proposal B at desktop width and verify zero console errors.
- [ ] Run `npm.cmd test`, the 19 historical tests, and `git diff --check`.
- [ ] Commit and push the exact validated files to `main`.
- [ ] Verify the Vercel deployment serves the new controller and repeat the production interaction checks.
