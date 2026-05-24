# Realignment — Plan 02.5

A pause between plan 02 and plan 03. Lesson 1 has five moves and a branching hub. Before adding seed + synthesis, we fix the core feel: the game has to be fun and legible *before* narrative scaffolding is layered on top.

Each item is a small change with a stated reason. Most are one short session.

## Rules still holding
- All db I/O through `src/lib/server/world/*`.
- Moves never hardcode value lists — manifest is source of truth.
- Read `local.db` after each slice, not just the UI.

---

## Slice 1 — Drop the mode vocabulary from the UI

**Change:** Remove the words "Recall," "Author," "Negotiated" from anything the learner sees. Drop the mode badge text on the practice cards. Keep `mode` in the data — it still drives color/icon.

**Why:** The learner doesn't need to know our internal taxonomy. Naming the mode in the UI turns the experience into a labeled-quiz feel, which is exactly what the platform is trying not to be. The visual signal (color) is sufficient; the label is noise.

**Out of scope:** Renaming the `mode` field in code. Internal naming stays.

---

## Slice 2 — Color reflects effect, not category

**Change:** Two colors, not three.
- **One color (e.g. blue)** when the answer will change the world (a fact gets written).
- **Another color (e.g. orange)** when the answer only reads from it.

The card color is set by the branch the move *will* take given current world state. If a single move shifts mid-question from reading to writing (e.g. shared-attribute starting as recall, learner says 아니요, now it writes), the color shifts at that moment.

**Why:** The author/recall distinction matters because writing to the world feels different from being asked a fact. That's the only distinction the learner needs to feel. Three colors with a "negotiated" middle confuses the rule. Two colors that mean *this changes the world / this doesn't* are honest and intuitive.

**Open question:** Does the shared-attribute "both defined and matching" recall branch ever feel like it should be the "writes" color? Decide during the slice; default no.

---

## Slice 3 — Return to practice after every answer

**Change:** On every move's success state, the only action is "back to practice." No "next question." No chaining.

**Why:** The branching screen is the heart of the loop (LESSONS §6). Chaining bypasses it and turns moves into a drill sequence. Returning to practice keeps the learner picking, which is where agency lives.

**Cost:** Slight friction. Worth it for testing whether the loop itself is fun.

---

## Slice 4 — Rethink "negotiated" against the invariants

**Change:** Audit `negotiate_nationality` against LESSONS §2 invariants 1, 3, 6. The 20% "propose a wrong value for the learner to correct" branch is the suspect — it treats authoring as a test the learner can fail.

Likely resolution: drop the wrong-value-correction branch entirely. Negotiated authoring becomes: a character proposes a value for an *unset* field, learner says 네 (commit) or 아니요 (chooser). Same flow, no trap. When a fact already exists, the move just isn't eligible for that character.

**Why:** "톰은 일본 사람이에요?" when the learner already said Tom is Vietnamese isn't negotiation — it's a test, dressed as a conversation. The platform shouldn't quiz the learner on what they themselves authored under the pretense of asking.

**Out of scope:** Removing the move entirely. The yes/no-then-confirm pattern is still the distinctive voice; only the trap variant goes.

---

## Slice 5 — Split add-classmate into single-question moves

**Change:** `add_classmate` becomes three moves:
1. **`add_student`** — name only. Creates the entity with no attributes.
2. **`set_nationality`** — picks an existing learner-added character missing nationality, asks where they're from.
3. **`set_year`** — same shape, year field.

Each is one question, one commit, back to practice.

**Why:** The current three-step flow is a mini-form, not a move. Splitting it makes each question a real branching-screen choice and lets the picker surface "you have a student with no year set" naturally. Also: each step becomes a single moment of language practice, not a checkout flow.

**Picker note:** `set_nationality` / `set_year` are eligible iff at least one character is missing that field. They naturally chain — adding a student creates two new eligible moves.

---

## Slice 6 — Always use names

**Change:** Audit every move's prompt template. Replace any "this person" / "the student" / generic referent with the character's name. The shared-attribute move already does this; the rest should match.

**Why:** Names are the lesson 1 vocabulary the world is built around. Using them everywhere reinforces them and makes the world feel populated, not abstract.

---

## Slice 7 — Default to an empty class

**Change:** The seed script stops pre-loading the six textbook characters into a learner's world by default. New learners start with an empty class. Add a `?with-textbook=true` query param (or a dev-only toggle) that re-runs the textbook seed for testing.

**Why:** The textbook characters take the worldbuilding away from the learner before the learner has done anything. The platform's premise (WORLD §1) is that the learner *co-authors* the world. Starting with a populated room undercuts that on the first screen.

For testing, the toggle stays. For real use, an empty class is the right starting state — the seed/tutorial phase (plan 03) will introduce Gary as the first character through narrative, not seeding.

**Cost to current moves:** `recall_nationality`, `recall_year`, `shared_attribute` won't be eligible until the learner has built up enough characters. That's correct behavior. Verify the practice screen handles "fewer than 3 eligible moves" gracefully — show what's available, no padding.

**Database:** Existing dev learner can keep its textbook characters. The change is to the seed script's defaults, not a migration.

---

## What this slice does NOT change

- The manifest shape.
- The query layer.
- Anything in plan 03's territory (seed/tutorial, synthesis, vocab corpus).

## Addendum — taxonomy collapse (mid-02.5)

After playing the first realigned version, the `negotiated` and `shared_attribute` move concepts felt like they were trying too hard. Two changes:

- **`negotiate_nationality` → `update_nationality`** (mode `'author'`, variant `'update'`). Eligibility flips to "characters with a nationality set." 네 confirms the current value with no DB write; 아니요 opens a chooser that overwrites. Added a symmetric `update_year`.
- **`shared_attribute` (polymorphic) → split into `recall_shared_nationality` + `recall_shared_year`** (both pure `RecallMove`). Each picks a pair of characters with a matching value and asks fill-in-the-blank multi-choice ("영미와 마이클은 ____ 사람이에요."). No author branches; no polymorphic move-runtime branching.

**Final move modes:** `author` and `recall`. That's it. Author has internal variants (`steps` | `set` | `update`) but they're move-file-private; the practice screen only needs `mode`. `NegotiatedMove` and `SharedAttributeMove` are gone from the type system. `movePreviewWrites` collapses to `move.mode === 'author'` and the mid-flow color-shift logic for shared_attribute is no longer needed.

**Naming pattern going forward:** `<mode>_<field>[_<qualifier>]`. Current set: `add_student`, `set_nationality`, `set_year`, `update_nationality`, `update_year`, `recall_nationality`, `recall_year`, `recall_shared_nationality`, `recall_shared_year`.

**Future shapes the structure now cleanly admits:**
- A `recall_from_country`-style move where the prepared "answer" is a *set of characters* (multi-select). `RecallQuestion` would widen `correct` to `string | string[]` with an `inputKind: 'choice' | 'multi-choice' | 'text'` discriminator — add when the first such move arrives.
- Free-text recall: same hook (`inputKind: 'text'`) plus a renderer that does whitespace/punctuation-tolerant matching against the manifest's value set.

**LESSONS.md update needed (deferred):** the doc still references "negotiated authoring" as a mode. After this collapse, that wording should be revisited — the *voice* of negotiated authoring (a character proposing, the learner confirming or pushing back) survives as the `update` variant's UI flow, but it's no longer a top-level mode.

---

## After slice 7

Sit with the changes. Play lesson 1 end-to-end from an empty class. Write feedback notes — what's fun, what's flat, what's missing. *That* feedback shapes plan 03.

---

## Session log

### Slices 1–7 — Realignment pass (one session)

All seven slices landed together. Notes:

- **Slice 1 (drop mode vocabulary):** Removed the `<span class="badge">{card.mode}</span>` from the practice cards and the "Author/Recall/Negotiated/Shared" labels from each move page. Internal `mode` field is untouched (per plan). The 02.5 leading questions also got a light rewrite away from quiz-label phrasing toward story-hook phrasing (writing-awareness lens; a full writing-craft pass is its own future plan).
- **Slice 2 (two-color):** Cards on the practice screen use `data-writes="true|false"` (blue vs orange). `movePreviewWrites(move, world)` in `practice/+page.server.ts` computes the flag: recall→false, author/negotiated→true, shared_attribute→true iff any viable pair has a missing field. Inside `shared-attribute/+page.svelte`, `data-writes` is reactive (`q.branch !== 'recall_matching'`), so the page recolors at the moment the branch resolves. Other move pages have a fixed `data-writes` value matching their card.
- **Slice 3 (return-to-practice):** Every "다음" button that previously re-prepared the next question is now an `<a href="/lessons/1/practice">← 연습으로</a>` link. The author moves (`add_student`, `set_nationality`, `set_year`) `redirect(303, '/lessons/1/practice')` from their commit actions. No chaining anywhere.
- **Slice 4 (negotiate trap removed):** `WRONG_PROPOSAL_PROBABILITY` and the goWrong branch are gone. Eligibility is now "at least one non-professor character lacks a nationality." `isCurrent` remains on the type (always `false` from this move), but the svelte no longer special-cases it — single 네 path goes through the commit form. The yes/no-then-confirm pattern is intact; only the test-dressed-as-conversation branch is gone.
- **Slice 5 (split add-classmate):** Three new moves replace `add_classmate`: `add_student` (name-only, creates entity), `set_nationality`, `set_year` (each picks a non-professor character missing the field and asks). New types `StepsAuthorMove` and `SetAttributeMove` (both `mode: 'author'`, distinguished by a `variant` discriminator) live in `types.ts`. The old `/lessons/1/practice/add-classmate` route is deleted. `set_*` eligibility surfaces naturally when add_student completes — three eligible cards immediately if the new student lacks both fields.
- **Slice 6 (use names):** Audited prompts — all Korean prompts already use the character's name in the topic position. New `set_nationality` and `set_year` prompts follow suit. `add_student` is the one move that doesn't yet know a name (it's creating one). The `<h1>{data.name}</h1>` header pattern carries across every move page.
- **Slice 7 (empty class):** `npm run db:seed` now creates the dev learner with **no textbook characters**. Pass `--with-textbook` (or `WITH_TEXTBOOK=true`) to load the six characters for testing. Existing learner rows in `local.db` are unaffected — the change is to the script's default behavior, not a migration. The practice screen's "Only N eligible" / "아무도 없어요" copy already handles the small-world case.

Cross-cutting:

- `npm run check` clean (0 errors, 0 warnings) after the pass.
- Writing-awareness lens applied lightly to existing `leadingQuestionEn` strings; deeper rewrites (presupposition lines, success-feedback variety, Stonetop-voice negotiated prompts) are deferred to the next plan, as discussed.
- The `mode` field stays in code as internal taxonomy; only its UI surfacing was removed.

- To try it: from app/, run npm run db:seed (now creates an empty class — use --with-textbook to keep the existing dev setup) then npm run dev and visit /lessons/1/practice. With an empty class, only add_student will be eligible; adding a student makes set_nationality/set_year light up; populating two characters unlocks shared_attribute and the recalls.