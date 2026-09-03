# Adaptive City Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the positioning map fill its available width for one or two selected cities and suppress non-informative competitive dossier blocks.

**Architecture:** Keep the existing shared `app-core.js` controller used by both proposals. Normalise city state through small pure helpers, render lanes from the selected-city set, and pass the lane count to CSS through a custom property and data attribute. Generate the competitive block through a pure evidence predicate so the rule is independently testable.

**Tech Stack:** Static HTML, CSS Grid, browser JavaScript, Node.js built-in test runner, Playwright CLI for local and production verification.

**Spec:** `docs/superpowers/specs/2026-09-03-adaptive-city-map.md`

## Global Constraints

- Preserve the 70-account dataset and all existing prioritisation scores.
- Apply identical behaviour to Proposal A and Proposal B through `app-core.js` and `base.css`.
- Keep map dots faithful to potential score and at least 20 layout-distance units apart.
- Preserve keyboard interaction and accurate `aria-pressed` state.
- Do not show unsupported competitive claims.

---

### Task 1: Pure city-selection and evidence rules

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app-core.js`

**Interfaces:**
- Consumes: filter objects returned by `emptyFilters()` and prospect fields `brands` and `evidence`.
- Produces: `selectedCities(filters): string[]`, `mapCities(filters): string[]`, and `hasCompetitiveEvidence(row): boolean` on `window.KZCore`.

- [ ] **Step 1: Write failing tests**

Add assertions that an empty filter returns all three map cities, a two-city filter includes only those cities, `derive` includes both selected cities, and generic “Not evidenced” records return false while Interstone returns true.

- [ ] **Step 2: Run the focused test file and confirm failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because the new helpers do not exist and `derive` only accepts one city string.

- [ ] **Step 3: Implement the pure helpers**

Use an immutable city order constant. Accept both arrays and legacy strings in `selectedCities`, return all cities from `mapCities` only when the selected list is empty, and classify competitive evidence by rejecting empty text and case-insensitive “not evidenced” wording.

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/site.test.mjs`

Expected: PASS.

### Task 2: Adaptive map and accessible multi-select controls

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app-core.js`
- Modify: `base.css`

**Interfaces:**
- Consumes: `selectedCities`, `mapCities`, filtered rows, and existing `layoutPoints`.
- Produces: map element `data-city-count` and CSS variable `--city-count`; city filter buttons toggle independently.

- [ ] **Step 1: Add source-contract tests**

Assert that the map sets `--city-count`, CSS grid uses `repeat(var(--city-count,3),minmax(0,1fr))`, and city button state is determined by membership rather than scalar equality.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL against the static three-column implementation.

- [ ] **Step 3: Implement minimal adaptive rendering**

Render lanes from `mapCities(state.filters)`, set the lane count on every map container, toggle city values in canonical order, and synchronise all city `aria-pressed` attributes after KPI, reset, and filter actions.

- [ ] **Step 4: Implement responsive CSS grid**

Replace the fixed three-column definition with `repeat(var(--city-count,3),minmax(0,1fr))` and keep existing mobile height behaviour.

- [ ] **Step 5: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS.

### Task 3: Conditional competitive dossier

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app-core.js`

**Interfaces:**
- Consumes: `hasCompetitiveEvidence(row)`.
- Produces: competitive dossier markup only for supported account evidence.

- [ ] **Step 1: Add render-contract test**

Expose `competitiveBlockHTML(row)` and assert that a generic no-evidence record produces an empty string while Interstone produces the Competitive signal section and Caesarstone text.

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because the renderer is not exported.

- [ ] **Step 3: Implement conditional markup**

Build the section through `competitiveBlockHTML` and interpolate it into `detailHTML`; keep escaping on all dataset text.

- [ ] **Step 4: Run the complete automated suite**

Run: `npm test`

Expected: all tests PASS.

### Task 4: Browser verification and publication

**Files:**
- Verify: `proposal_A.html`
- Verify: `proposal_B.html`
- Verify: production URL

**Interfaces:**
- Consumes: validated static source.
- Produces: production behaviour matching the approved spec.

- [ ] **Step 1: Serve the site locally and verify both proposals**

Confirm zero selected cities render three lanes, Almaty renders one full-width lane, Almaty plus Astana renders two equal lanes, and map dots still open a dossier.

- [ ] **Step 2: Verify dossier evidence states**

Confirm MK Mebel omits Competitive signal and Interstone retains its documented competitive evidence.

- [ ] **Step 3: Run final tests and inspect the diff**

Run: `npm test` and `git diff --check`.

Expected: all tests PASS and no whitespace errors.

- [ ] **Step 4: Commit and push the validated source**

Commit only the plan, tests, controller, and stylesheet changes to `main`, then push to the configured origin.

- [ ] **Step 5: Verify production**

Poll the existing Vercel deployment and repeat the one-city, two-city, and dossier checks against `https://kazakhstan-partner-intelligence.vercel.app/proposal_A.html`.
