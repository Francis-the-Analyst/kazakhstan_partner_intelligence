# Adaptive City Map Design

**Approved:** 2026-09-03

## Objective

Use the complete positioning-map canvas when one or two cities are selected, while preserving the three-city overview when no city filter is active.

## Interaction contract

- City buttons are independent multi-select toggles.
- With no selected city, the map renders Almaty, Astana, and Shymkent in three equal lanes.
- With one selected city, the map renders only that city in one full-width lane.
- With two selected cities, the map renders only those cities in two equal lanes.
- With all three selected cities, the map renders the three selected lanes.
- Other filters affect the accounts inside a selected city but do not remove its lane.
- Reset and the complete-account KPI restore the unfiltered three-city view.
- Map dots retain their vertical potential score, collision-aware placement, showroom ring, keyboard focus, and dossier interaction.

## Prospect dossier contract

- Show Competitive signal only when captured research contains actual competitive or comparable-brand evidence.
- Hide the section when both the brand and evidence fields only state that evidence was not found.
- Preserve Recommended next action, contact links, account website, evidence source, and methodology note.

## Scope

The shared implementation must behave identically in Proposal A and Proposal B. No dataset values, prioritisation scores, routes, brand links, or visual themes are changed.
