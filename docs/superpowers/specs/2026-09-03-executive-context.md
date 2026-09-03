# Executive Context Design

**Approved:** 2026-09-03

## Objective

Improve executive readability without hiding or removing any dashboard capability.

## Experience contract

- Add a compact context strip directly above every positioning map.
- Show the active city scope, filtered prospect count, high-priority count, and confirmed-showroom count.
- Update the strip immediately after every filter, KPI shortcut, or reset.
- Label the interface update date as `Dashboard updated · 3 September 2026`; do not imply that every research source was refreshed on that date.
- Add a concise instruction explaining that map points open complete account dossiers.
- Strengthen the selected state of city buttons without changing the state of other filter groups.
- Add CSV export for the currently filtered account set, including evidence and recommended-action fields.
- Keep Proposal A and Proposal B functionally identical through the shared controller and stylesheet.

## Export contract

- Export the rows in their current filtered and sorted order.
- Use UTF-8 with BOM for reliable opening in Excel.
- Quote every field and escape embedded double quotes.
- Include account, city, profile, priority, potential index, showroom, price position, service breadth, address, phone, email, website, competitive brands, competitive evidence, recommended action, and evidence source.
- Name the file using the active city scope and dashboard date.
