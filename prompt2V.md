# Prompt2V — Kazakhstan Partner Intelligence

Create two polished, fully functional, local-first web proposals for the Cosentino Executive Committee. The product is an English-only commercial intelligence database containing exactly 70 prospects in Almaty, Astana and Shymkent. Its purpose is to identify, filter, position and prioritise potential partners with whom Cosentino does not currently work.

The only entry point is `KZ_retail_proyect/index_R_P.html`. It must compare and link to `proposal_A.html` (Executive Intelligence, recommended) and `proposal_B.html` (Market Command Center). Both proposals begin with a Kazakhstan Partner Intelligence landing view. `Retail intelligence` opens the full database. `Projects intelligence` opens a restrained state reading exactly: `Projects intelligence — Under construction by Francisco González.`

Preserve all source values from `kazakhstan_Point_of_Sales/index.html`. Both Retail experiences must provide city, category, showroom, priority and free-text contact search; result counts; sortable prospect records; positioning map; priority queue; selected-prospect dossier; filter reset; theme control; landing return; and proposal switching. All views use one synchronised filtered dataset. Do not invent revenue, conversion, exclusivity or pipeline metrics.

Proposal A, Executive Intelligence, is a bright, premium executive briefing: mineral white, carbon, graphite and controlled blue; asymmetric grid; large primary positioning map; persistent filter rail; priority shortlist; detailed records and a refined side dossier. Proposal B, Market Command Center, is a dark, spatial, immersive intelligence field: charcoal, steel, cool white and restrained signal cyan; dominant opportunity map; contextual filters; target queue; records view and contextual dossier. They must be structurally different, not colour skins.

Create impact through information hierarchy and purposeful motion, not Cosentino product or project imagery. Motion consists of one orchestrated entry and functional feedback only. Copy is concise, factual and action-oriented, consistently using prospects, accounts, partners, priority and opportunity—not customers.

Meet accessibility requirements: semantic HTML, keyboard access, visible focus, labelled map targets, no status by colour alone, sufficient contrast, Escape to close dossiers and `prefers-reduced-motion`. Make both layouts responsive at 390×844, tablet, 1440×1000 and large presentation screens. Core functionality must work offline from `file://`, without packages, a server, build step, remote scripts or network access.

Verify dataset integrity with `node --test tests/kz-data.test.mjs`, controller behaviour with `node --test tests/kz-controller.test.mjs`, static contracts with `node --test tests/kz-static.test.mjs`, then test both complete workflows in a browser at desktop and mobile sizes.

## Authority, navigation and brand layer

Display `Market research & dashboard by Francisco González` prominently on the landing screen and inside the Retail dashboard, with **Francisco González** in bold. The Cosentino wordmark always links to `https://www.cosentino.com/`. Make `Kazakhstan · Partner Intelligence` more prominent in the dashboard header.

Provide compact navigation buttons for `Positioning map`, `Account list`, `Priority shortlist`, `Coverage`, and `Competitive landscape`. Filters must use professional toggle chips—not select menus—for city, profile, priority, and showroom availability. A selected chip can be deselected. Showroom availability is a primary decision signal because confirmed physical locations can display Cosentino samples and materials; reflect it in the KPI area, filters, map markers, account list and dossier.

Add a compact landing-page brand strip with locally stored official imagery and external links: Silestone (`https://www.cosentino.com/en-gb/colours/silestone`), Dekton (`https://www.cosentino.com/en-gb/colours/dekton`), Eclos (`https://www.cosentino.com/en-gb/colours/eclos`) and Sensa (`https://www.cosentino.com/en-gb/colours/sensa`). The strip must support the interface rather than compete with the Retail and Projects channel choices.
# Approved interface revision

- On the landing screen and every channel screen, place `Market research & dashboard created by **Francisco González**` immediately after the linked COSENTINO identity in the top header.
- Use deterministic collision management on every positioning map. Keep points faithful to their scores and verify a minimum 20 px centre-to-centre distance at the reference desktop size after every filter update.
- Selecting any map point, shortlist item or table row opens a right-side dossier with profile, showroom, positioning, contacts, website, address, comparable/competitive brands, evidence source and recommended next action.
- Never invent missing intelligence. Use `Not evidenced in current research` and visually separate verified evidence from commercial recommendations.
- Expand the five intelligence views into a full-width navigation band. Each module needs an index, title, short description and active/action signal; do not leave them as small tabs clustered beside unused space.
- Make each KPI card keyboard-accessible and actionable: total opens the complete list, high priority opens the filtered priority list, showroom opens display-ready partners, and cities opens Coverage.
