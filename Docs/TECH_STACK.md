# Korean Language Learning Platform — Tech Stack and Data Structure

A working document for the technical foundation: the stack we're building on, and — more importantly — the data structure that has to carry the world layer from lesson 1 through lesson 7 and beyond. The tech stack section is short. The data structure section is the real content, because that's where the project succeeds or fails.

This sits alongside `WORLD.md` and `LESSONS.md` and extends them. When something here conflicts with either, the conflict is real and needs resolving before going further.

## 1. The Stack, Briefly

- **SvelteKit + TypeScript.** Frontend framework and routing. Server logic lives in `+page.server.ts` and `+server.ts` files; UI in `.svelte` components. The world-layer reactive surface (the view that updates as authoring exercises commit) is a natural fit for Svelte stores.
- **Drizzle ORM.** Typed SQL query builder with a schema-first migration system. Schema is plain TypeScript in `src/lib/server/db/schema.ts`. Drizzle generates migrations from that file and types every query automatically. We get SQL-shaped queries (good — we'll need recursive CTEs for location traversal), full type inference, and SQLite-now/Postgres-later portability.
- **SQLite via `libSQL`.** Local file database. Fast, embedded, ships with the app. We'll outgrow it eventually — but probably not before we've validated the platform's core direction.
- **No service layer or separate API.** This is a solo project. Load functions and form actions import the db and schema directly. The query layer in `src/lib/server/world/` is the only abstraction we want; everything routes through it.

Project layout:

```
src/
  lib/
    server/
      db/
        schema.ts       # Drizzle schema (source of truth)
        index.ts        # db client
        migrations/     # generated
      world/            # the query layer — every world read/write goes here
        entities.ts
        facts.ts
        relations.ts
    content/
      lessons/          # lesson manifests, seeds, moves, synthesis
      corpus/
        vocab/          # per-lesson vocab files (TS or JSON)
        lookup.ts       # the gloss-finding function (see §7)
  routes/
    lessons/[id]/       # per-lesson UI: seed, branching, synthesis
```

The stack choices matter, but they're not the hard part. The data structure is.

## 2. Why Data Structure Is the Document

Looking across lessons 1 through 7, the world layer goes through phase transitions that a flat data model can't survive. Lesson 1 is easy: characters with three or four attributes. Lesson 3 introduces locations with containment and adjacency. Lesson 4 introduces typed relationships between characters and possessions with quantities. Lessons 5 through 7 add events, movement, time, frequency, and preferences. Each of these is the kind of thing a flat record-per-entity model handles badly. Each of these is the kind of thing a fact-log model handles naturally.

The choice we make now — fact-log over flat records — is the choice that lets every later lesson extend the world without rewriting it. That's what makes this a data structure document, not a tech stack document.

## 3. The Core Insight: Everything Is a Fact

The world isn't a set of objects with mutable fields. It's an append-only log of facts about entities. Current state is computed by asking "what are the most recent un-superseded facts about this entity?" — never by reading a mutable column.

This is the SCD Type 2 instinct (slowly-changing dimension, type 2): instead of `UPDATE row SET field = new_value`, we mark the old fact superseded and insert a new fact. The book moves from Tom's desk to Yumi's desk by superseding the `on_top_of(book_1, tom_desk_1)` fact and writing a new `on_top_of(book_1, yumi_desk_1)` fact. Tom's history of where the book lived is queryable forever. Nothing is destroyed.

Three things this gets us, all of which we need:

**Genuine additivity.** WORLD.md §7 commits to "world state is additive." A fact log is what makes that real, not just an aspiration. The only "destructive" operation is the deliberate edit in the editing interface (LESSONS.md §7), which itself is just another fact written to the log with appropriate provenance.

**Provenance on every fact.** Each fact carries who set it (textbook, learner, or, later, an LLM), in which lesson, when. The textbook-canon-vs-learner-authorable line from LESSONS.md §12 stops being an open question and becomes a check at write time: "this field is textbook-protected on this entity; learner facts cannot supersede it."

**Free time-travel.** "What did the learner believe about Tom in lesson 3?" is a query against `set_at < lesson_3_completed_at`. We don't need this for MVP. We'll be glad we can do it without rebuilding the data model when the trace-and-decay layer in WORLD.md §10 becomes interesting.

## 4. The Three Core Tables

The schema is smaller than it looks. Three tables carry almost everything.

### entities

Anything that exists in the world. Characters, locations, objects — all the same shape. The `kind` field discriminates.

```typescript
export const entities = sqliteTable('entities', {
  id: text('id').primaryKey(),               // stable forever: 'char_tom_a3f', 'loc_union_hall_a3f'
  learnerId: text('learner_id').notNull().references(() => learners.id),
  kind: text('kind').notNull(),              // 'character' | 'location' | 'object'
  source: text('source', { enum: ['textbook', 'learner'] }).notNull(),
  createdInLesson: integer('created_in_lesson').notNull(),
  createdAt: integer('created_at').notNull(),
});
```

Every entity belongs to a learner — including the textbook-canon ones. At seed time, each learner gets their own copy of Steve, Yumi, Michael, and so on. This sounds wasteful but isn't: it keeps every query a simple `WHERE learnerId = ?` filter, never a union of "global entities + my entities." Two learners diverging on what they author about Lisa is the whole point of the platform; we shouldn't fight it with a shared-Lisa schema.

Stable IDs are non-negotiable. The ID is the identity across all lessons forever — the WORLD.md §7 promise that "the classmate the learner added in lesson 1 has an ID that lesson 5 can refer to" only works if IDs never recycle. The decision to unify characters, locations, and objects into one table is also load-bearing. It's what makes "book on desk" and "table in classroom" and "Tom sitting at Yumi's desk" the same kind of statement — a relation between two entities. If we split into a `characters` table and a `locations` table and an `objects` table, we'd need union types and polymorphic joins everywhere, and the spatial queries would become ugly. One table, kind column, done.

### attribute_facts

Single-valued attributes about an entity. Tom's nationality. Lisa's major. The classroom's floor number. The book's color.

```typescript
export const attributeFacts = sqliteTable('attribute_facts', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').notNull().references(() => learners.id),
  entityId: text('entity_id').notNull().references(() => entities.id),
  field: text('field').notNull(),            // 'nationality', 'year', 'major', 'color'
  value: text('value').notNull(),
  source: text('source', { enum: ['textbook', 'learner', 'llm'] }).notNull(),
  setInLesson: integer('set_in_lesson').notNull(),
  setAt: integer('set_at').notNull(),
  supersededAt: integer('superseded_at'),    // null = current truth
});
```

Current truth is `WHERE superseded_at IS NULL`. Always. There's no other source of current state. We don't cache derived state in a separate table; we don't denormalize current values onto entities. One source of truth, the query for "what's currently true" is the same query everywhere.

The performance question — "isn't recomputing current state on every read expensive?" — answers itself in practice. SQLite with proper indices on `(entity_id, field, superseded_at)` handles tens of millions of facts before this becomes interesting, and we'll have on the order of hundreds per learner. If profiling ever shows a problem, a materialized view goes on top. We don't preempt that.

### relation_facts

Two-entity statements. The book is on the desk. The desk is inside the classroom. Tom's older brother is Sam. The cafeteria is beside the library.

```typescript
export const relationFacts = sqliteTable('relation_facts', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').notNull().references(() => learners.id),
  subjectId: text('subject_id').notNull().references(() => entities.id),
  relation: text('relation').notNull(),      // 'inside', 'on_top_of', 'beside', 'older_brother_of'
  objectId: text('object_id').notNull().references(() => entities.id),
  source: text('source', { enum: ['textbook', 'learner', 'llm'] }).notNull(),
  setInLesson: integer('set_in_lesson').notNull(),
  setAt: integer('set_at').notNull(),
  supersededAt: integer('superseded_at'),
});
```

This is the table that turns a flat database into a graph. Every relation is an edge; every entity is a node. The graph query patterns ("everything contained in the student center, transitively"; "all of Tom's family members"; "what's on every desk in the classroom") fall out as recursive CTEs against this table.

Why two tables (attribute_facts and relation_facts) instead of one unified facts table with a JSON payload? Typed columns are pleasant to query. The schema documents itself. SQLite query planning is simpler. The small duplication of `source`/`setInLesson`/`setAt`/`supersededAt` across both tables is worth it.

## 5. Walking Through the Lessons

The test of this schema is whether each lesson's content fits naturally. Let me walk through.

**Lesson 1 (Greetings)** introduces six textbook characters (Steve, Yumi, Michael, Sophia, Lisa, Professor Lee) and their nationalities and years. The learner adds classmates with the same attributes.

```
entities:       char_steve, char_yumi, char_michael, char_sophia, char_lisa,
                char_prof_lee, char_classroom_1, [learner-added: char_tom, ...]

attribute_facts:
  char_steve   nationality   'american'    textbook
  char_steve   year          '3'           textbook
  char_yumi    nationality   'korean'      textbook
  ...
  char_tom     nationality   'vietnamese'  learner    lesson=1
```

Nothing exotic. The flat-table version would handle this fine. But the schema we have is the same one that handles everything later.

**Lesson 2 (Korean Language Class)** adds majors and feelings about classes/food. Same characters, new fields.

```
attribute_facts:
  char_sophia  major         'economics'   textbook   lesson=2
  char_steve   opinion_korean_class  'fun' learner    lesson=2
```

Same table, new `field` values. The lesson 2 manifest declares it writes `major` and `opinion_*`; lesson 1 didn't touch those fields, lesson 2 does. Nothing in the schema changes.

**Lesson 3 (The University Campus)** is where the flat model would have already broken. Buildings, floors, classrooms, cafeterias, post offices, libraries — and the language for talking about them is *spatial*. 앞, 뒤, 옆, 위, 밑, 안 — front, back, beside, above, below, inside. The textbook tells the learner the cafeteria is inside the Union Building, which is in front of the post office. Royce Hall has the Korean classroom on its third floor.

This is all relation_facts.

```
entities:       loc_union_building, loc_post_office, loc_library,
                loc_royce_hall, loc_third_floor, loc_korean_classroom,
                loc_cafeteria_union, loc_cafeteria_behind_library

relation_facts:
  loc_cafeteria_union     inside       loc_union_building       textbook
  loc_union_building      in_front_of  loc_post_office          textbook
  loc_korean_classroom    inside       loc_third_floor          textbook
  loc_third_floor         inside       loc_royce_hall           textbook
```

Now "where is the cafeteria?" is a query against `relation_facts`. "What's in the Union Building?" is a query. "What buildings does this campus have?" is a query. And critically — the recall exercise that asks the learner *where* something is can pull from exactly the same data the textbook seeded, with no special-casing.

The recursive query for nested containment ("everything anywhere inside Royce Hall") is a CTE we'll write once and reuse:

```sql
WITH RECURSIVE contained AS (
  SELECT subject_id FROM relation_facts
    WHERE relation = 'inside'
      AND object_id = 'loc_royce_hall'
      AND superseded_at IS NULL
  UNION
  SELECT rf.subject_id FROM relation_facts rf
    JOIN contained c ON rf.object_id = c.subject_id
    WHERE rf.relation = 'inside' AND rf.superseded_at IS NULL
)
SELECT * FROM contained;
```

We don't need this for MVP. We will need it by lesson 4 when desks contain objects that contain other objects.

**Lesson 4 (At Home)** introduces family relationships and counted possessions. Older brother, younger sister, parents, dogs, books.

Family is relation_facts with a typed relation:

```
relation_facts:
  char_sophia  older_brother_of   char_sophia_brother   learner   lesson=4
  char_sophia  has_parent         char_mrs_wang         learner   lesson=4
```

Possessions are interesting. "Sophia has three dogs" is a count. Two options: a relation_fact per dog (three separate `owns` facts pointing at three entities), or an attribute_fact like `dog_count = 3`. Which we pick depends on whether the dogs are *individuated* — do they have names, do they appear in later exercises, do they go on desks. If yes, three entities and three relations. If they're just a count, an attribute.

For lesson 4, the textbook treats animals and books as counted nouns, not individuals. So we model them as attributes:

```
attribute_facts:
  char_sophia  dog_count    '3'   learner   lesson=4
  char_steve   book_count   '5'   learner   lesson=4
```

If a later lesson wants a specific dog to have a name, we promote: create a `char_dog_max` entity, write an `owns` relation, decrement (supersede) the count. The schema doesn't fight either direction.

**Lesson 5 (At the Bookstore)** introduces movement. Sophia goes to the bookstore. Michael studies in the library. This is the moment when location stops being purely static and starts being a destination of action — but the schema doesn't need to grow. A trip is just a relation:

```
relation_facts:
  char_sophia  visited      loc_bookstore   learner   lesson=5   set_at=...
```

If the learner says Sophia went to the bookstore yesterday, we have the timestamp on the fact. Past-tense exercises (lesson 6) become recall queries against historical facts. We get this for free because every fact already has `setAt`.

**Lesson 6 (My Day)** introduces commute, means of transportation, past tense, frequency. Michael takes the bus to school. Sophia walks to the library every day.

Means of transportation is a relation with a qualifier — `commutes_by(char_michael, loc_school, vehicle: 'bus')`. Two ways to model qualifiers: a small relation_fact_qualifiers side table, or a JSON column on relation_facts. For MVP we keep it flat: separate facts for `commutes_to` and `commutes_via`, joined at query time. JSON enters only if it's clearly needed.

Frequency ("every day", "sometimes") is an attribute on the relation. Same question. Same answer for MVP: model as a separate attribute_fact on a synthetic "activity" entity, or as an event with a frequency field. We'll see which feels more natural when we write the lesson 6 manifest.

**Lesson 7 (The Weekend)** is plans, likes and dislikes, future tense. Preferences are attributes (`likes_action_movies = true`); plans are facts about future events that haven't happened yet. The schema absorbs both.

The point of this walkthrough isn't that everything is trivial — some of these (qualifiers on relations, individuated vs counted possessions) are real modeling decisions. The point is that none of them require changing the schema. The same three tables carry all seven lessons. They'll carry the next twenty.

## 6. Lesson Manifests

Each lesson declares what it reads and writes, the same way it declares the vocabulary it introduces. This is a fourth table — and it's what makes the editing interface (LESSONS.md §7) scope correctly, and what makes cross-lesson read logic possible later.

```typescript
export const lessonManifests = sqliteTable('lesson_manifests', {
  lessonId: integer('lesson_id').primaryKey(),
  reads: text('reads', { mode: 'json' }).$type<ManifestRead>().notNull(),
  writes: text('writes', { mode: 'json' }).$type<ManifestWrite>().notNull(),
  textbookProtected: text('textbook_protected', { mode: 'json' })
    .$type<ProtectedFields>().notNull(),
});
```

`ManifestRead` says: lesson 5 reads characters' nationalities (from lesson 1), majors (from lesson 2), and the campus locations (from lesson 3). `ManifestWrite` says: lesson 5 writes the `visited` relation and the `study_location` attribute on characters. `textbookProtected` is the explicit list answering LESSONS.md's open question (§12): lesson 1's textbook says Lisa is American, and that fact is protected — learner facts cannot supersede it. Lisa's major isn't protected; the learner can author it in lesson 2.

The manifest is content, not code. It lives in TypeScript in `src/lib/content/lessons/lesson_1/manifest.ts` and gets loaded into the database on seed. When a lesson changes, the manifest changes with it.

## 7. Vocabulary Lookup (Not a Constraint System)

The earlier draft of this document proposed a constraint validator with a corpus in the database, a tokenizer, lemmatization, and grammar checking. That was over-engineered for the actual need. The actual need is much smaller.

What the platform needs is **hover-and-click glossing**: a learner sees a Korean word in any text, hovers or taps it, gets a small popover with the English gloss and the lesson it was introduced in. That's it. No enforcement. No rejection. Annotation, not validation.

Reframing this way collapses the section dramatically.

### The vocabulary lives as content, not data

Vocabulary stays in TypeScript or JSON files under `src/lib/content/corpus/`, authored alongside lessons and shipped with the app. It is not a database table. Drizzle doesn't know about it. The schema doesn't grow. The yaml you shared (`beginning-1-vocab.yaml`) is roughly the right shape, with one extension covered below.

The shape per entry:

```typescript
export type VocabEntry = {
  lemma: string;            // dictionary form: 먹다
  forms: string[];          // every surface form a learner has been shown
  pos: string;              // NNG, VV, VA, JKS, etc.
  gloss: string[];          // English meanings
  introducedInLesson: number;
  tags?: string[];          // 'humble', 'pre-noun', 'honorific'
};
```

The `forms` field is the one addition over the yaml. For nouns and particles, `forms` is just `[lemma]`. For verbs and adjectives, `forms` lists every conjugated surface form the learner has actually been shown by that lesson. 먹다 in lesson 2 lists `[먹다, 먹어요, 먹어]`. When lesson 6 teaches past tense, the lesson 6 vocab file *adds* `먹었어요` to the same entry — either by editing the existing entry or by adding a small "form extension" file that the loader merges. Either works; the second keeps each lesson's content additions in its own file, which is probably cleaner.

This is deliberately boring. No conjugation engine. No morphological analysis. If the lesson teaches a form, the form is listed. If it doesn't, it isn't. The corpus mirrors what the learner has actually seen, which is exactly what we want for "show me where this came from."

### The lookup is a string match

The function the rest of the app uses:

```typescript
// src/lib/content/corpus/lookup.ts
type GlossHit = {
  matchedForm: string;
  entry: VocabEntry;
  position: { start: number; end: number };
};

function findGlossableSpans(text: string, throughLesson: number): GlossHit[];
```

The implementation is straightforward: walk through `text` character by character, at each position try to match the longest known form from the corpus that's `introducedInLesson <= throughLesson`. Record the hit, jump past it, continue. Words not in the corpus are simply left unhighlighted — no error, no rejection, the learner sees them as plain text.

Longest-match-first handles overlapping vocabulary cleanly. 한국어 (Korean language, one entry) doesn't get falsely split into 한국 + 어 if both are in the corpus, because the longer match wins.

Korean's lack of whitespace between morphemes inside a word means tokenization-by-splitting won't work — but tokenization isn't what we're doing. We're scanning for known forms. The lookup doesn't need to understand grammar; it just needs to find strings.

### What this means for `world/constraints.ts`

It doesn't exist. The query layer loses that file. The corpus lookup lives in `src/lib/content/corpus/` next to the corpus itself, because it's pure content-side logic with no database dependency. The world layer is purely about world state.

### What this means when LLMs arrive

The same lookup runs against generated output as a sanity check: tokenize-by-known-forms, count what fraction of the output is recognized vs. unknown, flag generations with significant unknown content for review. It's a smell test, not a gate. If the LLM occasionally produces a particle that isn't in the corpus, that's a signal we might be missing an entry or that the LLM is reaching outside the constraint — both worth knowing about, neither requiring a blocking validator.

The honest framing: we trust the LLM to mostly stay in-scope (good prompting and the lesson context handle that), and the lookup gives us the spot-check. If that turns out to be insufficient, we can tighten it. We haven't earned the right to tighten preemptively.

## 8. Moves as Content, Not Code

LESSONS.md §5 commits to moves as prose written by the author, with the data representation falling out of the writing. The implication for the schema is: moves don't go in the database as parametric configurations. They live in TypeScript in `src/lib/content/lessons/lesson_1/moves/shared_attribute.ts` (or similar) as functions or objects that the move-picker imports.

The picker's job (LESSONS.md §6) is to ask each move's `preconditions` function whether it's eligible given the current world state, and return three eligible moves to the branching screen. The move file owns its own logic: it inspects world state via the query layer, decides its branch (recall / author / author-with-two-stages), and renders its exercises.

This keeps the database focused on world state (entities, facts, manifests) and lets move authoring stay in writeable code where it belongs. When we later want a data representation of moves — for analytics, or for an authoring UI — we add a table then. For MVP, moves are code.

## 9. The Query Layer

`src/lib/server/world/` exposes the operations the rest of the app uses. Nothing else touches the schema directly.

The shape:

```typescript
// world/entities.ts
createEntity(input): EntityId
getEntity(id): Entity | null
listEntitiesByKind(kind): Entity[]

// world/facts.ts
commitAttributeFact(entityId, field, value, source, lessonId): FactId
getCurrentAttribute(entityId, field): string | null
getAttributeHistory(entityId, field): AttributeFact[]
listAttributesForEntity(entityId): Record<string, string>

// world/relations.ts
commitRelationFact(subjectId, relation, objectId, source, lessonId): FactId
getRelationsFrom(entityId, relation?): RelationFact[]
getRelationsTo(entityId, relation?): RelationFact[]
getContainedEntities(locationId, recursive: boolean): EntityId[]
```

Vocabulary lookup is intentionally outside this layer — it's content-side logic, not world state. See §7.

The world layer enforces the rules: `commitAttributeFact` checks the lesson manifest's writes list, checks textbook protection, supersedes prior facts on the same `(entity, field)` automatically. The caller doesn't have to remember to do it; the layer does. This is what makes the LESSONS.md invariants enforceable rather than aspirational.

## 10. The MVP Schema

What we build first:

- `entities`, `attribute_facts`, `relation_facts`, `lesson_manifests`, `learners`.
- The query layer with the operations above.
- The vocabulary corpus as TS/JSON content files, with the lookup function (§7).
- A seed script that loads lesson 1's textbook canon: six characters with their nationalities and years, the classroom entity, the relations between them.
- A lesson 1 manifest and a stub lesson 2 manifest. The stub manifest is what proves the data carries across (LESSONS.md §9): even before lesson 2's content exists, lesson 2 can read from lesson 1's world state.

### Multi-user from day one

Since the platform will eventually have multiple users with accounts, every fact and entity carries a `learnerId` from the start (see §4). The `learners` table:

```typescript
export const learners = sqliteTable('learners', {
  id: text('id').primaryKey(),
  currentLesson: integer('current_lesson').notNull().default(1),
  createdAt: integer('created_at').notNull(),
  // email, auth, etc. added when accounts arrive
});
```

This is the one place where premature work is worth it. Adding `learnerId` later means migrating every existing row and backfilling. Adding it now costs nothing — for MVP, every fact carries the same dev-user ID. The corpus stays global (it's shared content, not per-learner state). Lesson manifests stay global too.

Indices that matter from the start: `(learner_id, entity_id, field, superseded_at)` on attribute_facts and `(learner_id, subject_id, relation, superseded_at)` on relation_facts. These are the queries that run every time the world view renders.

What's deliberately out:

- Materialized views for current state. Not needed at our scale.
- Trace/decay columns. Post-MVP.
- Move tables. Moves are code.
- LLM provenance plumbing. The schema accepts `source: 'llm'`, but we don't wire it until LLMs arrive.
- A separate "events" table. Movement and visits are relation_facts with timestamps. If we later need richer event structure (duration, participants, etc.), we add it then.
- Authentication. The schema is shaped to accept it; the implementation waits.
- A `vocabulary` table. Vocab is content, not data.

## 11. Open Questions for the Data Layer

These are real and unresolved. Listing them so they don't quietly disappear.

**Qualified relations.** The Sophia-takes-the-bus-to-school example: do we model as a separate qualifier table, as JSON on relation_facts, or as multiple parallel facts joined at query time? Defer until lesson 6 forces a decision; the MVP doesn't need it.

**Counted vs. individuated possessions.** Three dogs as `dog_count = 3` is clean for lesson 4. Three dogs as `[char_dog_1, char_dog_2, char_dog_3]` each with their own relations is clean for any lesson that names them. The promotion path (count → individuals) is fine in this schema; the question is when the platform should ask the learner "do you want to name them?" or quietly choose for them.

**LLM provenance and audit.** When LLMs generate content, every generation needs to be tied back to the world state it read and what fraction of its output the vocab lookup recognized. This is a separate logging concern, not a schema concern, but it touches the schema enough to flag now.

**Form coverage as the corpus grows.** The lookup only highlights forms explicitly in the corpus, which means missing entries quietly turn into ungloss-able words. This is acceptable — failure mode is "no popover," not "wrong popover" — but it suggests a periodic content audit: scan all hand-authored textbook content with the lookup, report unrecognized strings, decide whether each is a corpus gap or genuinely out-of-scope.

## 12. What This Document Optimizes For

- **A schema small enough to hold in one's head.** Three core tables (`entities`, `attribute_facts`, `relation_facts`) plus two supporting ones (`lesson_manifests`, `learners`). Every later lesson uses the same shape.
- **Honesty about what the data is.** A fact log is what we have. Current state is a query against that log. We don't pretend.
- **Provenance and additivity as defaults, not features.** Every fact has a source, a lesson, a timestamp. Nothing is overwritten. The WORLD.md and LESSONS.md commitments to additivity, textbook protection, and audit trail are enforced at the schema level, not the application level.
- **A path to graph-shaped queries without committing to a graph database.** Recursive CTEs in SQLite handle the spatial and relational queries we need for the foreseeable future. If something genuinely forces a graph database later, the data lifts cleanly.
- **Vocab as content, not engineering.** Glossing is a string lookup against authored content files. No tokenizer, no lemmatizer, no validator that can reject. The simplest thing that supports hover-to-gloss is the thing we build.
- **A small MVP that doesn't preclude what comes later.** Same discipline as the rest of the architecture.

## 13. What This Document Does Not Try to Do

- It is not a specification. It's a working note. The schema as written will shift as we build.
- It is not a performance plan. We profile when something is slow, not before.
- It is not the move-authoring system. That's in `LESSONS.md` and lives in code, not data.
- It is not the LLM integration plan. That arrives after MVP works, and the schema's job at that point is to accept LLM-sourced facts and audit them, not to direct the integration.
- It is not the visualization plan. Views render from the data; they don't shape it.
