# Kazakhstan Partner Intelligence

Executive-facing static web experience for prospect prioritisation across the Kazakhstan retail and projects channels.

## Entry points

- `/` and `/proposal_A.html` — Executive Intelligence (the approved corporate/light interface)
- `/proposal_B.html` — Market Command Center, a visual alternative kept for review only.
- `/index_R_P.html` — design-review selector for the two proposals; it is not the production root.

`proposal_B.html` and `index_R_P.html` (the earlier dark alternative and its selector) remain in the
repository for reference but are no longer routed in production.

Both proposal pages use the same `data.js` dataset and `app-core.js` interaction layer, so the
retail filters, map, account dossiers, shortlist, coverage view, competitive evidence and CSV export
stay functionally aligned. Only Proposal A is exposed through the Vercel root rewrite.

The application is built with local HTML, CSS and JavaScript assets and requires no build command.

Market research and dashboard created by **Francisco González**.
