# Lesson Data Shape — Principles and Lesson 1 Worked Example

A working note from the planning phase. Captures the decisions reached about how lesson content maps to the world data layer, with lesson 1 as the worked case. Sits alongside `WORLD.md`, `LESSONS.md`, `TECH_STACK.md`. The point of writing it now is so we can apply the same shape — and notice where it breaks — as we move through lessons 2, 3, 4, and onward.

This is a working document. It will move.

## 1. The Frame

A lesson is **not** a bundle of content (dialogues, vocab, grammar, exercises) packaged together. A lesson is:

- **A manifest** — fields, allowed values, editability, objectives.
- **A world seed** — the minimum entities and facts the lesson's exercises need to start running.
- **A set of moves** — named exercise patterns that read world state, ask Korean questions, and commit facts.
- **An opening (tutorial-narrative phase)** — hand-written prose that introduces the lesson's voice and walks the learner through the question types.
- **A synthesis closing** — hand-written exercises that demonstrate the lesson's objectives.
- **A vocab corpus contribution** — entries added to the shared corpus for hover-to-gloss.

Old lesson files (the `lesson1.ts` we had from prior projects) mixed all these together because they were shaped for a textbook-reader app. The new shape splits them by role, because each piece has a different consumer.

## 2. The Disambiguation: Two "Seeds"

These were sharing a name and causing confusion:

- **World seed** — the textbook canon written into the DB once at lesson start. Entities and facts with `source='textbook'`. Static, authored by us.
- **Opening / lesson seed phase** — the narrative opening of each lesson (LESSONS §3). Prose plus the first author moves. Experienced by the learner, not loaded into the DB.

They touch each other — opening prompts often write facts via author moves — but they're different files.

## 3. Settled Decisions

These came out of discussion. Each replaced an earlier draft.

### 3.1 Everything is a fact, including names

Entities are stable IDs and a `kind`. Nothing else. Every property of an entity — name, nationality, year, year-of-birth, family role, what's in their backpack — is a row in `attribute_facts` or `relation_facts`.

**Why:** the learner will eventually be able to add, delete, and edit anything. Names can change. Uniformity wins over the convenience of putting names on the entity row. The fact log handles history, supersession, and provenance the same way for every field.

### 3.2 Values are Korean

`nationality = '한국'`, not `'korean'`. Year is `'삼학년'`, not `'3'`. The world data layer stores the actual Korean vocabulary tokens.

**Why:** language is the substance of the platform, not a presentation layer. The recall question "어느 나라 사람이에요?" can read `한국` directly from the fact log and the answer is already in the language the learner is being asked to produce. Glossing to English at render time is a corpus lookup (TECH_STACK §7) — annotation, not translation. This is the single most pleasing structural choice in the model.

**Implications:**
- Names hold Korean strings too (`'스티브 윌슨'`, `'김영미'`). Proper nouns get glossed via a corpus extension if we want hover-to-show-romanization.
- Field naming stays in English (`nationality`, `year`, `name`) because the schema is read by code, not learners.
- A field's `values` list in the manifest is the set of Korean vocab tokens the lesson teaches for that field — and that same list is what multiple-choice moves render as options.

### 3.3 No textbook protection

There is no immutable canon. Every fact can be superseded by the learner, regardless of `source`. The `source` column stays as provenance/history (you can see "this came from the textbook"), but it grants no special status at write time.

**Why:** the learner has total control of their world. If the textbook says Steve was born in Boston and the learner says Tokyo, the learner wins. This matches WORLD.md's commitment to authoring-cannot-be-wrong and removes a class of confusing edge cases.

### 3.4 Lesson content is centered on objectives, not canon

What the textbook *says* about its characters is a starting point, not a constitution. What matters is:

- What pedagogical task/functions the lesson teaches (greet, introduce, describe).
- What language (vocab, grammar) the learner can use by the end of it.
- What world fields and value sets that language operates over.

The world seed is "enough state so the exercises have something to chew on." It's deliberately thin. Gaps in the seed (Sandy's year, etc.) become natural author opportunities.

### 3.5 The fact log is small and uniform

Three core tables: `entities`, `attribute_facts`, `relation_facts`. Same shape across all lessons (TECH_STACK §4). No per-lesson schema. The manifest is the per-lesson knob.

## 4. The Lesson 1 Worked Example

### 4.1 Objectives

From the textbook (KLEAR 2009 edition, lesson 1):

- **Greet someone.** 안녕하세요?, 처음 뵙겠습니다.
- **Introduce oneself.** Name, year, nationality.
- **Describe another person.** Same three fields, using 씨/title in place of "you."

### 4.2 Fields the world needs

| Field | Values | Notes |
|---|---|---|
| `name` | free-text (Korean) | Proper nouns. Not enumerable. |
| `year` | `일학년`, `이학년`, `삼학년`, `사학년` | Closed set. Sino-Korean number + 학년. |
| `nationality` | `한국`, `미국`, `영국`, `일본`, `중국`, `프랑스`, `독일`, `스페인`, `러시아` | Country only; "Country 사람" pattern lives in the grammar/move, not the data. |

### 4.3 World seed

Five characters: Professor Lee, Steve, Young-mee, Michael, Sandy. Facts for name and nationality on all five. Year on four (Sandy's year omitted as an author opportunity).

```typescript
// src/lib/content/lessons/lesson_1/world_seed.ts
export const lesson1Seed: WorldSeed = {
  entities: [
    { id: 'char_prof_lee', kind: 'character' },
    { id: 'char_steve',    kind: 'character' },
    { id: 'char_youngmee', kind: 'character' },
    { id: 'char_michael',  kind: 'character' },
    { id: 'char_sandy',    kind: 'character' },
  ],
  attributeFacts: [
    { entityId: 'char_prof_lee', field: 'name',        value: '이민수 선생님' },
    { entityId: 'char_prof_lee', field: 'nationality', value: '한국' },

    { entityId: 'char_steve',    field: 'name',        value: '스티브 윌슨' },
    { entityId: 'char_steve',    field: 'nationality', value: '미국' },
    { entityId: 'char_steve',    field: 'year',        value: '삼학년' },

    { entityId: 'char_youngmee', field: 'name',        value: '김영미' },
    { entityId: 'char_youngmee', field: 'nationality', value: '한국' },
    { entityId: 'char_youngmee', field: 'year',        value: '일학년' },

    { entityId: 'char_michael',  field: 'name',        value: '마이클 정' },
    { entityId: 'char_michael',  field: 'nationality', value: '한국' },
    { entityId: 'char_michael',  field: 'year',        value: '일학년' },

    { entityId: 'char_sandy',    field: 'name',        value: '샌디 왕' },
    { entityId: 'char_sandy',    field: 'nationality', value: '중국' },
  ],
};
```

### 4.4 Manifest

```typescript
// src/lib/content/lessons/lesson_1/manifest.ts
export const lesson1Manifest: LessonManifest = {
  lessonId: 1,
  titleKr: '인사',
  titleEn: 'Greetings',

  objectives: [
    'greet someone',
    'introduce oneself (name, year, nationality)',
    'describe another person (name, year, nationality)',
  ],

  fields: {
    name:        { values: 'free-text' },
    year:        { values: ['일학년', '이학년', '삼학년', '사학년'] },
    nationality: { values: ['한국', '미국', '영국', '일본', '중국',
                            '프랑스', '독일', '스페인', '러시아'] },
  },

  editable: {
    canAddEntities: ['character'],
    canDeleteEntities: ['character'],
    editableFields: ['name', 'year', 'nationality'],
  },
};
```

### 4.5 First move — Add a Classmate

```typescript
// src/lib/content/lessons/lesson_1/moves/add_classmate.ts
export const addClassmate: Move = {
  id: 'add_classmate',
  lesson: 1,
  mode: 'author',
  leadingQuestionEn: 'A new student joined the class. Who is it?',
  eligible: (_world) => true,

  steps: [
    { kind: 'free-text', field: 'name',        promptKr: '이름이 뭐예요?' },
    { kind: 'choice',    field: 'nationality', promptKr: '어느 나라 사람이에요?' },
    { kind: 'choice',    field: 'year',        promptKr: '몇 학년이에요?' },
  ],

  confirmation: (facts) => [
    `${facts.name}이에요.`,
    `${facts.nationality} 사람이에요.`,
    `${facts.year}이에요.`,
  ],
};
```

`kind: 'choice'` + `field: 'nationality'` causes the runtime to pull options from `manifest.fields.nationality.values`. The move never hardcodes a list.

## 5. The General Principles (apply to every later lesson)

1. **Moves are thin. The manifest is the contract.** A move says "ask about field X." The manifest says "field X has these values and is editable." The runtime stitches them. New lessons mostly add fields to their manifest and reuse existing move templates against the new fields.

2. **A move's mode (author / recall ) can be a function of world state.** The shared-attribute move from LESSONS §5 is the canonical example: same template, switches between recall and author based on whether facts already exist. Most moves are fixed-mode; the polymorphic ones are the interesting craft.

3. **The confirmation function is where the language axis shows up.** It's the only place the move *produces* Korean from world data. The grammar available is bounded by what the lesson has taught. Lesson 1 can use 이에요/예요, 도, 아니에요. Lesson 6 can use past tense. Confirmation strings written for a lesson cannot reach forward; they can reach back into earlier lessons' grammar.

4. **Free-text vs enumerated choice is the only exercise primitive moves decide.** Everything else (which entity, which field, which values) comes from manifest or world state. New primitives (short-answer for synthesis production, sentence-build, etc.) are runtime additions, not move-shape changes.

5. **Steps commit incrementally.** Each confirmed step writes a fact. Abandoning a move halfway leaves a partial entity in the world — that's fine; the world is additive and the editing interface (LESSONS §7) is the cleanup tool. No transaction abstraction.

6. **The same move template is reusable across lessons by swapping the field list.** `add_classmate` in lesson 1 has three steps. In lesson 2 it could have four (adds `major`). The honest move design is a parameterized `add_entity` that takes a kind, a leading question, and a list of fields. We hand-write the lesson-1 version first; the parameterization falls out when the second lesson asks for the same shape.

7. **The world layer and corpus layer do not change as lessons advance.** The manifest is the only per-lesson knob. Schema migrations across lessons are a smell.

## 6. What This Means for Later Lessons

Lesson 1 is the easy case. Walking forward, here are the design pressures each later lesson puts on this shape — listed so we can think about them now and recognize them when they arrive.

### Lesson 2 (Korean Language Class)

Adds **majors** and **opinions about classes / food**.

- New fields on existing characters: `major`, `opinion_korean_class`, `opinion_food`, etc.
- `major` is a closed-set field like `nationality`. Easy.
- **Opinions are the first interesting case.** They aren't single-valued attributes of a person — they're statements *about something*. "Steve likes the cafeteria food" is closer to a relation (`likes(steve, cafeteria_food)`) than an attribute. Or, viewed as an attribute, it lives on a *pair* — Steve's opinion about the cafeteria specifically.
- **Open question:** do we model opinion as `attribute_facts.field = 'opinion_cafeteria_food'` on the character (proliferating fields), or as `relation_facts` where the relation itself carries the polarity (`likes`, `dislikes`)? The relation form scales better — opinions about many things don't blow up the field space. Defer decision until we write lesson 2's manifest.
- **Pedagogical tension:** the language of opinions in lesson 2 is still copular ("재미있어요"). The grammar treats opinion as a property, not as a verb-of-attitude. So the lesson's surface form is attribute-like even if the data model wants it relational. Worth resolving the mismatch once with care.

### Lesson 3 (The University Campus)

Adds **locations** and **spatial relations** (앞, 뒤, 옆, 위, 밑, 안).

- First lesson that uses `relation_facts` heavily. The schema is ready; the move patterns aren't yet.
- New entity kind: `location`. The seed loads buildings and rooms with their containment relations.
- **The big shift pedagogically:** the language is no longer "X is Y." It's "X is *somewhere relative to* Y." Moves need a new shape — they pick two entities and ask about the relation between them. The `shared_attribute` template doesn't generalize cleanly to relations; we'll need a `shared_relation` or `locate_entity` template.
- **Open question:** can a location have attributes the same way characters do? (Number of floors, what's served at the cafeteria, etc.) Yes, by uniformity — but lesson 3 doesn't need it. Worth confirming we don't accidentally close that door.

### Lesson 4 (At Home)

Adds **family relationships** and **counted possessions** (dogs, books).

- Family is straightforward `relation_facts`: `older_brother_of`, `has_parent`, etc.
- **Counted possessions are the first real modeling fork.** Three dogs as `dog_count = 3` (attribute on the owner) vs. three individuated `char_dog_*` entities with `owns` relations.
- **Open question (pedagogical, not just data):** counted form matches the language ("개가 세 마리 있어요"); individuated form supports future lessons that might name a dog or put it somewhere. We don't have to choose forever — the schema allows promotion (count → individuals) — but the lesson 4 author has to pick one for now.

### Lesson 5 (At the Bookstore)

Adds **movement / visits** to locations.

- "Sandy went to the bookstore" is a relation_fact with a `setAt` timestamp. The schema already supports it (every fact has a timestamp).
- **First real cross-lesson read:** lesson 5 reads characters from lesson 1 and locations from lesson 3.
- **Open question:** the manifest's `reads` declaration becomes load-bearing here. We sketched it but haven't pressure-tested. Worth coming back to before lesson 5 work begins.

### Lesson 6 (My Day)

Adds **commute**, **means of transportation**, **past tense**, **frequency**.

- Means of transportation is a *qualified relation* — `commutes_to(michael, school)` with `via = 'bus'`. Three options for qualifiers: (a) separate parallel facts (`commutes_to` + `commutes_via`), (b) JSON column on relation_facts, (c) a side table.
- **Past tense is a language-axis concern, not a data concern.** The fact log already has `setAt`; what changes is the *Korean produced from facts* in confirmation/recall, which now uses past-tense forms.
- **Frequency** ("every day", "sometimes") is harder. It's an attribute on an activity, but the activity itself is a relation. This is when the "events" idea starts knocking, and we'll have to decide whether to model events as first-class entities (a `kind='event'` entity with its own attributes) or keep stretching relations.

### Lesson 7 (The Weekend)

Adds **plans**, **likes/dislikes**, **future tense**.

- Likes/dislikes echo lesson 2's opinions. By now we should have settled the relation-vs-attribute question for those.
- **Plans are facts about future events.** Same `setAt` field, used differently. The interesting question is whether a "plan" is a fact about a future event or a fact about a *present intention*. The language ("내일 영화 볼 거예요") suggests an event with a future time; the data could go either way.

## 7. Tensions and Open Threads

Naming these so they don't quietly disappear.

- **Move parameterization.** Hand-write lesson 1 moves; parameterize when the second lesson asks for the same shape. The shape will reveal itself.
- **Polymorphic moves** (recall ↔ author based on world state). The shared-attribute template is the prototype. Worth one careful write-up when we draft lesson 1's third move.
- **Opinion / preference as attribute vs. relation.** Settle in lesson 2's manifest.
- **Counted vs. individuated possessions.** Settle in lesson 4's manifest. Promotion path stays open.
- **Qualified relations.** Settle when lesson 6 arrives.
- **Events as first-class.** Watch for this in lessons 5–7. Don't add a `kind='event'` until something genuinely forces it.
- **The manifest's `reads`/`writes` declaration.** Sketched but not yet exercised. Lesson 5 is the first real test.
- **Confirmation grammar drift.** As lessons add grammar, confirmation strings can use more sophisticated forms. The discipline is per-lesson, enforced by the author of the move. No automated check yet — worth thinking about whether we want one.
- **Proper nouns and the corpus.** Names in the world are Korean strings; the corpus should know them so hover-to-gloss covers character names. A separate corpus file `proper_nouns.ts` is the likely shape.

## 8. What Comes Next

Two parallel tracks of planning work, before any of this becomes code:

1. **Walk the remaining lesson PDFs.** Lesson 2 first — extract objectives, fields, value sets. Notice where the lesson 1 manifest shape doesn't fit cleanly. Write a similar `02_*.md` doc capturing what changes.

2. **Pressure-test the move catalog.** Sketch — in prose, not code — every move type lesson 1 needs (add classmate, recall nationality, recall year, shared attribute, negotiated authoring) and every move type lesson 3 needs (locate entity, what's in this location, place an object). Notice which shapes recur. The set that recurs is the move catalog.

When both are done, the early-slices plan can be revised with confidence that the data shape we code into will carry.
