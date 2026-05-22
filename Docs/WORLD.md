# Korean Language Learning Platform — World and Exercises

This document describes a direction the platform is taking: each lesson grows a small, persistent *world* that the learner co-authors through their exercises. The architecture and philosophy documents stand. This one extends them. When it conflicts with either, the conflict is real and needs resolving before going further.

This is an early-stage design note. It will move. It is written to be re-read and revised, not to be final.

## 1. The Core Idea

A learner using a Korean textbook reads about characters — Steve, Yumi, Michael, Sophia — going through scenes that mirror the language they're learning. The textbook puts care into these characters, but the relationship stays one-way: the learner reads about them, the characters don't know the learner is there.

This platform proposes a small turn on that: **the textbook's world becomes a world the learner participates in.** Through exercises that practice the lesson's language, the learner *adds to* and *recalls from* a small, persistent world. The textbook gives the seed — its characters, its setting, its arc. The learner fills in the gaps the textbook leaves: who else is in the class, what Tom is studying, where Yumi sits, whose desk has the book on it.

The language practice and the worldbuilding are the same act. A multiple-choice question about nationality is also the moment Tom becomes Vietnamese. A gap-fill about where things are is also the moment the learner places the book on their desk. The world grows at exactly the pace the language does.

This is a companion layer to the textbook, not a replacement. A learner can ignore the world entirely and the lessons still teach Korean. But for those who engage, the world is what makes the language feel like it's *for something* — recall, recurrence, and personal stake without gamification.

## 2. Why This Direction

Three things motivate this, in order of importance.

**Reuse needs a reason to happen.** The philosophy is explicit that depth — items met in many contexts — beats breadth. The architecture supports this through constraint sets and the corpus. But authoring enough varied contexts by hand is expensive, and generic recurrence (drilling old vocab in new sentences) can feel arbitrary. A persistent learner-authored world gives recurrence a natural home. The classmates from lesson 1 reappear in lesson 5 because they're still in your class. The vocabulary follows them.

**Agency without gamification.** The philosophy rules out streaks, points, and badges. It commits to agency as the alternative. But agency needs surface area — places where learner choices actually matter. Worldbuilding exercises give choice a home that's pedagogically meaningful (the choice is expressed in Korean) and doesn't drift into gamified scoring.

**A textbook-aligned companion has real users.** Aligning with *Integrated Korean* (or whatever textbook a learner is using) means classrooms and self-studiers already working through that material can use this as a supplement. The world layer makes the supplement memorable. A learner using both gets the textbook's content with a personal layer the textbook itself can't provide.

## 3. The Shape of an Exercise

Every exercise in this layer does one of three things, or some combination:

**Defines** something in the world. The learner authors. Tom is added to the class; he is from Vietnam; his major is history; his desk has a coffee cup on it. The choice is the learner's, drawn from options expressible in the language they've learned so far. Defining is never wrong — it's authoring, not answering.

**Recalls** something already in the world. The learner is asked about something they (or the textbook) established earlier. Where is Tom from? Who in the class is a junior? What is on Yumi's desk? Recall exercises are answerable from the world state and have a correct answer (the learner's own prior choice or a textbook fact).

**Practices** language without touching the world. The textbook still has plenty of language to practice that doesn't fit worldbuilding cleanly — conjugation drills, vocabulary recognition, particle selection. These exercises live alongside the world layer without using it, or use it lightly for color (the conjugation drill happens to feature Steve eating breakfast). They're not lesser; they're the bulk of language practice, and the world is a layer over them, not a replacement.

The first two exercise types are where this document focuses. The third is what the existing activity inventory in the architecture already handles.

## 4. Two Axes, Kept Separate

This is a discipline worth stating loudly:

**The worldbuilding axis is never wrong.** When the learner chooses Tom is from Vietnam, that is authoring. There is no incorrect answer along this axis. The world updates and moves on.

**The language axis can absolutely be wrong.** If the learner is filling in `톰은 ___ 사람이에요` and spells the country wrong, that's a language error and gets normal feedback.

These two axes share a single exercise but never blur. A worldbuilding exercise can have a language-incorrect answer and a worldbuilding-valid choice in the same response — the learner sees feedback on the language, the world records the choice. This is what makes the system feel kind without going soft: it never tells the learner their imagination is wrong, only their Korean.

## 5. Pedagogical Objectives First

Every lesson's exercises start from what the textbook is teaching the learner to *do*. Worldbuilding never invents pedagogical goals; it serves existing ones.

A worked example with lesson 1, whose objectives are *introducing oneself* and *describing another person* (name, year, nationality):

The textbook gives Steve, Yumi, Michael, Sophia, Lisa, Professor Lee. The world starts with these characters already in place. The worldbuilding move is: *the learner adds more classmates to fill out the class*, and the language used to do so is precisely the language lesson 1 teaches.

An exercise might present: "There are more students in this Korean class. Add one. What is their name?" The learner types a name. Next: "What year are they in?" Multiple choice, four options drawn from the lesson 1 vocab (1학년 through 4학년). Next: "Where are they from?" Multiple choice from the countries lesson 1 introduces. Each step is a real moment of language practice — reading the question, parsing the options, often producing a short answer — and each step writes one fact to the world.

A recall exercise later in the same lesson: "리사 씨는 어느 나라 사람이에요?" The learner answers from the world state. If the textbook established Lisa is American, that's the answer. If the learner has been adding their own characters, those are askable too.

Lesson 2 extends the world without rebuilding it. Its objectives include talking about classes, food preferences, well-being. The world grows accordingly: characters now have classes they're taking, opinions about the cafeteria food. The same characters from lesson 1 are still there; new facts attach to them.

The rule throughout: **the world is only ever extended through the language the learner has been taught.** If lesson 1 doesn't have "favorite color," lesson 1 doesn't ask about favorite color. If lesson 4 introduces colors, lesson 4 can extend the world there. The world's expressive vocabulary is the learner's expressive vocabulary.

## 6. The Constraint Rule, Restated

This is already in the architecture, but it bears repeating from the world layer's perspective because it becomes load-bearing once LLMs enter the picture:

**All Korean the learner is asked to produce, choose between, or comprehend must be inside their current constraint set.** This includes worldbuilding exercises, recall exercises, generated content, scene descriptions, and any text the system places in front of the learner. The constraint set is defined by the architecture: the union of vocabulary, grammar, and expressions introduced up through the learner's current lesson.

When LLMs are introduced (early, after the skeleton is working), every piece of generated text passes through the same validator the architecture already specifies. The world layer doesn't relax this. It tightens it, because now the LLM's job is not just to produce in-constraint Korean but to produce in-constraint Korean *that is consistent with the learner's world state*.

## 7. Persistence and Identity

MVP lessons are isolated for engineering simplicity. Each lesson stands alone: the learner can do lesson 1's worldbuilding without lesson 2's existing, and vice versa. But the data model is designed so cross-lesson connection works as soon as the engineering is ready.

The discipline that makes this possible:

**World entities have stable identities from day one.** Every character, location, object, and fact has a stable ID, the same way the corpus does. The classmate the learner added in lesson 1 has an ID that lesson 5 can refer to. The book on the desk in lesson 4 is still the same book in lesson 9.

**World state is additive.** Authoring writes new facts; it doesn't overwrite the world. If a learner says in lesson 1 that Tom is a junior, that fact persists. If a later lesson introduces majors and the learner sets Tom's major, that's a new fact attached to the existing entity. Nothing is destroyed.

**Lessons declare what they read and what they write.** A lesson's worldbuilding manifest lists which world entities and fields it touches, the same way a lesson manifest lists vocabulary it introduces. This is what later cross-lesson logic will use.

What does *not* happen in MVP: cross-lesson recall, generation that pulls characters across lessons, validation that all lessons are mutually consistent. Those are real engineering and come later. The data is shaped to support them; the logic isn't built yet.

## 8. Views

Every lesson has at least one view: a small visual surface that shows the current state of the world from the lesson's perspective. The classroom view for lesson 1 is the obvious one — a layout of the class with each character labeled and a flag for their nationality.

A few principles:

**Views are second-class citizens.** They render world state; they don't own it. The data model is the project. Views are how the data becomes visible and fun. If a view changes, the data underneath doesn't have to.

**Views can vary in form per lesson.** A classroom view, a map of the school, a desk layout, a chart of who likes the cafeteria food and who doesn't, a list, a simple diagram with characters on two sides of a line — whatever fits the data the lesson works with. Some views might be node-and-edge diagrams; most won't. The form follows the content.

**Views are not the experience.** The exercises are the experience. The view is the artifact that makes the exercises feel like they're building something. A learner who never opens a view should still be doing real worldbuilding through the exercises; opening the view shows them what they've built.

**Views should be honest about what they show.** A view never invents data. If lesson 1 only knows about characters' names, years, and nationalities, the classroom view shows only those. It doesn't pad with fictional details. When lesson 2 adds classes, the classroom view can show them; before then, that field doesn't exist and the view doesn't pretend it does.

Visualization is a real design space and an opportunity for craft. It's also a place the project could lose months. MVP views should be small, static, and accurate. Polish comes later.

## 9. The MVP

The minimum thing that demonstrates whether this direction works:

1. Lesson 1, fully ported to the world layer: textbook characters seeded, worldbuilding exercises that let the learner add a small number of classmates with name, year, and nationality, recall exercises that draw from both textbook and learner-added characters, the classroom view rendering the result.

2. A learner world-state data model that supports lesson 1 cleanly and is shaped to extend to lesson 2 without rework.

3. The exercise framework that distinguishes defining, recalling, and pure language practice — and keeps the worldbuilding axis and language axis separate in feedback.

4. One view (classroom) rendered from the world state.

That's it. If lesson 1 in this form feels alive and useful, lesson 2 follows naturally. If it doesn't, we've learned something cheaply.

What's deliberately out of MVP scope: LLM-generated exercises (comes next, once skeleton works), cross-lesson world connection (designed-for but not built), multiple views per lesson, fancy visualization, dynamic world state that reacts to engagement traces, anything resembling a graph database, anything resembling a small-models-reading-the-field substrate.

## 10. After MVP

Named here so the bones don't preclude them:

**LLM-generated exercises.** Once the skeleton works, an LLM can generate variation within a lesson's constraint set and world state. Constraint validation is mandatory: every generated sentence is tokenized and checked against the learner's constraint set, same as authored content. World consistency is also checked: the generated content must reference the learner's actual world state, not invent characters or facts. This is where the constraint rule becomes engineering rather than discipline.

**Cross-lesson connection.** Characters from lesson 1 appear in lesson 5's exercises. The book the learner placed on the desk in lesson 4 is still there in lesson 9. This requires the persistence work named in section 7 plus the logic for lessons to opt into reading prior world state.

**Richer views.** As the world thickens — locations, objects, relationships — views can get more interesting. A school map, a relationship diagram, a desk with movable objects. Visualization becomes a real design space.

**The graph thing, if it earns its place.** The world is conceptually a graph: entities (characters, locations, objects) connected by typed relationships, with attributes on both. For MVP it's a flat data model — TypeScript interfaces and a record per learner. If, later, we want to do things that genuinely require graph traversal (find all characters who've appeared in scenes involving food and are studying history) or graph dynamics (decay traces over time on entities the learner hasn't touched), the data is shaped to lift cleanly into a real graph representation. We don't reach for it until something forces it.

## 11. Open Questions

These are real and unresolved.

**How much choice is the right amount per lesson?** Too little and worldbuilding feels token; too much and the learner is doing creative work instead of language work. Lesson 1 probably wants a small number of authoring moments and a larger number of recall moments. The right ratio will reveal itself in the building.

**What happens when a learner skips worldbuilding exercises?** Some exercises will be optional or skippable. If a learner skips the "add a classmate" exercise, the recall exercise that depends on it can't be asked. Either the system has sensible defaults (textbook characters always present, learner-added characters layered on if they exist) or worldbuilding exercises are required and the learner can't skip past them. The first is gentler and probably right.

**How prescriptive is the textbook's world vs. how authored is the learner's?** The textbook says Lisa is American. Can the learner change that? Probably not — the textbook is the seed and the seed is fixed. But the textbook says nothing about Lisa's major; the learner can author that. The line between "textbook canon" and "learner-authorable" should be explicit in the data model.

**Does the world ever forget?** Slime mold thinking suggests traces decay. For now, no — facts the learner authors stay. If later we want to surface things the learner hasn't engaged with recently as candidates for recall, that's a trace-and-decay layer over the persistent world, not a replacement for it.

**The right name for this whole layer.** "World," "companion world," "shared fiction," "the layer" — none feel right yet. The right name will come.

## 12. What This Layer Optimizes For

- **Personal stake without gamification.** The learner cares because they authored, not because they're scoring.
- **Recurrence with meaning.** A vocabulary item reappears because Tom is still in the class, not because the SRS scheduler said so.
- **Textbook alignment.** A classroom or self-studier using *Integrated Korean* can use this as a supplement that respects what they're already doing.
- **A small, simple MVP that doesn't preclude what comes later.** Same discipline as the rest of the architecture.

## 13. What This Layer Does Not Try to Do

- It is not a game. There's no win condition, no score, no progression in the gamified sense.
- It is not a creative writing tool. Authoring happens within tight language constraints, by design.
- It is not a replacement for textbook content. The textbook is the source of language; the world is a layer over it.
- It does not solve every pedagogical problem. Many exercises will sit outside the world layer entirely, and that's fine.
- It is not a graph database project, a visualization project, or an LLM project. It's a language learning project that uses a small persistent world to make recurrence and agency real.
