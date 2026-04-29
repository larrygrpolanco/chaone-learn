# Project Build — Phase Tracker

This document tracks the phased build of the Korean language learning platform. It exists so any session can pick up where the last one left off. Each phase has a goal, a test milestone, and a notes section for recording decisions, issues, and next steps.

---

## How This Document Is Used

- **Before starting a phase**, read the current phase goal and notes.
- **During a phase**, add notes to the current phase section (the AI will do this).
- **After completing a phase**, mark it `[done]` and summarize what got built.
- If a decision affects future phases, note it in the **Cross-phase decisions** section at the bottom.

---

## Design Reminders (from PHILOSOPHY.md & DESIGN-SYSTEM.md)

- **Content first, chrome quiet.** No marketing prose inside the product.
- **Calm over performance.** Muted palette, slow motion, generous whitespace.
- **Reading is first-class.** Generous line-height, comfortable measure.
- **One activity, one page.** Each activity is its own surface; navigation moves between them.
- **Modular, not maximal.** Reuse the component kit; don't invent locally.
- **Honest about state.** No fake skeletons, no empty-state marketing.

---

## Phase 1: Project Skeleton & Design Tokens

**Goal:** A running Next.js app with the design system tokens and the two top-level layout frames (App frame + Reader frame).

### What Gets Built
- Initialize Next.js 15 (App Router, TypeScript, CSS Modules + global CSS tokens — no Tailwind)
- Directory structure: `src/app/`, `src/components/`, `src/content/`, `src/lib/`, `src/styles/`
- Global CSS with all semantic tokens (`--color-bg`, `--color-accent`, `--text-prose`, `--space-5`, etc.) for both **default** and **reading** modes
- Font loading strategy (serif + sans + Korean fallback)
- `layout.tsx`: App frame with collapsible sidebar + content column
- Minimal Home page (product name, tracks list, footer — per DESIGN-SYSTEM.md §6.1)
- Scaffold the hidden `/kitchen-sink` route

### Test Milestone
- `npm run dev` renders the home page in warm off-white with the sidebar visible.
- Kitchen sink page exists (empty for now).

### Notes
- [done] Tailwind CSS removed; switched to CSS Modules + global CSS tokens.
- [done] `src/styles/tokens.css` created with all semantic tokens for default (warm off-white `#FAF7F2`) and reading (warm brown `#3E2E25`) modes.
- [done] Fonts loaded via `next/font/google`: Geist Sans (UI), Geist Mono (debug), Source Serif 4 (display/prose). Korean system font fallback (`Pretendard`, `Noto Sans KR`, `Apple SD Gothic Neo`, `Malgun Gothic`) declared via CSS `font-family` ordering.
- [done] `layout.tsx` loads all fonts and applies CSS variables.
- [done] `AppFrame` component provides sidebar + content column layout; `Sidebar` component shows four-level tree (Track → Stage → Lesson, with Activity level stubbed for later).
- [done] Home page at `/` renders product name in display serif, tracks list (Lessons, Graded Readers), footer note.
- [done] Kitchen sink route at `/kitchen-sink` exists (empty, ready for Phase 3).
- [done] Additional scaffold: `/lessons` track page.
- Cross-phase decision: Keeping Next.js 16 (installed version) rather than downgrading to 15. No issues encountered.

---

## Phase 2: Corpus Types & Content Directory

**Goal:** The content layer exists with correct TypeScript types, directory structure, and at least one stage with 1–2 lessons of real data.

### What Gets Built
- Type definitions for all corpus entities (Vocab, Grammar, Expression, Story, Lesson, Stage)
- Directory structure under `src/content/`:
  ```
  stages/
  lessons/beginning-1/
  vocabulary/beginning-1/
  grammar/beginning-1/
  expressions/beginning-1/
  stories/beginning-1/
  ```
- ID construction utility (`vocab.beginning-1.lesson-1.gyesida`)
- Stage manifest for `beginning-1`
- Lesson manifest(s) with `introduces`, `reinforces`, `activities` arrays
- Constraint set computation (given a lesson ID, return all vocab/grammar/expression IDs in scope)
- Populate lesson 1 (and maybe lesson 2) with real data **pulled from the old reference files** but shaped to the new schema

### Test Milestone
- You can `console.log` a constraint set for `lesson-1` and see the correct accumulated IDs.
- The lesson manifest loads without type errors.
- Build succeeds with the content layer compiled.

### Notes
- [done] Type definitions created in `src/lib/types.ts` with architecture-compliant fields:
  - `VocabularyEntry`: `english: string[]`, `audio?: string[]`, `irregular?: boolean`, `inflectionNotes?: string`
  - `GrammarPoint`: required `register`, `structuralType`, `appliesTo`, optional `prerequisites` (full grammar IDs)
- [done] ID utility created in `src/lib/id.ts` with `makeId`, `makeLessonId`, `makeStageId`, and batch helpers.
- [done] Content directory structure created under `src/content/`: stages/, lessons/, vocabulary/, grammar/, expressions/, stories/.
- [done] Stage manifest `beginning-1.ts` with ordered lesson list (Lessons 1–3).
- [done] Lesson 1: 34 vocab items, 5 grammar points (all tagged with register/structuralType/appliesTo/prerequisites), 4 expressions, 1 narration story. Activity configs reference real IDs.
- [done] Lesson 2: 45 vocab items (inflection notes on 하다 verbs, ㅡ deletion, vowel contractions), 4 grammar points (all tagged), 4 expressions, 1 narration story. Activity configs reference real IDs.
- [done] Lesson 3: 45 vocab items (inflection notes on 있다/없다, 누구+가), 4 grammar points (all tagged), 3 expressions, 1 narration story. Activity configs reference real IDs.
- [done] `reinforces` arrays set to empty in all lessons. Natural reuse in stories is handled by constraint-set accumulation; `reinforces` is reserved for explicit pedagogical reactivation.
- [done] Constraint set computation in `src/lib/constraint-set.ts`. Verified accumulation: Lesson 1 = 34 vocab; Lesson 2 = 79 vocab; Lesson 3 = 124 vocab.
- [done] Build succeeds with no TypeScript errors. `npm run build` passes.
- [done] Old conversations skipped per user direction. Narration stories ported as placeholders, marked for future replacement.
- [done] Vocab slugs use romanized dictionary form (e.g., `annyeonghada`, `gwaenchanta`, `eodi`).
- Cross-phase decision: Constraint set module imports lesson manifests directly. For multi-stage support later, the `stageLessons` map can be extended or replaced with dynamic discovery.
- Cross-phase decision: Grammar machine-readable tags (`register`, `structuralType`, `appliesTo`, `prerequisites`) are required fields. All grammar points must be tagged before they can be used by validators or generation harness.

---

## Phase 3: Component Kit & Kitchen Sink

**Goal:** The design system's component kit is built and rendered in the kitchen sink.

### What Gets Built

**Foundations:**
- Button (primary / secondary / ghost), Link, InlineTag, SegmentedControl, Input, Toggle, Slider

**Containers:**
- Card, Panel, Sheet, Divider

**Navigation:**
- Sidebar (4 levels: Track → Stage → Lesson → Activity)
- Breadcrumb
- PageHeader

**Activity Launcher:**
- Card-shaped rows with name, description, status, suggested-order numeral

**Korean-language pieces:**
- VocabToken (known / unknown / highlighted)
- VocabCard
- GrammarBlock
- ExpressionBlock
- DialogueLine
- AudioButton
- AudioTray

**State & feedback:**
- Empty state, Loading state, Error state, Toast

### Test Milestone
- `/kitchen-sink` renders every component in every state.
- You can click through the sidebar tree.
- All components respect `prefers-reduced-motion`.

### Notes
- [Fill in during this phase]

---

## Phase 4: Pages & Information Architecture

**Goal:** All static pages exist and are navigable with correct routing.

### What Gets Built
- **Home** (`/`)
- **Stage page** (`/lessons/beginning-1`)
- **Lesson hub** (`/lessons/beginning-1/lesson-1`) — the "center of gravity" page with breadcrumb, title, vocab preview, grammar preview, expression preview, and activity launcher
- **Activity page shell** (`/lessons/beginning-1/lesson-1/[activity]`)
- **Reader frame** (`/lessons/beginning-1/lesson-1/mixed-language-reader`) — collapsible sidebar, wide measure
- Responsive sidebar (drawer on mobile below `960px`)
- Keyboard navigation and visible focus states

### Test Milestone
- You can navigate: Home → Lessons → Beginning 1 → Lesson 1 → any activity.
- Mobile sidebar works as a drawer.
- Breadcrumbs are present and clickable.

### Notes
- [Fill in during this phase]

---

## Phase 5: Static Activities

**Goal:** The first five activities render with real lesson content.

### What Gets Built
- `vocab-introduction` — stack of vocab cards with audio
- `flashcards` — centered card, flip with spacebar, prev/next with arrows
- `listening-clip` — audio tray + transcript + optional comprehension check
- `cloze-quiz` — fill-in-the-blank with distractor buttons
- `mixed-language-reader` — story prose with unknown-token substitution, reading-mode toggle, type-size slider

### Test Milestone
- Every activity in lesson 1 is fully interactive.
- The mixed-language reader toggles between default and reading mode.
- Flashcards respond to spacebar and arrow keys.

### Notes
- [Fill in during this phase]

---

## Phase 6: Validators & Build Pipeline

**Goal:** Build-time tooling keeps the corpus honest.

### What Gets Built
- Cross-reference checker: lesson manifests reference IDs that exist
- Content lint: every vocab has a gloss, every grammar has tags, etc.
- Story / tokenization validator (mock or real Korean tokenization — `kiwipiepy` is Python, so we may shell out or mock for v1)
- Integration into `npm run build` — failures stop the build

### Test Milestone
- Breaking a lesson manifest (e.g., referencing a non-existent vocab ID) fails the build with a clear error.

### Notes
- [Fill in during this phase]

---

## Cross-phase Decisions

Record here any decision made in one phase that affects later phases.

- **Styling approach:** CSS custom properties in a global `tokens.css` + CSS Modules for components. No Tailwind. (Decision from PHILOSOPHY + DESIGN-SYSTEM.md)
- **ID scheme:** Slug-based, scoped by stage and introducing lesson. Short scoped slugs inside files; full path constructed at build time.
- **Old data policy:** Old lesson files are raw material only. Structure is discarded; vocab/grammar lists are manually reshaped into the new corpus-first schema.
- [Add more as they arise]

---

## Open Questions (to be resolved by building)

From the architecture and design documents:

- The exact shape of the "arc" within a lesson (introduce → practice → read may emerge naturally; it is not enforced by the manifest).
- How strict the constraint-set enforcement should be around occasional unknown words in stories.
- The right name for "story sessions" (working term).
- The exact balance of L1 in early lessons.
- Final accent color choice after seeing it on a real lesson page.
- Final serif and sans font choices after Korean-fallback testing.
- The visual treatment of unknown vocab in the mixed-language reader (italic? bracketed? tinted?).

---

## Current Status

| Phase | Status | Notes |
|---|---|---|
| 1. Project Skeleton & Design Tokens | `[done]` | Next.js 16, CSS tokens, Geist+Source Serif 4, sidebar+content frame, home page, kitchen-sink scaffold |
| 2. Corpus Types & Content Directory | `[done]` | Types, ID utils, 3 lessons of real data, constraint sets, build passes |
| 3. Component Kit & Kitchen Sink | `[pending]` | — |
| 4. Pages & Information Architecture | `[pending]` | — |
| 5. Static Activities | `[pending]` | — |
| 6. Validators & Build Pipeline | `[pending]` | — |

---

## Next Session Instructions

When starting a new chat, paste the following prompt:

> Read `/Users/larrygrpolanco/Documents/GitHub/chaone-learn/BONES.md`, `/Users/larrygrpolanco/Documents/GitHub/chaone-learn/ARCHITECTURE.md`, `/Users/larrygrpolanco/Documents/GitHub/chaone-learn/DESIGN-SYSTEM.md`, and `/Users/larrygrpolanco/Documents/GitHub/chaone-learn/PHILOSOPHY.md`. We are working on Phase [N]. The goal is: [copy goal from above].

(End of file)
