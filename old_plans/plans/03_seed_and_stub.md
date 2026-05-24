# Seed and Lesson 2 Stub — Plan 03

The third working plan. Plans 01 and 02 (plus the 02.5 realignment) gave us a working practice loop: nine moves, a branching hub, two-color writes/reads, return-to-practice after every answer, and an empty starting class. What's missing before lesson 1 is a *lesson* and not just a sandbox: the **seed/tutorial phase** that opens it (LESSONS §3, §10), and proof that the data model carries across lessons (LESSONS §9, TECH_STACK §10).

Synthesis is **deferred to its own plan.** The intended shape — LLM-assisted assessment as a conversation with characters from the world, or a quiz drawn from world state — is big enough to deserve its own thinking time and isn't blocked by anything here. Plan 04 will likely be a UI cleanup pass; synthesis lands after that.

This is a working document. Each slice should take roughly one session. If a slice grows beyond that, split it.

## Context

The practice hub works but has no front door. A learner who lands on `/lessons/1/practice` with an empty class sees one eligible move (`add_student`) and no narrative reason to engage. The seed phase is the narrative reason — it introduces Gary (the textbook's first character / lesson 1's narrator) and walks the learner through one author moment, one recall moment, and one update moment **in-character**, before depositing them in the branching hub with a populated world.

The lesson 2 stub is cheap insurance against a latent persistence bug. Per TECH_STACK §10 and LESSONS §9, we want the smallest possible proof that lesson 2 can read from lesson 1's world state. No moves, no content — just a route that renders "here's what you've built" from the manifest+query layer crossing the boundary.

## How to use this plan

- Do one slice at a time. Do not start the next until the "Verify by hand" step passes.
- After each slice, write a 2–3 line note in the session log at the bottom: what you built, what surprised you, what you'd change.
- If something doesn't fit the plan as written, change the plan before changing the code.

## The rules that protect against drift

The three rules from plans 01 and 02 still hold:

1. **Read the actual database after each slice.** Verify supersession, source, and learner_id stamps directly in `local.db`.
2. **All db reads/writes go through `src/lib/server/world/*`.** The seed commits route through `commitAttributeFact` etc. like everything else — no inline Drizzle in `+page.server.ts`.
3. **Moves never hardcode value lists.** Option sets come from the manifest. Seed steps are not moves, but they follow the same rule: nationalities, years, restatement strings all come from `lesson1Manifest`.

One thing the seed *is* allowed to do that moves aren't: hand-write narrative prose between steps. The seed is the lesson's voice. Polish it; don't generalize it prematurely.

---

## Slice 1 — Seed shell and Gary

**Scope:** A `/lessons/1/seed` route that exists, is visually/tonally distinct from `/practice`, and renders Gary as a narrator. No question types yet.

Build:
- New route `/lessons/1/seed/+page.server.ts` + `+page.svelte`. The server load returns `{ step }` where step is a number (or named token) tracked in a URL search param like `?step=1`. The svelte renders the current step's content. Server-side step state for now — no client store, no DB column.
- Visual treatment distinct from practice: a different background color or wash, more vertical space, a single column of narrative text + a single response control at a time. This is the LESSONS §3 "visually and tonally distinct" promise.
- Step 1 is just Gary introducing himself in Korean — short, in-vocabulary, hand-authored prose. He says hello, says his name (저는 게리예요), and a "다음" button advances to step 2 which for now just says "(seed continues in slice 2)".
- New `src/lib/content/lessons/lesson_1/seed/` folder. The seed is content like moves are — `seed/index.ts` exports an ordered array of step definitions, each step a small object with its prompt text and the kind of response it expects. Start with one step type (`'narrative'` — narrative-only, advance button) and grow the union in later slices.
- Add a "begin" link from `/lessons/1` to `/lessons/1/seed` so the front door is wired.

Out of scope:
- Any of the actual question types. Slices 2–4 add author / recall / update beats.
- A seed-completion flag on the learner. Slice 5 handles handoff to practice.
- Letting the learner skip back to a previous step. Linear forward only for now.

**Verify by hand:**
- `/lessons/1/seed` renders Gary's intro. "다음" advances to the placeholder. URL reflects the step.
- Visual treatment is obviously different from `/practice` — no card grid, narrative voice.
- Nothing has been committed to the DB. `sqlite3 local.db "select count(*) from attribute_facts where source='learner'"` is unchanged.

---

## Slice 2 — Seed introduces the author beat

**Scope:** Within the seed, Gary asks the learner to add the first classmate. This is the LESSONS §10 "tutorial introduces every question type in-character" — the author type first.

Build:
- Extend the step type union with an `'author_add_student'` step. Gary's prose sets up the moment in-character ("우리 반에 다른 학생도 있어요. 누구예요?" or similar — hand-authored, in lesson 1 vocab).
- The step renders the same three-step author flow `add_student` + `set_nationality` + `set_year` already use, **but inline within the seed** — no navigation to `/practice/add-student`. The seed step composes the three commits as one beat.
- The commits route through the same `commitAttributeFact` and entity-creation calls the moves use. No new query-layer functions.
- After commit, Gary restates in Korean ("아, X은/는 한국 사람이에요. 1학년이에요. 반가워요.") and advances. The restatement composes from the manifest's `restate(field, value)`.

Out of scope:
- A way for the seed to reuse the existing move's `+page.svelte` directly. The seed is its own surface; some duplication of the three-step UI is fine. If it gets painful, slice 4 or 5 extracts a shared component.
- Letting the learner add multiple students in this beat. One student here; the practice phase is where they add more.

**Verify by hand:**
- Walk through the author beat. A new entity appears in `entities` with `source='learner'`. Two new `attribute_facts` rows (nationality + year), both with `source='learner'`, `setInLesson=1`, `superseded_at IS NULL`.
- Gary's restatement uses the same Korean templates the world view and moves use.
- Reload mid-beat — the URL step is the source of truth, the learner can resume.

---

## Slice 3 — Seed introduces the recall beat

**Scope:** Once one classmate exists, Gary asks a recall-shaped question about them in-character.

Build:
- Add a `'recall_inline'` step type. The step config names which field (`'nationality'` for lesson 1's first recall beat) and the seed runtime picks the most recently added learner character as the target.
- Gary asks `"X은/는 어느 나라 사람이에요?"` with four multiple-choice options pulled from the manifest, same shape as `recall_nationality`. Wrong answer → shake + grey out + retry (existing pattern). Right answer → Gary confirms ("맞아요!" + restatement) and advances.
- Reuses the `buildChoices` helper from `moves/_helpers.ts`. The seed importing from the moves' helpers is fine — both are content.

Out of scope:
- A recall beat for `year` as well. One recall beat is enough to introduce the type; the practice phase has both.
- A negotiated/update beat here. Slice 4.

**Verify by hand:**
- After the slice 2 author beat, the recall beat asks about the just-added student. The correct answer matches the value the learner committed.
- Wrong answer triggers the existing shake/grey behavior (or a seed-local equivalent — log the decision in the session note).
- No DB writes happen during the recall beat itself.

---

## Slice 4 — Seed introduces the update beat

**Scope:** Gary proposes a fact about the new classmate and asks the learner to confirm or push back. This introduces the platform's distinctive "negotiated" voice (LESSONS §4, surviving 02.5 as the `update` variant).

Build:
- Add an `'update_inline'` step type. Gary picks a field that's already set on the new student (e.g. nationality) and asks `"X은/는 일본 사람이에요?"` — naming a *different* value than the one on file. 네/아니요.
- 네 path: would overwrite. The seed never actually wants this branch to overwrite incorrectly, but per the 02.5 invariant audit, we don't dress authoring as a test. So: if the learner says 네, commit the proposed value (it's their choice; the platform doesn't say their imagination is wrong). Gary confirms and advances.
- 아니요 path: chooser opens with the manifest's nationality options, learner picks, commit supersedes, Gary confirms and advances.
- Either way, this is the third question type introduced in-character. The seed is now narratively complete.

Out of scope:
- Proposing the *current* value as a confirm-with-no-write path. That's a richer negotiated pattern; one shape is enough for the tutorial.
- Adding more beats. Three types (author, recall, update) cover what's in practice.

**Verify by hand:**
- Walk both 네 and 아니요 paths (run the seed twice). In both cases the resulting fact in `attribute_facts` reflects what the learner chose, with proper supersession of the prior fact.
- The Korean prompt uses the manifest's `restate` template for naming the proposed value.
- The seed reaches a final step after this beat.

---

## Slice 5 — Seed → practice handoff and re-entry

**Scope:** Finishing the seed deposits the learner at `/lessons/1/practice` with the world they've built. Re-entering the seed is allowed (LESSONS §3 "return to seed at any time").

Build:
- The final seed step is a narrative wrap from Gary ("우리 반을 더 만들어요" or similar) with a single "연습으로" link to `/lessons/1/practice`.
- The `/lessons/1` index page shows two entry points: "Seed" (→ `/lessons/1/seed?step=1`) and "Practice" (→ `/lessons/1/practice`). World view link stays.
- Re-entering the seed at step 1 walks through Gary's intro again. Steps that would create duplicates (the author beat especially) need a guard: if the most-recently-added learner character was created in this seed run, skip the author beat. Simplest heuristic: stash a `seedRunId` in the URL and have the author beat check whether *any* learner character exists; if yes, skip with a one-line Gary acknowledgment ("우리 반에 학생이 있어요").
- The world view is reachable from the seed via a small link in the header, same as it is from practice.

Out of scope:
- A "first time vs. returning" flag on the learner. Per-run heuristics are enough for MVP.
- A seed-progress indicator (3/4 steps, etc.). The narrative pace is the indicator.
- Polishing the visual handoff between seed and practice. UI cleanup is plan 04.

**Verify by hand:**
- First run end-to-end: open `/lessons/1`, click Seed, walk through all four beats, land in `/lessons/1/practice` with at least one classmate, click around the practice hub.
- Re-enter the seed: Gary's intro runs again, author beat is skipped (or acknowledges existing students), recall and update beats run against existing world state.
- World view from inside the seed: clickable, shows the current state, link back to seed works.

---

## Slice 6 — Lesson 2 stub manifest

**Scope:** The cheap insurance. Lesson 2 doesn't exist as content yet, but a manifest and a route prove the data model carries.

Build:
- Create `src/lib/content/lessons/lesson_2/manifest.ts` with the same shape as `lesson_1/manifest.ts`. Declare `reads: { nationality: 1, year: 1 }` (reading those fields from lesson 1). Empty `writes`. Empty `focusAttribute` or omit. No moves.
- New route `/lessons/2/+page.server.ts` + `+page.svelte`. The load function calls `loadWorld(learnerId)` (same function the practice screen uses) and pulls every character that has a nationality or year fact. Filter to characters created in lesson 1 (`createdInLesson: 1`) to demonstrate the cross-lesson read.
- The page renders a flat list: "여기는 1과의 학생들이에요:" followed by `name — nationality, year` for each. No interaction. The purpose is to prove the query layer reads cleanly across the lesson boundary.
- Add a link from `/lessons/1` (or a small dev nav) to `/lessons/2` so it's reachable. This is allowed to be ugly — it's a stub.

Out of scope:
- Any lesson 2 moves. Any lesson 2 seed. Lesson 2 fields (majors, opinions) — those come when lesson 2 is real.
- A `lesson_manifests` DB table. The manifest stays TypeScript content (TECH_STACK §6 says the table arrives only when SQL needs to query manifests).
- Textbook-protected-fields enforcement. Still deferred per 02.5 decision 3.3.

**Verify by hand:**
- `/lessons/2` renders the list. If lesson 1 has three classmates, three rows appear.
- Edit a character's nationality on `/lessons/1/world`. Reload `/lessons/2`. The new value appears. (Cross-lesson reads see un-superseded facts — the whole point.)
- `sqlite3 local.db "select * from attribute_facts where set_in_lesson=1 and superseded_at is null"` matches what `/lessons/2` displays.

---

## What comes after these six slices

Deferred, roughly in order:

1. **UI cleanup pass** — type, spacing, color, transitions across seed / practice / world / lesson 2 stub. Probably plan 04. Worth doing while the surface is still small.
2. **Synthesis (LLM-assisted)** — a conversation with a character from the world, or a quiz drawn from world state. Its own plan. The biggest swing in the project so far and the most distinctive learner-facing AI experience. Wait until UI cleanup makes the rest of the lesson presentable enough to compare against.
3. **Vocab corpus and hover-to-gloss** (TECH_STACK §7). Becomes load-bearing once seed prose accumulates.
4. **Lesson manifest in the DB** (if it earns it). Still optional per TECH_STACK §6.
5. **`relation_facts` table** — arrives with lesson 3 work.
6. **Move parameterization** — once enough hand-written moves exist to see the shape clearly (data-shape doc principle 6).
7. **Weighted move picker** (LESSONS §6 / §11). Random is fine until something forces a change.

A new plan file (`04_*.md`) gets written when slice 6 is done and the next chunk is clear — almost certainly UI cleanup.

---

## Session log

**2026-05-23 — Slices 1–6 landed in one pass (no per-slice manual stops).**

What got built:
- `lesson_1/seed/index.ts` — discriminated `SeedStep` union with five steps: narrative intro, author_add_student, recall_inline, update_inline, wrap.
- `/lessons/1/seed/+page.server.ts` — URL `?step=N` is the source of truth; load builds a per-step `stepData` (already wired with target name, options, restate strings) so the svelte renderer doesn't touch the world layer. Actions: `addStudent` commits 3 facts in one beat (name + nationality + year); `updateCommit` writes a single fact and lets `commitAttributeFact` auto-supersede.
- `/lessons/1/seed/+page.svelte` — single distinct surface (cream `#fdf8f0`, narrow column, larger type, speaker label header). Branches on `stepData.kind`; recall reuses the shake/grey CSS pattern verbatim from recall-nationality.
- Re-entry guard: `nonProfessorCharacters(world).length > 0` on the author beat renders an "우리 반에 학생이 있어요." acknowledgement step instead of the form.
- `lesson_2/manifest.ts` (empty fields), `/lessons/2/+page.server.ts` + `+page.svelte` — flat list reading from `loadWorld(DEV_LEARNER)`, proves cross-lesson read.
- `/lessons/1` home page now lists Seed first and a Lesson 2 stub link.

Decisions taken without checking:
- Update beat's 네 path commits the proposed (different) value — per 02.5 invariant audit, the platform doesn't tell the learner their imagination is wrong.
- The "proposed" update value is `fieldOptions(field).filter(v => v !== current)[0]` — deterministic across reloads. A random pick would feel more alive; deferred to UI cleanup.
- Recall correctness lives client-side; the `recallAdvance` action was unused and dropped — the recall step's "다음" is a plain link after `recallSolved` flips.
- No shared component extraction between seed's author beat and `/practice/add-student/+page.svelte` yet — duplication is small.

What surprised:
- The discriminated union let the server load do all the world-shape work, keeping the svelte file pure-presentational. That's the cleanest split so far and probably the right shape if seed steps grow.
- `loadWorld` doesn't expose `createdAt`, so picking "most recent learner character" needed a direct call to `listEntitiesByKind` in the load. Still goes through the world layer; just a layer deeper than the world-state view.

Verification: `npm run check` passes (0 errors / 0 warnings, 704 files). End-to-end walkthrough deferred to the user — reset dev_learner first if you want to see the author beat (otherwise the re-entry guard fires).
