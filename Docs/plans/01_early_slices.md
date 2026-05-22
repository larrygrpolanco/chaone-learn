# Early Slices — Plan for the First Working Lesson

A plan for the very first stage of the project. The goal is to get to a single hand-wired lesson 1 path with real persistence, in small chunks that can each be coded and then checked by hand before moving to the next.

This is a working document. Each slice should take roughly one session. If a slice grows beyond that, split it.

## How to use this plan

- Do one slice at a time. Do not start the next until the "Verify by hand" step passes.
- After each slice, write a 2–3 line note at the bottom of this file: what you built, what surprised you, what you'd change. That becomes the decision log.
- If something doesn't fit the plan as written, change the plan before changing the code.

## The rules that protect against drift

Two rules that matter most when working with AI assistance:

1. **Read the actual database after each slice.** `sqlite3 dev.db "select * from attribute_facts"`. Don't trust the UI to tell you the data shape is right. The fact log is subtle (`superseded_at`, `source`, `learner_id`) and bad rows often render fine.
2. **All db reads/writes go through `src/lib/server/world/*`.** If a `+page.server.ts` calls Drizzle directly, that's a smell. The invariants (textbook protection, auto-supersede on conflict) live in the query layer and only work if everything routes through it.

---

## Slice 1 — Skeleton you can see

**Scope:** SvelteKit project up, Drizzle wired to SQLite, a page that lists entities.

Build:
- SvelteKit + TypeScript project in repo root.
- Drizzle + `libsql` (local SQLite file at `dev.db`).
- `src/lib/server/db/schema.ts` with `learners` and `entities` tables only (see TECH_STACK.md §4).
- Migration generated and run.
- A seed script (`scripts/seed.ts` or similar) that:
  - Creates one dev learner with a fixed ID like `dev_learner`.
  - Inserts the six lesson 1 textbook characters as entities (Steve, Yumi, Michael, Sophia, Lisa, Professor Lee).
- A route `/lessons/1/world` whose `+page.server.ts` reads entities for the dev learner and renders a plain `<ul>` of names.

Out of scope:
- Any attributes (no nationality yet).
- The query layer abstraction. For this slice only, the page can import the db directly. We add `src/lib/server/world/entities.ts` in slice 2 once there's a second consumer.
- Styling beyond what makes the page readable.

**Verify by hand:**
- `npm run dev`, visit `/lessons/1/world`, see six names.
- `sqlite3 dev.db "select id, kind, source from entities"` shows six rows with `kind='character'` and `source='textbook'`.

---

## Slice 2 — Attributes round-trip

**Scope:** The fact log starts existing. World view becomes a table with columns.

Build:
- Add `attribute_facts` table to the schema (TECH_STACK.md §4). Generate + run migration.
- Create `src/lib/server/world/facts.ts` with two functions:
  - `commitAttributeFact(learnerId, entityId, field, value, source, lessonId)` — supersedes any existing un-superseded fact on `(entityId, field)` and inserts a new row.
  - `listAttributesForEntity(learnerId, entityId)` — returns `{ field: value }` for all un-superseded facts.
- Extend the seed script: write nationality and year facts for all six textbook characters, with `source='textbook'`, `setInLesson=1`.
- Update `/lessons/1/world` to render a table: rows are characters, columns are name / nationality / year. Reads via the query layer.

Out of scope:
- Editing from the UI.
- Author or recall exercises.
- Relations (no `relation_facts` table yet — we add it when lesson 3 work begins).

**Verify by hand:**
- World view shows six rows × three columns, filled.
- `sqlite3 dev.db "select entity_id, field, value, superseded_at from attribute_facts"` shows ~12 rows, all with `superseded_at IS NULL`.
- Manually run `commitAttributeFact` again for one character's nationality with a different value (in a one-off script or REPL). Re-run the select: the old row should now have a `superseded_at` timestamp, and a new row should exist with the new value and `superseded_at IS NULL`. The world view should show the new value on refresh.

---

## Slice 3 — One author exercise

**Scope:** First moment of writing to the world from the UI.

Build:
- A route `/lessons/1/practice/add-classmate` that walks through three steps:
  1. Name input (free-text).
  2. Multiple-choice nationality (a small fixed list of lesson 1 countries).
  3. Multiple-choice year (1학년 through 4학년).
- On submit: create a new entity with `source='learner'`, then commit two attribute facts.
- A Korean restatement step at the end (LESSONS.md §4 invariant 2): "톰은 베트남 사람이에요. 1학년이에요." Then "Confirm" or "Edit."
- Mark the page visually as an *author* exercise (a color band, an icon, a label like "Author" in the prompt). Doesn't need to be polished — just visibly distinct from anything labeled "Recall" later.

Out of scope:
- Branching practice screen or move picker.
- Language-axis feedback (we're not checking spelling or particles yet).
- Skip/back navigation polish.

**Verify by hand:**
- Add a classmate. Bounce back to `/lessons/1/world`. The new row appears with the chosen attributes.
- Database check: one new row in `entities` with `source='learner'`, two new rows in `attribute_facts` with `source='learner'` and `setInLesson=1`.
- Try adding another classmate. Both should appear.

---

## Slice 4 — One recall exercise

**Scope:** Reading from world state, with feedback for wrong answers.

Build:
- A route `/lessons/1/practice/recall-nationality` that picks one character at random and asks "X 씨는 어느 나라 사람이에요?" with four multiple-choice options. The correct answer is pulled from the world via the query layer.
- Wrong answer: the choice greys out and shakes; learner tries again. No score, no consequence.
- Right answer: brief confirmation, then either "next" or back to a hub.
- Visually marked as a *recall* exercise — distinct from author.

Out of scope:
- A real exercise hub. For now, a tiny `/lessons/1` index page with two links is enough.
- Language-axis errors on typed input (this exercise is multiple choice).

**Verify by hand:**
- The recall picks among both textbook and learner-added characters.
- The right answer is always the one currently in `attribute_facts` with `superseded_at IS NULL`.
- After Slice 5, edit a character's nationality through the editing interface and confirm the recall question now asks the new value.

---

## Slice 5 — The editing interface (safety valve)

**Scope:** Direct editing of world state from the world view. This is the LESSONS.md §7 safety valve — and worth having early because it makes every later slice safer to test.

Build:
- Make cells in the `/lessons/1/world` table clickable.
- Clicking opens a small inline editor (input for text fields, select for enums).
- Save:
  - Calls a form action that commits the change via `commitAttributeFact` with `source='learner'`.
  - Shows a Korean restatement of the new value as confirmation before committing.
- Add a delete option per row: removes a learner-added character (textbook characters cannot be deleted — surface this as a disabled button with a tooltip).

Out of scope:
- Per-field permissions beyond "textbook entities can't be deleted." Real textbook-protected-fields enforcement comes with the lesson manifest in a later slice.
- Bulk edits, undo, history view.

**Verify by hand:**
- Edit a nationality. New fact appears with `superseded_at IS NULL`, old fact gets a timestamp. World view refreshes with new value.
- Delete a learner-added character. The entity row is removed (or marked deleted — decide which during the slice, log the decision). Their attribute facts handle gracefully.
- Try to delete a textbook character: button is disabled.

---

## What comes after these five slices

These are out of scope for *this* plan, but listing them so it's clear what's deferred and roughly in what order:

1. The lesson manifest table + textbook-protected-fields enforcement at write time.
2. The first "move" as code in `src/lib/content/lessons/lesson_1/moves/`.
3. The branching practice screen with three eligible moves + shuffle.
4. The seed phase (hand-written tutorial with Gary).
5. The synthesis phase.
6. `relation_facts` table (arrives with lesson 3 work).
7. The vocab corpus and hover-to-gloss lookup.

A new plan file (`02_*.md`) gets written when slice 5 is done and the next chunk is clear.

---

## Session log

### Slice 1 — Skeleton
- SvelteKit + Drizzle + libsql were already scaffolded under `app/`; the starter `task` table got replaced with `learners` + `entities`. Everything in this project lives under `app/`, not the repo root — run all npm/drizzle/sqlite commands from there.
- DB file is `local.db` (from `.env`), not `dev.db` as drafted above. Update any future slice copy accordingly.
- Added `npm run db:seed` (`node --env-file=.env --import tsx scripts/seed.ts`). Idempotent via `onConflictDoNothing`. tsx is already in node_modules — no install needed.

### Slice 2 — Attributes round-trip
- Had to extend the svelte-kit TS `include` in `svelte.config.js` to cover `../scripts/**/*.ts` so seed scripts type-check. Without it, `process` etc. show as unknown.
- Supersession round-trip verified end-to-end: superseded Steve's nationality via a one-off script, confirmed old row got `superseded_at`, new row stayed current, and the world view rendered the new value on refresh.
- Sandy's `year` deliberately left blank in seed — natural author opportunity. Worth replicating the pattern in future lesson seeds.

### Slice 3 — Author exercise (add-classmate)
- SvelteKit `+page.server.ts` only allows specific named exports (`load`, `actions`, etc.). Hoisted option lists (`nationalities`, `years`) had to be local consts, not exports. First attempt 500'd.
- Added `src/lib/korean.ts` with `hasBatchim` + `topicMarker` (은/는) — used for restatement and recall prompts. Pure jamo math on the syllable codepoint; no dependency.
- Per user feedback during this slice: store **short referential names** (`스티브`, `영미`, `마이클`, `샌디`) — full names are awkward when reused as a subject every utterance. `이 선생님` kept because the title is how she's addressed. Logged thought: a future `role`/`title` attribute is probably better than parsing names.

### Slice 4 — Recall exercise (recall-nationality)
- Excluded the professor (`name` contains `선생님`) from the recall pool because the natural form `이 선생님은 어느 나라 사람이세요?` needs honorifics that lesson 1 grammar doesn't cover. Cleaner than introducing honorifics or carrying a special case. Same lesson likely applies to other roles as they arrive — exclude from pool, don't special-case.
- SvelteKit SSR encodes page data with **devalue** (unquoted JS object literals like `{name:"톰"}`), not JSON, so any verification script that greps for `"name":` will miss. Use `name:"..."` patterns instead.
- Confirmed the recall reads the live un-superseded fact: superseded Steve's nationality to `영국`, sampled until Steve appeared, page returned `correct:"영국"`.

### Slice 5 — Editing interface (safety valve)
- Chose **soft delete** (`entities.deleted_at`) over hard delete. Keeps attribute_facts history intact and matches WORLD/LESSONS "never destructively change the world." `listEntitiesByKind` filters `isNull(deletedAt)`.
- Per decision 3.3 (no canon protection), editing Steve's nationality via the UI succeeds — only the **delete** button is differentiated by `source` (textbook = disabled). Re-confirm this is still the right call when synthesis/seed phases need a stricter canon for any reason.
- Inline edit uses a two-step modal: input/select → Korean restatement → "맞아요" commits, "고쳐요" goes back. Restatement strings are hardcoded per field (`이름이 X이에요.` / `X은/는 Y 사람이에요.` / `X은/는 Y이에요.`) — when LESSON manifests arrive, these should move into the manifest or move file, not a route file.

### Cross-cutting notes for future plans
- The query layer rule (all DB I/O through `src/lib/server/world/*`) held cleanly. Worth keeping strict — relations and any new entity types should land in `world/relations.ts` etc., never in `+page.server.ts`.
- Korean values throughout. Every helper that produces Korean from data (markers, restatements) becomes part of the language axis; group them in `src/lib/korean.ts` and `src/lib/content/...` once we have a few more.
- Smoke testing via `curl` + `sqlite3` worked well for every slice. Treat the database as the source of truth, not the rendered HTML — verifying both caught nothing wrong but built the habit.
- Test classmates added during smoke tests linger in `local.db`. Cleanup script worth writing if this recurs: `delete from attribute_facts where source='learner'; delete from entities where source='learner';` followed by a soft-restore of any superseded textbook facts. Could become a `db:reset-learner` script.
