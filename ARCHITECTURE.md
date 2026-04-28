# Korean Language Learning Platform — Architecture

This document captures the architectural philosophy and structural decisions for the platform. It is a reference for building, not a complete specification of every feature. Other plan files in the repo will go deeper on specific systems.

## 1. Core Philosophy

The platform is a **comprehensible input engine**. Lessons are not the destination — they are the vocabulary acquisition layer that feeds everything else: graded readers, journaling, generated stories, listening practice, and games. A learner who finishes a stage walks away with a constraint set (vocabulary + grammar) that unlocks the rest of the platform's content.

Three principles drive the architecture:

1. **Receptive skills first.** Listening and reading are emphasized; speaking and writing are present but de-emphasized in early stages.
2. **The data layer is a constraint specification language.** Every entity needs to answer "can I be used at this learner stage?" so that AI generation, graded readers, and validators can all operate against the same source of truth.
3. **Clean separation of layers.** Content, experience, and generation are independent. Each can change without breaking the others.

## 2. The Three Layers

### Content Layer

Static, versioned, lives in the repo as TypeScript files. This is the corpus. It is authored by hand (with AI assistance) and reviewed carefully. It does not change at runtime.

### Experience Layer

The design system, components, and pages. Renders content. Knows nothing about which lesson it is in. Components take content as props.

### Generation Layer

AI-driven content generation operating against constraint sets pulled from the content layer. Includes validators that check generated output against the constraint set. Mostly future work; the content layer is designed to support it from day one.

The user-facing IA is almost an afterthought because the layers are clean: Home → track → stage → lesson → acquisition arc → components rendering content. The graded reader is a separate entry point that pulls from the content layer with a different constraint.

## 3. Content Layer Entities

All content entities are first-class with stable slug-based IDs. Lessons are **manifests** that reference these entities — they do not own them.

### Entity Types

- **Vocabulary** — Korean words/phrases with dictionary form, English gloss, part of speech, tags, and audio reference.
- **Grammar** — Grammar points with pattern, description, examples, and machine-readable tags (register, structural type, applies-to, prerequisites).
- **Expressions** — Idiomatic or culturally-loaded language patterns. **Replaces a separate culture entity**: cultural information is encoded through how language is used (honorifics, 우리 vs 내, address terms), not as decorative prose. Per-lesson, lives in a flat namespace tagged with its introducing lesson.
- **Audio** — First-class entity with metadata (`source: 'human' | 'tts'`, voice, model, generated_at). Other entities reference audio by ID. One vocab item or sentence can have multiple audio realizations.
- **Stories** — Handcrafted or generated reading passages, written as plain Korean prose with build-time tokenization and validation against a constraint set.
- **Lessons** — Thin manifests. Reference vocab IDs, grammar IDs, expression IDs. Contain lesson-specific connective tissue (intro, custom activities, lesson-specific stories).
- **Stages** — Ordered collections of lessons (Beginning 1, Beginning 2, Intermediate 1, etc.). Lessons within a stage are strictly ordered — lesson 4 builds from lesson 3.

### ID Convention

Globally unique, structured, slug-based:

```
vocab.beginning-1.lesson-4.gyesida
grammar.beginning-1.lesson-4.honorific-existence
expression.beginning-1.lesson-4.contractions-igeon
audio.vocab.beginning-1.lesson-4.gyesida.canonical
lesson.beginning-1.lesson-4
stage.beginning-1
```

Within their own TypeScript file, entities use short scoped slugs (`gyesida`). The full path is constructed from the file location during build. This keeps source files readable while resolved IDs remain unambiguous everywhere they are referenced (URLs, code search, Supabase joins, LLM context).

IDs are **stable from day one**. Once a user has progress against an ID, it cannot be renamed casually. Choose carefully when authoring.

### Directory Structure

```
src/content/
├── stages/
│   └── beginning-1.ts            # Stage manifest, lesson order
├── lessons/
│   └── beginning-1/
│       ├── lesson-1.ts           # Lesson manifest
│       ├── lesson-2.ts
│       └── ...
├── vocabulary/
│   └── beginning-1/
│       ├── lesson-1.ts           # Vocabulary scoped to its introducing lesson
│       └── ...
├── grammar/
│   └── beginning-1/
│       └── lesson-1.ts
├── expressions/
│   └── beginning-1/
│       └── lesson-1.ts
├── stories/
│   └── beginning-1/
│       ├── handcrafted/
│       └── generated/
└── audio/
    └── (manifest files; actual audio assets stored separately — see §6)
```

Every entity lives near its introducing lesson but is referenced by stable global ID, so reuse across lessons and stages works naturally.

### The Lesson as Manifest

A lesson file is thin. It does not contain vocabulary or grammar — it references them. Roughly:

```typescript
{
  id: 'lesson.beginning-1.lesson-4',
  title: { en: 'At Home', kr: '집' },
  introduces: {
    vocabulary: ['vocab.beginning-1.lesson-4.gyesida', ...],
    grammar: ['grammar.beginning-1.lesson-4.alternative-questions', ...],
    expressions: ['expression.beginning-1.lesson-4.honorific-existence', ...],
  },
  reinforces: { /* IDs from earlier lessons that get reactivated */ },
  arc: {
    acquire: [...],     // activities/components for first encounter
    encounter: [...],   // input-focused: listening, reading, stories
    produce: [...],     // optional, de-emphasized early
  },
}
```

The acquisition arc (Acquire / Encounter / Produce) is the structural backbone of every lesson. Visual weight matches pedagogical weight: a rich Encounter section, a focused Acquire section, a quiet optional Produce section.

## 4. Vocabulary Entity Design

Each vocabulary entry needs:

- Stable scoped slug
- Dictionary form (Korean)
- English gloss(es)
- Part of speech
- Tags (honorific, humble, formal, irregular, etc.)
- Audio reference(s)
- **Room for inflection awareness** — at minimum a flag for irregular verbs/adjectives, ideally a small set of attested inflected forms or notes for the lemmatizer

This last point matters: stories will be authored in plain Korean and validated against vocabulary at build time. The validator must recognize 계세요 as the polite form of 계시다. We use an existing Korean lemmatizer (kiwipiepy is the current recommendation) — we are not writing morphology code. Vocabulary just needs enough metadata to support lemmatizer-driven lookup and flag exceptions.

## 5. Grammar Entity Design

Each grammar point needs the human-readable v1 fields (title, pattern, description, examples) plus machine-readable tags:

- **Register** — polite-formal, polite-informal, plain, honorific
- **Structural type** — particle, verb-ending, sentence-pattern, expression
- **Applies-to** — noun-following, verb-stem-following, adjective-stem-following, etc.
- **Prerequisites** — list of grammar IDs that must be introduced first

These tags enable: filtering for AI generation ("use only polite-informal present-tense"), validation ("this dialogue uses honorifics that the learner has not reached"), and learner views ("show all particles ordered by stage").

**Rigor is bounded.** We tag the regularities and document exceptions in prose. Korean has too many irregularities to formalize completely, and that is fine. The data layer is a useful index, not a Korean grammar engine. False positives in validation are acceptable; we flag for review and move on.

## 6. Audio

### Audio as First-Class Entity

Every audio asset has an ID and metadata:

```
{
  id: 'audio.vocab.beginning-1.lesson-4.gyesida.canonical',
  ref: { type: 'vocabulary', id: 'vocab.beginning-1.lesson-4.gyesida' },
  source: 'human' | 'tts',
  voice: 'female-1',
  model?: 'elevenlabs-multilingual-v2',
  generated_at?: '2026-04-15',
  file: '...',  // path or URL
  start?: number, end?: number,  // optional sprite offsets
}
```

Other entities reference audio by ID. A vocab item can have multiple audio realizations (different voices, speeds). The experience layer picks one based on context — random, by preference, or by acquisition logic ("you've heard speaker A four times, use speaker B").

### Storage

- **Vocabulary audio** — small, canonical, in-repo (Git LFS if it grows). Generated by the asset pipeline.
- **Dialogue/story audio** — larger, more numerous, in object storage (Supabase Storage or Cloudflare R2). Audio entity stores the URL.

### Asset Pipeline

A build-time script that:
1. Scans for vocabulary entries lacking audio.
2. Generates via the configured TTS provider.
3. Writes back the audio entity with metadata.
4. Re-runnable when TTS quality improves — `tts`-tagged audio can be regenerated without touching human recordings.

This is **pipeline tooling, not authoring tooling.** It removes friction rather than adding it.

### TTS Quality Note

For an input-first methodology, Korean TTS quality matters — learners internalize what they hear. ElevenLabs, Naver Clova, and Typecast are the candidates worth real listening tests before committing.

## 7. Story Authoring Format

**Plain Korean prose with build-time validation.** No inline annotation markers in the source by default.

The build pipeline:
1. Tokenize each story with the Korean lemmatizer.
2. Resolve each token against the vocabulary corpus.
3. Flag unknown tokens (not in any introduced vocabulary) for review.
4. Validate constraints (e.g., "this Beginning 1 Lesson 4 story may only use vocabulary from Beginning 1 Lessons 1–4").
5. Surface a build report.

Annotation markers (`{vocab:slug}word{/}`) are added only where the lemmatizer gets it wrong or to override defaults. Authoring stays close to natural Korean prose, which keeps human review tractable when AI is the drafting partner.

For mixed-language readers (Korean structure with English substitutes for unlearned words), the same tokenization powers token-level rendering — known tokens render in Korean, unknown tokens render their English gloss. The data layer supports this without additional authoring effort.

## 8. State Layer (Future)

Lesson content lives in the repo. **Learner state lives in Supabase.** They never mix.

Content in TypeScript files: versioned with code, diffable in git, deploys with the app, no CMS needed. State in Supabase: per-user, mutable, queryable. Joined by stable slug IDs from the content layer.

Future Supabase tables (illustrative, not exhaustive):
- `user_progress` — which lessons/entities a learner has completed
- `srs_state` — spaced repetition scheduling per vocabulary/grammar item
- `journal_entries` — user-generated content
- `generated_story_history` — record of AI-generated content per user

The pain point of mixing content into a database (admin tools, migrations to fix typos, no git history of pedagogical decisions) is avoided by keeping content as code.

**Built later.** Not in scope for the first month. The architecture is designed to accommodate it cleanly — stable IDs, no per-user assumptions in the content layer.

## 9. Experience Layer & Design System

### Design System Layers

- **Design tokens** — colors, spacing, typography, radii. The atoms.
- **Components** — flashcard, multiple choice, audio player, dialogue line, vocabulary chip, story reader. The molecules.
- **Lesson templates** — Acquire section, Encounter section, Produce section. The organisms.

### Kitchen Sink (Hidden Dev Lesson)

A single page that demonstrates every component in every state — empty, loaded, error, hover, completed, with audio, without audio, etc. Lives at a hidden route. When prompting AI for new components, the instruction is "match the kitchen sink." When debugging visual inconsistencies, it is the reference.

This is the design system's living documentation. It is not optional; it is the artifact that lets the design system stay coherent as the project grows.

### Information Architecture

Sidebar-driven, folder-like. Top-level entries are tracks (Lessons, Graded Readers, Journaling, etc.). Lessons expands to stages (Beginning 1, Beginning 2, ...). Each stage expands to its ordered lessons. Each lesson opens to the Acquire / Encounter / Produce arc.

The home page is light: mission statement, brief description of each track, direction to the sidebar.

## 10. Generation Layer (Future, Designed-For-Now)

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

## 11. Authoring Workflow

Authoring is in raw TypeScript with build-time validation. Friction is acceptable — the content is the product, and human review is a feature, not a bug. AI assists with drafting; the author and a human Korean teacher review.

A small set of build-time scripts support authoring without taking it over:

- **Audio asset pipeline** (§6) — fills in missing audio.
- **Story validator** (§7) — flags unknown tokens and constraint violations.
- **Cross-reference checker** — verifies that lesson manifests reference IDs that actually exist.
- **Lint rules** for content shape — every vocab has a gloss, every grammar has tags, etc.

Heavier tooling (authoring UIs, CMS) is explicitly out of scope. The TypeScript files are the textbook.

## 12. Stack

- **Framework** — Next.js (App Router, React Server Components).
- **Language** — TypeScript throughout.
- **Styling** — Design system token approach; specific implementation TBD.
- **Audio assets** — Git LFS for small canonical audio, object storage for larger generated audio.
- **State (future)** — Supabase.
- **NLP tooling** — kiwipiepy or equivalent Korean lemmatizer in the build pipeline.
- **TTS** — provider TBD pending listening tests.

## 13. Decisions Deferred

These are intentionally not decided yet and will get their own plan files:

- Specific design tokens and component styling.
- Specific TTS provider.
- Generation Layer prompting strategy and validator implementation.
- State Layer schema and auth approach.
- Graded reader UI and reading mechanics.
- Journaling and game features.

## 14. What This Architecture Optimizes For

- **The corpus has compounding value.** Every lesson authored makes every other feature more capable.
- **AI-assisted authoring with human review.** The format stays readable. Validation catches drift.
- **Reusability across projects.** The content layer is portable; another project could consume it.
- **Receptive-first pedagogy as structural default.** The Acquire/Encounter/Produce arc encodes the philosophy.
- **Decoupling from any specific textbook.** The data is the source of truth; textbooks are inspiration for ordering, not content.

## 15. What This Architecture Does Not Try to Do

- It is not a Korean grammar engine.
- It is not a corpus in the linguistic-research sense — it is a curated pedagogical artifact that borrows corpus practices.
- It is not optimized for fast lesson authoring; v1 was, and we are intentionally accepting more friction in exchange for depth.
- It is not a learning companion or adaptive tutor. It is a resource. Learner agency is the design default.
