# Moves and Branching — Plan for the Move System and Practice Hub

The second working plan. Lesson 1 has a world view with editing, one author exercise, and one recall exercise — all hand-wired. This plan turns that hand-wired pair into the **move system**: data shape (manifest) + behavior (moves as code) + a **branching practice screen** that picks three eligible moves plus shuffle. Synthesis and the seed/tutorial phase are deferred to plan 03.

This is a working document. Each slice should take roughly one session. If a slice grows beyond that, split it.

## Context

After plan 01, lesson 1 is end-to-end on a single hardcoded path. Every exercise hardcodes its own choices, restatement strings, and eligibility rules — they live inline in `+page.svelte` files. That's fine for two exercises; it stops being fine the moment we want a third, fourth, fifth, or want the branching screen (LESSONS §6) to pick among them.

The fix is the shape sketched in [data_structure/01_lesson_data_shape.md](../data_structure/01_lesson_data_shape.md):

- A **lesson manifest** declares the lesson's fields, value sets, and editable surfaces.
- A **move** is a small code module under `src/lib/content/lessons/lesson_1/moves/` that reads world state through the query layer, declares its eligibility, and renders its exercise. Moves pull their option lists from the manifest, never hardcoding them.
- The **branching practice screen** asks every move whether it's eligible, picks three at random plus a shuffle button, and routes to whichever the learner chooses.

By the end of plan 02, lesson 1 has a working practice hub. The seed/tutorial phase and synthesis phase are not built yet — those are plan 03.

## How to use this plan

- Do one slice at a time. Do not start the next until the "Verify by hand" step passes.
- After each slice, write a 2–3 line note in the session log at the bottom: what you built, what surprised you, what you'd change.
- If something doesn't fit the plan as written, change the plan before changing the code.

## The rules that protect against drift

The two rules from plan 01 still hold:

1. **Read the actual database after each slice.** Verify supersession, source, and learner_id stamps directly in `local.db`.
2. **All db reads/writes go through `src/lib/server/world/*`.** Moves never call Drizzle directly. The manifest is content (TypeScript), not a database table — but every fact a move commits still routes through `world/facts.ts`.

One new rule for this plan:

3. **Moves never hardcode value lists.** A move that asks about nationality reads the option set from the manifest. If a `select` element in a move file has a literal array of countries, that's the smell.

Per decision 3.3 in the data shape doc, **textbook-protected-fields enforcement is not part of this plan and not part of the architecture.** The `source` column stays as provenance only; learner facts freely supersede textbook facts everywhere.

---

## Slice 1 — Manifest and the move shape (port add-classmate)

**Scope:** Establish `src/lib/content/` and the manifest. Port `add-classmate` to be the first move. Nothing visible changes for the learner yet.

Build:
- Create `src/lib/content/lessons/lesson_1/manifest.ts` matching the shape in [data_structure/01_lesson_data_shape.md §4.4](../data_structure/01_lesson_data_shape.md). Fields, value sets, editable surfaces. Manifest is exported as a plain TypeScript object; no DB table yet.
- Create a `Move` type in `src/lib/content/lessons/types.ts` capturing: `id`, `lesson`, `mode` (`'author' | 'recall' | 'negotiated'`), `leadingQuestionEn`, an `eligible(world)` function, a route path or render hook, and (for author moves) a `confirmation(facts)` function.
- Create `src/lib/content/lessons/lesson_1/moves/add_classmate.ts` exporting the move definition. The existing `/lessons/1/practice/add-classmate` route stays at the same URL but its `+page.server.ts` and `+page.svelte` now import option lists and restatement strings **from the manifest and move**, not from local constants.
- Refactor `/lessons/1/world` to import its editable-fields set and restatement templates from the manifest, not the inline hardcoded `Set` and switch statements.

Out of scope:
- A `lesson_manifests` DB table. The manifest is TypeScript content, loaded at module time. A table arrives only if we need to query manifests from SQL (we don't yet).
- A runtime that interprets moves generically. We're establishing the shape; the runtime grows in slice 5 when the branching screen needs it.
- Refactoring `recall-nationality` yet (that's slice 2).

**Verify by hand:**
- `npm run dev`, visit `/lessons/1/practice/add-classmate`, add a classmate. Everything works as before.
- Edit the manifest to add a tenth nationality (e.g. `'태국'`). Reload the page. The new option appears in the nationality select without touching any svelte or server code.
- Edit a cell on `/lessons/1/world`. The Korean restatement string is now coming from the manifest/move config, not inline.
- `sqlite3 local.db "select * from attribute_facts where source='learner' order by set_at desc limit 5"` confirms commits still route through `commitAttributeFact` correctly.

---

## Slice 2 — Port recall-nationality, add recall-year

**Scope:** Bring the second existing exercise into the move shape, then prove the shape generalizes by adding a near-identical move against a different field.

Build:
- Create `src/lib/content/lessons/lesson_1/moves/recall_nationality.ts`. Port the existing logic from `/lessons/1/practice/recall-nationality/+page.server.ts`: pick an eligible character (has the field, name doesn't contain `선생님`), build the prompt with the 은/는 marker, pull four options from the manifest. Eligibility = at least one non-professor character has a nationality fact.
- Create `src/lib/content/lessons/lesson_1/moves/recall_year.ts`. Same structure, different field. Prompt: `"X은/는 몇 학년이에요?"`. Options pulled from `manifest.fields.year.values`. Eligibility = at least one non-professor character has a year fact.
- The `/lessons/1/practice/recall-nationality` route remains as a direct-URL entry point (still usable for now). Add `/lessons/1/practice/recall-year` similarly. Both routes load via their move's render logic.
- Both moves share a small helper for "pick random eligible character + build shuffled choices." This helper lives in `src/lib/content/lessons/lesson_1/moves/_helpers.ts` (or similar) — the underscore signals it's a move-internal utility, not a move itself.

Out of scope:
- The professor-exclusion as a manifest-level concept. For now it's a string check on `선생님` inside the helper, with a comment pointing at the eventual cleaner fix (honorifics out of scope until the relevant lesson).
- Generalizing into a single parameterized `recall_attribute` move. Hand-write both first; parameterization can come if a third near-identical recall move arrives (per principle 6 in the data-shape doc).

**Verify by hand:**
- Both `/lessons/1/practice/recall-nationality` and `/lessons/1/practice/recall-year` work end-to-end.
- Recall-year skips Sandy (no year set) and excludes the professor.
- After editing a character's year via the world view, reload `/lessons/1/practice/recall-year` until that character appears as the target: the correct answer matches the freshly-edited value (un-superseded fact).

---

## Slice 3 — Negotiated-authoring move

**Scope:** First move of a new pattern — a character states a fact and asks the learner to confirm or push back. This is the LESSONS §4 "negotiated authoring" mode, the platform's most distinctive voice.

Build:
- Create `src/lib/content/lessons/lesson_1/moves/negotiate_nationality.ts`. Picks a non-professor character that **lacks** a nationality fact, OR (with low probability) picks one that has a nationality and proposes a wrong value for the learner to correct. Prompt: `"X은/는 일본 사람이에요?"` 네/아니요.
- 네 path:
  - If the character lacks a nationality, commit the proposed value as a learner fact.
  - If the character already has a fact matching the proposal, confirm with no write.
  - If the character already has a fact **not** matching, this branch is unreachable (we wouldn't have proposed it). The picker guarantees this.
- 아니요 path: open multiple choice (the same shuffled option set the recall move uses). Selected value commits via `commitAttributeFact`, which supersedes any existing fact automatically.
- All commits end with a Korean restatement pulled from the move's `confirmation` function, mirroring the add-classmate flow.
- Visually marked as **negotiated** — a third color/icon distinct from author and recall (LESSONS §4). Doesn't need polish; visibly distinct is enough.
- Route lives at `/lessons/1/practice/negotiate-nationality`.

Out of scope:
- A negotiated-year variant. The pattern is established; second variants come later.
- A picker that prefers characters with stale or untouched facts. Random among eligible is fine.
- Anything resembling LLM-generated prompts. Hand-written templates only.

**Verify by hand:**
- Add a classmate with no nationality set (skip the field — or use a one-off script to create one without committing the fact). The negotiated move proposes a nationality, 네 commits it, 아니요 opens the chooser.
- Delete the new fact via supersession (a one-off script) and re-run: the proposal sequence works again.
- `sqlite3 local.db "select entity_id, field, value, source, superseded_at from attribute_facts where field='nationality' order by set_at desc"` shows the negotiated path produces normal learner-sourced facts with proper supersession.

---

## Slice 4 — Shared-attribute move (the polymorphic one)

**Scope:** The canonical example from LESSONS §5 — one move template that switches between recall and author paths based on world state.

Build:
- Create `src/lib/content/lessons/lesson_1/moves/shared_attribute.ts`. Reads two non-professor characters X and Y at random and inspects the manifest's "focus attribute" (for lesson 1: nationality).
- Branches:
  - **Both X and Y defined and matching** → recall path. `"톰과 영미는 한국 사람이에요?"` 네/아니요 followed by multi-choice if wrong.
  - **Both defined and not matching** → move ineligible for this (X, Y) pair; the picker tries another pair or declares the move ineligible this round.
  - **Exactly one defined** → author path. Presupposition: they share the attribute. Confirm with 네 to write the missing one; 아니요 opens chooser for what it is instead.
  - **Neither defined** → two-stage author path. Set X's value first (multi-choice + restatement), then "and Y too?" yes/no for confirmation.
- The move's `eligible(world)` function returns true when at least one branch has a viable (X, Y) pair. Picking the pair happens at render time, not in `eligible` — `eligible` is a cheap precondition check, not a planner.
- Add a small helper in `_helpers.ts` for picking two distinct random non-professor characters.
- Route: `/lessons/1/practice/shared-attribute`.

Out of scope:
- A weighted picker that prefers branches the learner hasn't seen. Random branch among viable ones is fine.
- Multi-field shared attribute (e.g. year *or* nationality). Lesson 1 uses nationality only; the manifest declares a `focusAttribute` field, but it's just `'nationality'` for now.
- Generalizing the "negotiated yes/no" widget across `negotiate_nationality` and `shared_attribute`'s recall path. They're allowed to duplicate small bits of code until a third use forces extraction.

**Verify by hand:**
- Seed state: walk through every branch by editing world state to force each (matching pair, one-defined, neither-defined). Each branch renders correctly and commits correct facts where applicable.
- After a write via the move, `/lessons/1/world` shows the new fact. Re-running shared-attribute with the same pair now lands on the recall branch.
- Database check: every commit through this move has `source='learner'`, `setInLesson=1`, and proper supersession behavior.

---

## Slice 5 — The branching practice screen

**Scope:** A hub that asks each move's `eligible(world)`, picks three eligible moves at random, shows them as cards with their `leadingQuestionEn` as bait, and routes to whichever the learner taps. A fourth card is the **shuffle** button — re-rolls the three.

Build:
- Add a `src/lib/content/lessons/lesson_1/moves/index.ts` that re-exports all moves as an array. The branching screen imports this array.
- Create `/lessons/1/practice/+page.server.ts` whose `load` function:
  - Loads world state via the query layer (entities + attributes).
  - Calls each move's `eligible(world)`.
  - Returns the eligible move list (id, leading question, mode, route).
- Create `/lessons/1/practice/+page.svelte`:
  - Picks 3 eligible moves at random for the initial render.
  - Renders them as cards. Each card shows the leading question and is color/icon-coded by mode (author / recall / negotiated).
  - Shuffle button re-rolls (client-side, no server round trip needed since the eligible list is already loaded).
- Replace the placeholder hub at `/lessons/1` with a small redirect or two links: "Practice" (→ `/lessons/1/practice`) and "World" (→ `/lessons/1/world`).
- The direct-URL routes for individual moves (e.g. `/lessons/1/practice/recall-nationality`) remain functional as fallback / debugging surface.

Out of scope:
- The weighted picker (LESSONS §6 — missing attributes weight toward authoring, etc.). Random is fine for MVP and explicitly named as out of scope in §6.
- The notebook / narrative log. Post-MVP polish; the cards alone are enough.
- A "return to hub after completing a move" mechanic. The move's success state can just have a link back to `/lessons/1/practice`. Polish later.
- Seed/tutorial phase. Synthesis phase. Both are plan 03.

**Verify by hand:**
- Visit `/lessons/1/practice`. Three cards appear, each from a different move. The colors/icons differ for author / recall / negotiated.
- Tap shuffle several times. The three cards vary across runs but never include an ineligible move (e.g. shared-attribute with all attributes already set, or recall-year with no years set).
- Force ineligibility by editing world state (e.g. delete all years via supersession script) and confirm `recall_year` drops out of the rotation. Restore and confirm it returns.
- Complete a move via the hub. Return. The hub reflects the new world state — e.g. if the move filled the last missing nationality, `negotiate_nationality` may now be ineligible.

---

## What comes after these five slices

Plan 03 territory, listed so it's clear what's deferred:

1. The **seed / tutorial phase** for lesson 1 — hand-written narrative opening with Gary that introduces every question type in-character (LESSONS §3, §10).
2. The **synthesis phase** — 2–3 hand-written closing exercises, at least one production exercise (LESSONS §8).
3. **A lesson 2 stub manifest** that reads from lesson 1 state, proving cross-lesson persistence (LESSONS §9, TECH_STACK §10).
4. The **vocab corpus and hover-to-gloss lookup** (TECH_STACK §7). Probably its own slice — it's a separate concern from moves but a precondition for any text the learner reads.
5. The `relation_facts` table and its query-layer module — first really exercised in lesson 3 work, but the table itself can land earlier if needed.
6. Move parameterization — a generic `recall_attribute(field)` and `add_entity(kind, fields)` factory once enough hand-written moves exist to see the shape clearly (data-shape doc principle 6).
7. The **weighted move picker** that reads world state to bias the random pick (LESSONS §6 / §11).

A new plan file (`03_*.md`) gets written when slice 5 of this plan is done and the next chunk is clear.

---

## Session log

### Slice 1 — Manifest and the move shape (port add-classmate)
- New content tree: `src/lib/content/lessons/types.ts` (Move, LessonManifest, WorldState), `lesson_1/manifest.ts`, `lesson_1/moves/add_classmate.ts`. Manifest carries per-field `restate(value, attrs)` — the world-view editor and the move's `confirmation(facts)` both read from it, so a single source of truth for "how do we say this fact in Korean."
- `add-classmate/+page.svelte` now iterates `addClassmate.steps` generically (free-text vs choice driven by `step.kind`, options via `fieldOptions(field)`). Adding a step in the move file changes the UI with no svelte edits.
- World view's inline `EDITABLE_FIELDS` set + restatement switch are gone — both come from `lesson1Manifest`. `+page.server.ts` only exports `load` and `actions` (slice 3 gotcha avoided). `npm run check`: 0 errors.

### Slice 2 — Port recall-nationality, add recall-year
- `Move` became a discriminated union by `mode` (`AuthorMove | RecallMove`). RecallMove carries `field` + `prepare(world) => RecallQuestion`. `RecallQuestion` includes `successKr` so the "맞아요!" string is field-aware and produced by the manifest's `restate`, not hardcoded in the svelte.
- Added `src/lib/server/world/state.ts` with `loadWorld(learnerId): WorldState` — the first place we materialize a full WorldState from the query layer. Slice 5's branching screen will reuse it directly.
- `_helpers.ts` holds `charactersWithField`, `pickRandom`, `shuffle`, `buildChoices`, `isProfessor`. The professor exclusion is still a `선생님` substring check, with a comment marking honorifics as the eventual cleaner fix. recall-year and recall-nationality are now ~25 lines each, identical structurally; if a third recall move arrives we can parameterize.
- The recall +page.svelte is duplicated for now (year vs nationality). Both render `{name, prompt, options, correct, successKr}` — same shape. Extract to a shared component if a third lands.

### Slice 3 — Negotiated-authoring (negotiate-nationality)
- Added `NegotiatedMove` + `NegotiatedQuestion` to the union. The move's picker is: 80% prefer a lacker (target without the field), 20% pick a haver and propose a wrong value; fall back deterministically when only one pool is non-empty. `isCurrent` is included on the question even though it's always false today — it covers the LESSONS §4 "matches existing" no-write confirm case once weighted picking arrives.
- Both 네 (when not isCurrent) and 아니요-then-pick submit the same `?/commit` action with `{entityId, field, value}`. Reusing the same action for both paths kept the +page.server.ts minimal. The Korean restatement at the success step is computed **client-side** from the manifest's `restate` — same source as the world-view editor.
- The chooser excludes the proposal itself (don't offer the rejected value again) and picks 4 from the remaining pool. Plan says "the same shuffled option set the recall move uses" — close enough; if it matters we'll align on `buildChoices` later.
- Three modes now have three visible identities: blue=author, orange=recall, green (#6aa86a) badge=negotiated. Color picks are throwaway; the structural thing is that each move declares its mode and the svelte styles match.
