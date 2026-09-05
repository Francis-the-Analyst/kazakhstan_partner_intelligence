# Design: EN/RU language toggle for Kazakhstan Partner Intelligence

Date: 2026-09-05
Status: Approved by user, ready for implementation plan

## Goal

`proposal_A.html` (the only page routed in production per `vercel.json`/`README.md`)
must be fully readable in English and Russian, with a visible control on every
page/view that lets the end user switch language at any point. End users in
Kazakhstan include people who read only Russian, so this is a functional
requirement, not a nice-to-have.

Reference implementation: the sibling Baku project
(`paises/Baku/dashboard/src/lib/i18n.tsx` + `src/components/Header.tsx`) already
ships this exact feature for a React app. This design ports the same pattern
(flat translation dictionary, `localStorage`-backed language state, an
EN/RU pill toggle) to this project's vanilla HTML/CSS/JS stack, so the two
sites feel consistent to anyone who uses both.

Also bundled: replace the Projects channel's placeholder copy with the
English/Russian message the user approved earlier in this project
("Not required for this market at this moment. If needed, please contact
Francisco González, fgonzalez@cosentino.com.").

## Scope

- **In scope:** `proposal_A.html`, `app-core.js`, a new `i18n.js`, `base.css`
  (toggle styling), `proposal_A.css` if needed.
- **Out of scope:** `proposal_B.html` and `index_R_P.html` — per `README.md`
  these are reference-only, not routed in production, and the user's
  requirement is scoped to what the end user actually sees.
- **Not touched:** `data.js`. Its `RAW` dataset and the `KZ_PROSPECTS` contract
  (fields: `id,name,city,category,showroom,price,phone,email,priority,score,
  serviceBreadth,reason,website,address,brands,evidence,source,
  recommendedAction`) stay exactly as they are today, in English, because
  `tests/kz-data.test.mjs` asserts literal English values (e.g.
  `row.brands === 'Not evidenced in current research'`). Translation happens
  at render time, not in the data layer.

## Why render-time translation instead of translating the dataset

`reasonFor()` and `intelligenceFor()` in `data.js` do not produce 70 unique
free-text strings — they assemble each row's `reason`, `evidence`,
`recommendedAction` and `address` from a small, fixed set of template
fragments:

- `reason`: built from up to 3 clauses joined with `, `: an optional showroom
  clause (1 variant, present only when `showroom==='Yes'`), a category-fit
  clause (3 variants), and a price-positioning clause (3 variants) — 7
  distinct clause strings total across all rows.
- `evidence`: 7 known-brand sentences (Interstone, Maxxfine, Sole Mio, Italon,
  Kerama Marazzi, Poliform, Invogue/B&B Italia) + 1 fallback sentence when no
  brand match is found.
- `recommendedAction`: exactly 3 distinct final sentences (multi-material
  showroom pitch, category-led showroom pitch, no-showroom pitch).
- `address`: always the single constant fallback string (no row has a real
  captured address today).

So the actual translation surface is a **closed set of ~20 phrases**, not 70
records. `i18n.js` will contain a `PHRASE_MAP` (English → Russian) for exactly
these strings, split at the same granularity `reasonFor` uses (so the 3
reason clauses translate independently and recombine correctly for every
row). Brand names (Caesarstone, Poliform, B&B Italia, …), account names,
phone numbers, emails and URLs are proper nouns/contact data and stay
unchanged in both languages — this matches how Baku's dictionary only
translates prose, never identifiers.

If `PHRASE_MAP` is ever missing a phrase that a row actually produces, that
row's Russian dossier will silently show English inside otherwise-Russian
text. A test (see Testing) guards against this by translating every record
in the dataset and asserting no untranslated fragment remains.

## Architecture

### New file: `i18n.js` (loaded before `app-core.js`)

```js
window.KZ_I18N = {
  STORAGE_KEY: 'kz-lang',
  STRINGS: {
    // one entry per UI copy string, e.g.:
    landingLead: { en: 'From market visibility to the next partner conversation.',
                   ru: '...' },
    // ...
  },
  FIELD_LABELS: {
    // canonical English value -> {en, ru} display label, for values that are
    // rendered as text: city, category, priority, price, showroom
    city: { Almaty: { en: 'Almaty', ru: 'Алматы' }, Astana: {...}, Shymkent: {...} },
    category: { Hybrid: {...}, 'Interior design': {...}, Kitchen: {...}, Bathroom: {...} },
    priority: { High: {...}, Medium: {...}, Low: {...} },
    price: { High: {...}, 'Medium-High': {...}, Medium: {...} },
    showroom: { Yes: {...}, No: {...} }
  },
  PHRASE_MAP: {
    // exact English fragment -> Russian fragment, for the ~20 data-derived
    // template phrases described above (reason clauses, evidence sentences,
    // recommendedAction sentences, the address fallback, the
    // no-competing-brand fallback)
  }
};
```

Kept as a separate file (not folded into `app-core.js`) so the translation
content is easy for a non-engineer (Francisco González) to review or hand
to a translator later, without wading through app logic.

### Language state and toggle behaviour

- `state.lang` added alongside the existing `state.filters/sort/selectedId/route`
  in `bootKZApp`, initialised the same way theme already is:
  `localStorage.getItem('kz-lang') || 'en'`.
- A `t(key)` helper: `KZ_I18N.STRINGS[key][state.lang]`.
- A `label(kind, value)` helper: `KZ_I18N.FIELD_LABELS[kind][value][state.lang]`.
- A `phrase(text)` helper: returns `KZ_I18N.PHRASE_MAP[text]?.[state.lang] ??
  text` for `state.lang==='ru'`, or `text` unchanged for `'en'` — used to
  translate the assembled `reason`/`evidence`/`recommendedAction`/`address`
  strings coming from `data.js` without touching that file.
- Setting language: clicking an EN or RU pill button sets `state.lang`,
  persists to `localStorage`, then re-applies static copy and calls
  `render()` so all data-derived text updates too. Mirrors the existing
  `data-theme-toggle` handler at `app-core.js:275`.

### Static copy: `data-i18n` attributes

Every static translatable text node in `proposal_A.html` gets
`data-i18n="key"` (or `data-i18n-html="key"` for the few spots with inline
markup, e.g. the ownership line's `<strong>`). A `applyStaticStrings()`
function walks `[data-i18n]` and `[data-i18n-html]` and sets
`textContent`/`innerHTML` from `STRINGS`. Called once at boot and again on
every language switch.

### Dynamic copy generated in JS

Several blocks in `bootKZApp` currently build their markup **once at boot**
from hardcoded English arrays: `kpiLabels`, `viewDescriptions`,
`executiveContextMarkup`, the `ownershipMarkup`/`project-identity` insertion,
and the view-tab label rebuild (`$$('[data-view]').forEach(...)`). These
need to become **re-callable** functions (e.g. `renderChrome()`) invoked both
at boot and on language switch, reading their labels from `t()`/`STRINGS`
instead of literal English arrays. This is the one structural refactor to
`app-core.js` beyond adding the language plumbing.

`tableHTML`, `detailHTML`, `mapHTML`, `queueHTML` already re-run on every
`render()`, so they just need their literal strings and field values swapped
for `t()`/`label()`/`phrase()` calls — no extra re-callability work needed
there.

### `hasCompetitiveEvidence` — targeted fix

`app-core.js:34-40` currently detects "no evidence" by matching the *English*
fallback strings (`'not evidenced in current research'`,
`'no competing or comparable brand relationship is evidenced'`). Once display
text can be Russian, this string-matching approach silently breaks. Fix:
`intelligenceFor()`'s output already implies a boolean (whether `known.find`
matched) — but since `data.js` stays untouched, the check in `app-core.js`
switches to comparing against the *canonical English* constants (which are
always what's stored in `row.brands`/`row.evidence`, since data.js is
language-agnostic) rather than anything passed through `phrase()`. In other
words: `hasCompetitiveEvidence` keeps reading `row.brands`/`row.evidence`
directly (always English, pre-translation) — no functional change needed,
just confirming in code/tests that this check happens before `phrase()` is
applied for display.

### Toggle placement and style

A `.lang-toggle` pill matching Baku's `Header.tsx` `LangToggle`: a bordered
rounded container with two buttons, `EN` and `RU`, the active one filled with
the accent colour, the other muted. Added via static HTML (not JS injection,
for simplicity and so it's inspectable in `proposal_A.html` directly) in all
three page headers:

- `.landing-nav` (landing)
- `.project-grid > header` (projects)
- `.topbar nav` (retail), next to the existing theme toggle

Markup: `<div class="lang-toggle" role="group" aria-label="Language"><button
data-lang="en" aria-pressed="true">EN</button><button data-lang="ru"
aria-pressed="false">RU</button></div>`. Click handler added next to the
existing `data-theme-toggle` handler in the delegated `click` listener.

### CSV export

`CSV_FIELDS` labels and the translatable cell values (`category`, `priority`,
`price`, `showroom`) become language-aware: the header row uses
`t('csv...')` per field, and cell values run through `label()` where
applicable. Free-text cells (`reason`, `evidence`, `recommendedAction`,
`address`) run through `phrase()`. Proper-noun cells (`name`, `phone`,
`email`, `website`, `brands`, `source`) are exported unchanged. Filename
stays as-is (ASCII, unaffected by language).

### Projects placeholder message

Replace the current `<p>Under construction by Francisco González.</p>` line
in the `projects` page (`proposal_A.html`, `data-page="projects"`) with the
approved message, added to `STRINGS` as e.g. `projectsNotice`:

- EN: "Not required for this market at this moment. If needed, please
  contact Francisco González, fgonzalez@cosentino.com."
- RU: Russian translation of the same sentence, with the email kept as-is
  (not translated/transliterated).

## Testing

- `tests/kz-static.test.mjs` line ~17 currently asserts the literal string
  `'Under construction by Francisco González'` for **both**
  `proposal_A.html` and `proposal_B.html` in the same loop. Since the message
  changes only in `proposal_A.html`, this test splits into two: the shared
  contract tokens loop keeps running for both files minus that string, and a
  new/adjusted assertion checks the new message text in `proposal_A.html`
  only, while `proposal_B.html` keeps the old string (it is untouched).
- New test file `tests/kz-i18n.test.mjs`:
  - Asserts `proposal_A.html` contains the `.lang-toggle` markup in all three
    headers.
  - Loads `i18n.js` + `data.js` and, for every record in `KZ_PROSPECTS`,
    translates `reason` (split on `, `), `evidence`, `recommendedAction` and
    `address` through `PHRASE_MAP` and asserts the result contains no
    remaining ASCII English word run outside of proper nouns — concretely,
    asserts every distinct value the dataset actually produces for those four
    fields has a `PHRASE_MAP` entry (a coverage check, not a translation
    quality check).
  - Asserts `FIELD_LABELS` has an entry for every value in `KZ_META`
    (`cities`, `categories`, `priorities`, `prices`) plus `showroom` Yes/No.
- Existing `tests/kz-controller.test.mjs` and `tests/kz-data.test.mjs` are
  expected to keep passing unmodified, since `data.js`'s contract is
  unchanged and `app-core.js`'s exported `KZCore` functions keep the same
  signatures/behaviour (only their string literals move to `t()`/`label()`
  calls).

## Out of scope / explicitly not doing

- No changes to `proposal_B.html`, `index_R_P.html`, or their tests beyond
  what's needed to keep the split assertion above passing.
- No per-record Russian data added to `data.js`.
- No translation of brand names, account names, phone numbers, emails, or
  URLs.
- No third language, no automatic browser-locale detection — default is
  always English, matching the current site and Baku's default.
