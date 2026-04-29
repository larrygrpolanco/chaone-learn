# Korean Language Learning Platform — Architecture

This document describes how the platform is built. The philosophy document explains *why* it is built this way and what it is for; this one is the *how*. Read the philosophy first when a tradeoff feels uncertain.

The architecture is shaped to support the project's ambition without collapsing under it. Some sections describe what gets built now. Others describe what gets built later but is named here so the bones don't preclude it. The distinction is made explicit throughout.

## 1. Project Shape

The platform combines the input density of a graded reader with the personal stake of a solo TTRPG: the learner steers stories that the system writes within their constraint set. Most learning happens through reception of comprehensible Korean — handcrafted readers, listening clips, dialogues, and (later) co-authored sessions — calibrated to roughly 98% comprehension at the learner's stage.

Three things carry the weight of the architecture:

1. **The corpus** is the source of truth. Vocabulary, grammar, and expressions live in versioned TypeScript files with stable IDs. Lessons reference them; lessons do not own them.
2. **Activities** are the components that render content to the learner. A lesson is a thin list of activities with their parameters. New activity types are added by writing a new component.
3. **Validators** keep the corpus honest. Build-time tooling tokenizes Korean content and checks it against the constraint set of the lesson it lives in.

Everything else — state, generation, audio pipelines — sits at the edges of these three.

## 2. Corpus

### Entities

- **Vocabulary** — Korean words and phrases. Dictionary form, English gloss, part of speech, tags (honorific, irregular, etc.), optional audio path.
- **Grammar** — Grammar points. Pattern, description, examples, machine-readable tags (register, structural type, applies-to). Tag rigor is bounded — Korean has too many irregularities to formalize completely, and that is fine.
- **Expressions** — Idiomatic or culturally-loaded patterns. Cultural information is encoded through how language is used (honorifics, 우리 vs 내, address terms), not as decorative prose. There is no separate "culture" entity.
- **Stories / Readers** — Handcrafted Korean prose, written plain and validated at build time against the constraint set of its lesson. These are the graded readers — pre-authored long-form content the learner can return to.
- **Lessons** — Thin manifests. Reference vocab/grammar/expression IDs introduced and reinforced in this lesson, plus an ordered list of activities with their parameters.
- **Stages** — Ordered collections of lessons (Beginning 1, Beginning 2, Intermediate 1, etc.). Lesson ordering within a stage is strict.

There is intentionally no generic "stories" content type in the sense of a runtime-generated artifact. Authored readers live in the corpus; text produced during a co-authored session is a separate concern handled by the activity that produces it (and possibly persisted later, in the state layer).

### Vocabulary Entity Design

Each vocabulary entry needs:

- Stable scoped slug
- Dictionary form (Korean)
- English gloss(es)
- Part of speech
- Tags (honorific, humble, formal, irregular, etc.)
- Audio reference(s)
- **Room for inflection awareness** — at minimum a flag for irregular verbs/adjectives, ideally a small set of attested inflected forms or notes for the lemmatizer

This last point matters: stories will be authored in plain Korean and validated against vocabulary at build time. The validator must recognize 계세요 as the polite form of 계시다. We use an existing Korean lemmatizer (kiwipiepy is the current recommendation) — we are not writing morphology code. Vocabulary just needs enough metadata to support lemmatizer-driven lookup and flag exceptions.

### Grammar Entity Design

Each grammar point needs the human-readable v1 fields (title, pattern, description, examples) plus machine-readable tags:

- **Register** — polite-formal, polite-informal, plain, honorific
- **Structural type** — particle, verb-ending, sentence-pattern, expression
- **Applies-to** — noun-following, verb-stem-following, adjective-stem-following, etc.
- **Prerequisites** — list of grammar IDs that must be introduced first

These tags enable: filtering for AI generation ("use only polite-informal present-tense"), validation ("this dialogue uses honorifics that the learner has not reached"), and learner views ("show all particles ordered by stage").

**Rigor is bounded.** We tag the regularities and document exceptions in prose. Korean has too many irregularities to formalize completely, and that is fine. The data layer is a useful index, not a Korean grammar engine. False positives in validation are acceptable; we flag for review and move on.

### IDs

Stable from day one. Slug-based, scoped by stage and introducing lesson:

```
vocab.beginning-1.lesson-4.gyesida
grammar.beginning-1.lesson-4.honorific-existence
expression.beginning-1.lesson-4.contractions-igeon
lesson.beginning-1.lesson-4
stage.beginning-1
```

Within their own TypeScript file, entities use short scoped slugs. The full path is constructed from the file location at build time. Once a learner has progress against an ID, it cannot be renamed casually.

### Directory Structure

```
src/content/
├── stages/
│   └── beginning-1.ts            # Stage manifest, lesson order
├── lessons/
│   └── beginning-1/
│       ├── lesson-1.ts           # Lesson manifest
│       └── ...
├── vocabulary/
│   └── beginning-1/
│       └── lesson-1.ts           # Vocabulary scoped to its introducing lesson
├── grammar/
│   └── beginning-1/
│       └── lesson-1.ts
├── expressions/
│   └── beginning-1/
│       └── lesson-1.ts
└── stories/
    └── beginning-1/
        └── lesson-1/
            ├── steve-likes-hats.ts
            └── steve-likes-hats.mp3   # Audio sits next to its content
```

Every entity lives near its introducing lesson and is referenced by stable global ID, so reuse across lessons and stages works naturally.

### The Lesson Manifest

A lesson references entities and lists activities. Roughly:

```typescript
{
  id: 'lesson.beginning-1.lesson-4',
  title: { en: 'At Home', kr: '집' },
  introduces: {
    vocabulary: ['vocab.beginning-1.lesson-4.gyesida', ...],
    grammar: ['grammar.beginning-1.lesson-4.alternative-questions', ...],
    expressions: ['expression.beginning-1.lesson-4.honorific-existence', ...],
  },
  reinforces: { /* IDs from earlier lessons reactivated here */ },
  activities: [
    { type: 'vocab-introduction', vocab: [...] },
    { type: 'flashcards', vocab: [...] },
    { type: 'listening-clip', story: 'story.beginning-1.lesson-4.steve-likes-hats' },
    { type: 'mixed-language-reader', story: 'story.beginning-1.lesson-4.steve-likes-hats' },
    { type: 'cloze-quiz', items: [...] },
  ],
}
```

There is no acquisition arc, no Acquire/Encounter/Produce schema. The author chooses activities that fit the lesson. Lessons typically have three to five activities, often including staples like flashcards. A rough sense of "introduce, then practice, then read" may emerge naturally from author choice; it is not enforced by the manifest.

### Constraint Sets

For any given lesson, the constraint set is the union of vocabulary, grammar, and expressions from that lesson and every earlier lesson in its stage (and prior stages). In v1 this is a small function: given a lesson ID, return the IDs in scope. It is what validators check authored content against, and what generators (later) will assemble prompts from.

## 3. Activities

Activities are the React components that render lesson content. A folder of components, each of which takes typed props and renders.

### Activity Inventory (v1)

The first lessons ship with a small set of static, hand-built activities:

- **vocab-introduction** — Presents new vocabulary with gloss, audio, and any author intro prose.
- **flashcards** — Standard front/back cards over a vocab list. A staple.
- **listening-clip** — An audio file with a transcript and an optional comprehension check.
- **cloze-quiz** — Fill-in-the-blank from a sentence with the correct answer and distractors.
- **mixed-language-reader** — Renders a story with known tokens in Korean and unknown tokens substituted with their English gloss. Powered by the same tokenization as the validator.

This list grows by adding new components when an author needs something the existing kit cannot express. There is no plugin system or activity framework — they are just components in a folder.

### Activity Rules

- Activities take their parameters from the lesson manifest. They do not know which lesson they are in.
- Every activity must work with any lesson, even where it would be pedagogically inappropriate. The author chooses what fits; the architecture only guarantees compatibility.
- Activities receive the lesson's constraint set as a prop when they need it (the mixed-language reader uses it to decide what's known; static activities like flashcards may not need it).
- Activities never reference specific lessons or stages by ID.

### Generation Activities (Future)

Co-authored story sessions, dialogue-puppet exchanges, character-creation vignettes — these are activities too, just ones that make LLM calls. They are not built in v1. When they are built:

- Each is a hand-coded component, not a generic "session" framework.
- Each calls the LLM through a harness that takes the lesson's constraint set, assembles a constrained prompt, and validates the LLM's output before showing it.
- Each is shaped for its place in the project: early sessions are heavily railed and use a lot of English; later sessions expand the learner's Korean contribution and reduce English support.

The progression from light to heavy co-authorship is felt across lessons rather than declared in a schema. It will reveal itself in the building.

The harness is real engineering, but it is not v1 work. The corpus, IDs, and validator are shaped to support it; the implementation comes when the first generation activity is built.

## 4. Audio

Audio is files on disk. It lives next to the content it belongs to (vocab audio in the vocabulary folder, story audio in the story folder). Components reference audio by relative path.

There is no audio entity, no audio manifest, no auto-scan-and-fill pipeline. When an author wants TTS for a piece of content, they run a small script (`generate-audio <path>`) that calls the TTS provider, writes the file, and reports back. They commit the file. Done.

Audio generated at runtime by a generation activity (e.g., the system reads its output aloud during a co-authored session) is ephemeral by default. It is streamed and discarded. Persistence is a per-activity decision and lives in the state layer (future) when relevant, not in the corpus.

Multiple voices, when needed, are separate generation calls with different voice settings — line by line. This is a generation-time choice, not a data-modeling problem.

For Korean TTS provider, ElevenLabs, Naver Clova, and Typecast are candidates. Real listening tests are needed before committing. This decision can be deferred without blocking corpus work.

## 5. Validators

Build-time tooling that keeps the corpus honest. This is the one piece of interesting engineering in v1, because it is what turns the 98% comprehension target from preference into engineering target.

### Story Validator

For each authored story:

1. Tokenize the Korean prose with kiwipiepy (or equivalent).
2. Resolve each token against the vocabulary corpus.
3. Compute the constraint set for the story's lesson (everything introduced in that lesson and earlier).
4. Flag any token that is not in the constraint set as unknown — for review, not automatic rejection.
5. Surface a build report.

Authors write stories in plain Korean prose. Annotation markers like `{vocab:slug}word{/}` are added only when the lemmatizer gets it wrong, or to disambiguate a homograph, or to override a default. The default is no markup.

The same tokenization powers the mixed-language reader at render time: known tokens render in Korean, unknown tokens render their English gloss. One pass of work supports both validation and rendering.

### Other Validators

- **Cross-reference checker** — Verifies that lesson manifests reference IDs that exist.
- **Lint rules for content shape** — Every vocab has a gloss, every grammar has tags, every story has a lesson, etc.

These are small scripts run in the build. Failures stop the build.

## 6. State (Future)

Lesson content lives in the repo. Learner state will live in Supabase. They never mix. They join on stable corpus IDs.

Likely tables when this is built:

- `user_progress` — which lessons and entities a learner has completed
- `srs_state` — spaced repetition scheduling, if/when SRS is added (the philosophy is skeptical of SRS-as-load-bearing; we may build a light version or skip it)
- `journal_entries` — user-generated content
- `session_history` — output of co-authored sessions, where the learner wants it kept

Out of scope for the first month or two of building. The corpus is shaped to accommodate it cleanly — stable IDs, no per-user assumptions in the content layer.

## 7. Surface

### Design System

Three layers, conventional:

- **Tokens** — Colors, spacing, typography, radii.
- **Components** — Activity components and the smaller pieces they're built from (vocab chip, audio button, dialogue line, etc.).
- **Pages** — Lesson page (renders a manifest's activity list), stage page, home, sidebar.

Specific tokens and styling decisions are deferred to the design system document.

### Kitchen Sink

A hidden route that demonstrates every component in every state — empty, loaded, error, with audio, without audio, completed, etc. It is the design system's living documentation. When prompting AI for new components, the instruction is "match the kitchen sink." When debugging visual inconsistencies, it is the reference.

### Information Architecture

Sidebar-driven, folder-like. Top-level entries are tracks (Lessons, Graded Readers, future tracks). Lessons expands to stages, stages expand to ordered lessons. A lesson page is the activity list rendered in order.

The home page is light: a brief mission statement, short descriptions of each track, direction to the sidebar. No dashboard, no streaks, no daily nags.

## 8. Authoring Workflow

Authoring is in raw TypeScript with build-time validation. Friction is acceptable — the content is the product, and human review is a feature.

The author:

1. Adds vocab, grammar, and expressions for a lesson by editing the relevant TypeScript files.
2. Drafts stories in plain Korean prose, with AI assistance, in the lesson's stories folder.
3. Runs the build. The validator flags unknowns and constraint violations.
4. Resolves flagged items — by adjusting the prose, adding lemmatizer overrides, or accepting a flagged item as deliberate.
5. Generates audio for new content via the audio script when ready.
6. Writes the lesson manifest, listing activities with their parameters.
7. Sends the lesson to the Korean teacher for review before it ships.

Heavier authoring tooling — a CMS, a web-based editor, an admin UI — is out of scope. The TypeScript files are the textbook.

## 8.5 Story Authoring Format

**Plain Korean prose with build-time validation.** No inline annotation markers in the source by default.

The build pipeline:
1. Tokenize each story with the Korean lemmatizer.
2. Resolve each token against the vocabulary corpus.
3. Flag unknown tokens (not in any introduced vocabulary) for review.
4. Validate constraints (e.g., "this Beginning 1 Lesson 4 story may only use vocabulary from Beginning 1 Lessons 1–4").
5. Surface a build report.

Annotation markers (`{vocab:slug}word{/}`) are added only where the lemmatizer gets it wrong or to override defaults. Authoring stays close to natural Korean prose, which keeps human review tractable when AI is the drafting partner.

For mixed-language readers (Korean structure with English substitutes for unlearned words), the same tokenization powers token-level rendering — known tokens render in Korean, unknown tokens render their English gloss. The data layer supports this without additional authoring effort.

## 8.9 Generation Layer (Future, Designed-For-Now)

When AI generation is added, it operates against constraint sets pulled from the content layer:

> Constraint: vocabulary IDs `[v.b1.l1.*, v.b1.l2.*, v.b1.l3.*, v.b1.l4.*]`, grammar IDs `[g.b1.l1.*, ..., g.b1.l4.*]`, register `polite-informal`, no `honorific`.
> Task: Generate a 6-sentence branching story where the learner chooses between two actions.

The validator script (build-time or runtime):
1. Tokenizes generated output.
2. Checks every token against the constraint set.
3. Checks grammar usage against the grammar tag set.
4. Returns a structured report.
5. Either passes, fails (regenerate), or hands to a second-pass LLM with the report attached.

This is why the content layer's tag rigor matters: it is what makes constraint enforcement possible.


## 9. Stack

- **Framework** — Next.js (App Router, React Server Components).
- **Language** — TypeScript throughout.
- **Styling** — Design system token approach; specific implementation deferred.
- **Audio** — Files in the repo for v1. Object storage (Supabase Storage or Cloudflare R2) introduced if/when volume justifies it.
- **NLP** — kiwipiepy or equivalent Korean lemmatizer in the build pipeline.
- **TTS** — Provider deferred pending listening tests.
- **State (future)** — Supabase.

## 10. Decisions Deferred

These are intentionally not decided yet and will get their own plans when the time comes:

- Specific design tokens and component styling (next document).
- TTS provider choice.
- The first generation activity's harness implementation.
- State layer schema and auth.
- Graded reader UI and reading mechanics beyond the v1 mixed-language reader.
- Whether and how to support light vocabulary practice beyond flashcards (cloze sets, optional quizzes).

## 11. What This Architecture Optimizes For

- **The corpus has compounding value.** Every lesson authored makes every other feature more capable.
- **Receptive-first pedagogy as default.** No forced production, no Acquire/Encounter/Produce arc, no schema enforcing output.
- **A small, simple v1 with room to grow.** The interesting future work — generation, sessions, state — is named honestly and not designed up front.
- **AI-assisted authoring with human review.** The format stays readable. Validation catches drift. The teacher catches what code can't.

## 12. What This Architecture Does Not Try to Do

- It is not a Korean grammar engine.
- It is not a corpus in the linguistic-research sense — it is a curated pedagogical artifact that borrows corpus practices.
- It is not optimized for fast lesson authoring. Depth is the point.
- It is not a learning companion or adaptive tutor.
- It does not solve generation in v1. It makes generation possible later without rework.
