# PRD — Lesson 1 MVP + Lesson 2 Stub

## Problem Statement

Korean language learners using *Integrated Korean: Beginning 1* have no engaging, scaffolded way to practice the vocabulary and grammar they're learning. Generic flashcard or drill apps ignore the constraint that a learner at lesson 1 only knows a small, specific set of words — and exercises that violate this constraint undermine confidence and comprehension. Previous attempts to build this app produced a system that grew complex before anything felt good to use: the interaction loop felt like a quiz with no momentum, the introductory phase felt like a teacher lecturing rather than an invitation, and the data architecture got ahead of the content.

## Solution

A three-phase lesson app where learners build a persistent world of characters using only the Korean they currently know, then get tested against the world they created. Each lesson has a unique visual view (e.g., a class roster for lesson 1) that updates visibly as the learner's answers change the world — giving immediate feedback that their actions matter. A meta voice (the Teacher Assistant) briefly orients the learner without becoming a character in the story.

The three phases per lesson are:

1. **Seed** — Narrative, Teacher-Assistant-guided intro. The learner enters themselves as a character first, then introduces one or more classmates. Authoring only.
2. **Building** — The learner expands the world freely: adding characters, updating facts. Pure authoring. No testing.
3. **Synthesis** — Applied practice tested against the world the learner built. Recall lives here only.

The MVP ships Lesson 1 complete end-to-end and a Lesson 2 stub that proves the world carries over and a second view type (family tree) is possible.

## User Stories

1. As a learner, I want to enter my own name and details first, so that the world starts with me and feels like mine.
2. As a learner, I want to name and define a classmate during the seed phase, so that I feel like I'm building something rather than filling out a form.
3. As a learner, I want the Teacher Assistant to explain what I'm doing and why in a brief, fun way, so that I understand the stakes without feeling lectured.
4. As a learner, I want to see the class roster update immediately after I add or change a character, so that I feel the impact of my answers.
5. As a learner, I want to add multiple classmates during the building phase, so that my world grows and feels more alive.
6. As a learner, I want to update a character's nationality or year after I've set it, so that I can correct mistakes and keep the world accurate.
7. As a learner, I want all exercises to use only vocabulary I've learned so far, so that I'm never stuck on a word I haven't encountered.
8. As a learner, I want Synthesis exercises to test me on facts I put into the world myself, so that the challenge feels fair and grounded.
9. As a learner, I want to see my class roster during Synthesis, so that I can feel the connection between what I built and what I'm being tested on.
10. As a learner, I want clear visual feedback when I get a Synthesis answer right or wrong, so that I know whether my Korean is correct.
11. As a learner, I want to complete Lesson 1 and see that my characters are still there at the start of Lesson 2, so that the world feels persistent and worth investing in.
12. As a learner, I want Lesson 2's seed to expand characters I already created (e.g., asking about Gary's family), so that the world deepens rather than restarting.
13. As a learner, I want the Teacher Assistant's voice to be consistent across lessons, so that there's a familiar guide as the content grows.
14. As a learner, I want to use real people or fictional characters I invent, so that the world reflects my interests rather than a textbook's defaults.
15. As a learner, I want to know which phase I'm in (Seed / Building / Synthesis), so that I understand why some exercises feel different from others.
16. As a learner, I want the flow between questions to feel continuous rather than returning to a menu each time, so that there's momentum and a sense of progress.
17. As a learner, I want Synthesis to feel like a natural culmination of what I built, not a disconnected quiz, so that the three phases feel like one coherent experience.
18. As a developer, I want each lesson's data scope to be declared explicitly, so that no exercise can accidentally use vocabulary outside the current lesson.
19. As a developer, I want the world state to be queried through a single module, so that all DB I/O is in one place and phases can't accidentally touch each other's data.
20. As a developer, I want each lesson's view to be a standalone component that renders world state, so that new lesson views can be added without touching the core loop.

## Implementation Decisions

### Data Model
- A single `characters` table with flat typed columns: `id`, `learner_id`, `is_learner` (boolean flag for the learner's own character), `name`, `year` (1–4), `nationality`.
- No EAV fact-log. Flat columns only for lesson 1. New lessons add columns or related tables as needed via migrations.
- Every row carries `learner_id` to support multi-user from day one.
- The `is_learner` flag on a character distinguishes the learner's self-entry from other characters and is used to generate first-person prompts.

### Module Breakdown

**World State module** — the only place that touches the database. Exposes a clean interface: get all characters, add a character, update a character attribute. Phases call this module; they do not query the DB directly. Deep module — encapsulates all persistence behind a simple API that rarely changes shape.

**Lesson Scope module** — a per-lesson config declaring which vocabulary and grammar patterns are in scope. Used by exercises to validate that no out-of-scope language appears in prompts or expected answers. Stateless and testable in isolation.

**Phase State module** — manages which phase the learner is currently in and which step within that phase. Tracks completion of Seed and Building so Synthesis unlocks only after both are done. Persisted to DB so refreshing the page doesn't lose progress.

**Exercise definitions** — content modules (not DB-stored) that define individual exercise prompts, what world fact they write or read, and how to evaluate an answer. Seed and Building exercises write to the world. Synthesis exercises read from it. Each exercise knows its phase.

**Lesson View components** — purely presentational Svelte components that render current world state. Lesson 1 view: class roster with nationality flags. Lesson 2 view: family tree stub. Views are passed world state as props — they own no data.

**Teacher Assistant content** — static strings keyed by lesson + phase + moment (e.g., `lesson1.seed.intro`, `lesson1.building.start`, `lesson1.synthesis.intro`). Not dynamic. Kept in a single content file per lesson.

**SvelteKit routes** — one route per lesson phase (`/lessons/1/seed`, `/lessons/1/building`, `/lessons/1/synthesis`). Each route loads world state server-side and passes it to the view. Phase transitions are server-side redirects.

### Build Order
Vertical slices only. Each slice delivers a working path from Seed through to a Synthesis question before the next slice begins. No phase is built in isolation. Recommended first slice: learner enters their own name (Seed) → adds one classmate with nationality (Building) → answers "what's that classmate's nationality?" in Korean (Synthesis) → roster view updates throughout.

### Carry-Over
World state persists automatically between lessons. Lesson 2's Seed phase queries existing characters and generates expansion questions about them (e.g., family members). No learner action required to carry characters forward.

## Testing Decisions

Good tests verify external behavior — what comes out given what goes in — not how the code achieves it internally. Tests should not depend on file structure, component internals, or DB implementation details.

**World State module** — unit tested. Given a sequence of add/update calls, verify the correct state is returned by the query interface. This is the most important test surface: it's the contract everything else depends on.

**Lesson Scope module** — unit tested. Verify that out-of-scope vocabulary is correctly rejected and in-scope vocabulary is accepted.

**Phase State module** — unit tested. Verify that phase transitions happen in the correct order, that Synthesis is blocked until Seed and Building are complete, and that state survives a simulated page refresh.

**Exercise definitions** — unit tested per exercise. Given a world state and a learner answer, verify correct/incorrect evaluation.

**Lesson View components** — not unit tested at MVP. These are purely presentational; correctness is verified by running the app.

**Routes** — not unit tested. Integration behavior is verified by running the app through the vertical slice.

## Out of Scope

- Lessons 3–7 and any vocabulary or grammar beyond lesson 2's scope.
- Audio, pronunciation feedback, or speech input.
- User authentication or accounts (single learner only at MVP).
- Spaced repetition or scheduling algorithms.
- Mobile-specific layouts or native app packaging.
- The full Lesson 2 experience — only a stub proving carry-over and the family tree view shell.
- Polished visual design — functional UI only at MVP.
- The "carry-over selection" mechanic (learner choosing which characters to bring forward) — automatic carry-over only.

## Further Notes

- The hardest constraint in the system is **lesson scope**: every exercise must stay within the vocabulary and grammar the learner knows at that lesson. This constraint should be enforced by the Lesson Scope module, not by convention.
- "Effectance" — the learner visibly seeing the world change because of their answer — is the core feedback mechanic. The roster updating after adding a classmate is more important than any gamification layer.
- The Teacher Assistant speaks *about* the app and the learning process. It is never a character in the world and never uses in-world language (Korean) to explain itself.
- The previous build failed partly because it was built horizontally (all of phase 2, then all of phase 1). Vertical slices are non-negotiable.
- See `CONTEXT.md` for the full domain glossary and `docs/adr/0001-flat-schema-over-eav.md` for the data model decision.
