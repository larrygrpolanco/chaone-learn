# Korean Language Learning Platform — World, Moves, and Lessons

A design document for the world layer, the exercise system, and the per-lesson structure. This sits alongside `WORLD.md` and extends its direction with the decisions reached through discussion.

This is a working document. It will move. It is written to be re-read and revised.

## 1. What This Document Adds

`WORLD.md` established the world layer's purpose: language practice and worldbuilding as a single act, recurrence with meaning, agency without gamification. This document goes further down — into the rhythm of a lesson, the kinds of exercises that compose it, the rules the system never breaks, and the structure of the "moves" that drive procedurally varied practice.

When this conflicts with `WORLD.md` or the architecture, the conflict is real and needs resolving before going further.

## 2. The Invariants

A small set of rules the system never breaks. They exist for the same reason a tabletop game's GM principles exist: consistency is what lets the learner internalize how the world works without anyone having to explain it. When a clever exercise idea later wants to break one of these, the list pushes back.

1. **Author questions never have wrong answers.** The worldbuilding axis cannot be failed.
2. **Author questions always confirm.** A choice that writes to the world is restated back in Korean before being committed.
3. **Recall questions feel safe.** Wrong answers are corrected gently, with no consequences beyond the correction.
4. **The world is never destructively changed by exercise side-effects.** Edits happen in the seed, in the explicit editing interface, or through deliberate author exercises with confirmation. Never as a consequence of a wrong recall answer.
5. **All Korean shown to the learner is inside their constraint set.** Generated text passes through the validator; authored content respects it.
6. **The platform never tells the learner their imagination is wrong.** Only their Korean.

These will grow as the platform grows. New invariants are added only when something has been broken once and the breakage taught us a rule worth holding.

## 3. The Shape of a Lesson

Every lesson moves through three phases. The phases are visually and functionally distinct.

**Seed.** The mandatory minimum. Textbook canon is loaded into the world; the learner is asked the smallest set of questions needed to make the lesson's exercises work. In lesson 1, the seed is also the tutorial — it introduces every question type the learner will encounter, in-character, in Korean, through narrative. In later lessons, the seed is tighter and more narrative, no longer doing tutorial work.

The seed is hand-written per lesson. It's the writing-heaviest part of each lesson and the part where the lesson's voice gets established.

**Branching practice.** The middle of the lesson. The learner is offered three procedurally-chosen "moves" (the exercise units described in section 5) plus a shuffle option. They pick one, work through it, return to the choice screen, pick another. The world view is accessible throughout, and the editing interface lives there. The learner decides when to move on to synthesis.

**Synthesis.** The closing phase. Two to three exercises aligned to the lesson's pedagogical objectives, demonstrating what the learner can do with the lesson's language in the world they've built. Mostly recall, with at least one production exercise (a longer utterance the learner composes). Visually and tonally distinct from branching practice — more narrative, more audio, slower-paced. No score; a soft "when this feels comfortable, move on."

The learner can return to the seed at any time to redo the setup. They can move from branching to synthesis whenever they choose. The lesson ends when the learner decides it does.

## 4. The Two Exercise Modes

Every exercise in the world layer is one of two modes. The distinction is the most important single thing about the system's design.

**Author.** The learner writes to the world. There is no wrong answer along the worldbuilding axis. Choices are restated in Korean for confirmation before being committed. The language axis can still be wrong — spelling, conjugation, particle choice — and gets normal feedback. Author exercises are visually marked (color, with a secondary signal for accessibility — an icon, a verb in the prompt, eventually small flair like background texture).

**Recall.** The learner reads from the world. Questions are about facts already established (by the textbook, the seed, or prior authoring). Wrong answers get gentle correction — a shake, the choice greying out, another try. No consequences. Recall is also visually marked, distinctly from author.

A third pattern sits between these and is worth naming as its own thing: **negotiated authoring**, where a character states a fact and asks the learner to confirm or push back. "톰은 일본 사람이에요?" 네/아니요. If the learner says no, the system asks what the character is instead. This pattern is the most distinctive voice the platform has — it makes settling facts feel like negotiation rather than testing, and it's the natural transition between recall (the character has a position) and author (the learner can override it). It appears throughout the lesson but especially in seeds.

Drills — pure language-practice exercises with no world connection — are not a separate category. They're recall exercises with the world-flavor turned down. The generation system can produce exercises across a spectrum from "no world, just language" to "fully world-grounded," and which end gets emphasized is a function of what the lesson and the learner's state need.

## 5. Moves

A move is a unit of procedurally-generated exercise. The name comes from tabletop RPGs — the system makes a move; the learner responds. Each move is written as a piece of prose that a teacher could read and discuss, not as a code spec. Moves have:

- **A leading question in English** that draws the learner in. This is the bait — what makes them click through from the branching screen.
- **A presupposition** the move asserts about the world. Sometimes a small claim (a relationship exists, a fact is the case); sometimes nothing more than "here is something to talk about." The presupposition is what gives moves their voice. The Stonetop-flavored craft of writing them well — assertive, evocative, never breaking from in-vocabulary Korean — is post-MVP work but starts now in small ways.
- **Preconditions** that determine when the move is eligible. How many characters exist, what attributes are defined, what the lesson has introduced.
- **Branches** based on world state. The same move can be a recall path when the relevant data exists, and an author path when it doesn't. This is the key insight: one move template often covers both modes depending on whether the world has the answer yet.
- **Korean follow-ups** that practice the lesson's language. These are where the actual exercise mechanics live — multiple choice, fill-in-the-blank, true/false, short answer.
- **Confirmation behavior** for any path that writes to the world. Author paths end with a restatement in Korean.

Here is what a move document looks like in practice, in plain prose:

---

**Move: Shared Attribute**

*Leading question (English):* "X and Y share something. Can you tell me what?"

*Preconditions:* At least two characters exist. The lesson's current focus attribute (nationality, year, major) is defined for at least one of them.

*Branching logic:*

If both X and Y have the focus attribute defined and they match — recall path. The system knows the answer; the learner is being asked to remember.

If both have it defined and they don't match — this move doesn't apply. Pick a different X and Y, or a different move.

If only one has it defined — author path. The presupposition (they share this attribute) invites the learner to set the missing value.

If neither has it defined — author path with two stages. The learner sets X's value first, then confirms Y matches.

*Recall path:*

"톰과 유미는 일본 사람이에요?" 네/아니요. Correct yes-answer confirms and moves on. No-answer or wrong yes-answer opens multiple choice from lesson vocab. Wrong choices shake and grey out; the learner tries again.

*Author path (one missing):*

"톰은 일본 사람이에요. 유미는 일본 사람이에요?" 네/아니요. Yes writes Yumi's nationality to match. No opens multiple choice for what it is instead. The choice is restated in Korean as confirmation.

*Author path (both missing):*

Multiple choice for X's nationality, confirmed in Korean. Then the recall-style "and Y too?" prompt, which functions as a confirmation of the presupposition itself.

---

Moves are written one at a time, in markdown, in collaboration with the teacher who's contributing pedagogical input. The format settles by use, not by spec. Once enough moves exist to see the structure clearly, a small data representation falls out of the prose. The data structure follows the writing, not the other way around.

## 6. The Branching Practice Screen

The middle phase of every lesson. Three moves are offered, plus a shuffle option as the fourth choice. The moves are picked from those eligible (preconditions met by the current world state); for MVP, the picker is random among eligible moves. Later, a small weighted picker takes the world's state into account — characters with missing attributes weight toward authoring, characters not touched recently weight toward recall, low character count weights toward adding characters.

The learner picks a move, works through it, returns to the screen, picks another. The world view is accessible from this screen and updates in real time as authoring exercises commit. The editing interface is reachable from the world view.

A notebook lives somewhere on this screen — not a score, a narrative log. "Gary joined the class." "You confirmed Yumi is a freshman." "The book moved from Tom's desk to Yumi's." This is post-MVP polish but worth designing toward; it's what the progress display becomes instead of a counter. Numbers turn into scores in the learner's mind whether or not that's intended; prose stays prose.

When the learner feels ready, they move on to synthesis. There's no gate. The branching practice can be revisited if synthesis reveals something didn't stick.

## 7. The World View and the Editing Interface

The world view is a small visual surface showing the current state of the world from the lesson's perspective. For MVP, it's a simple table — characters as rows, attributes as columns. Polish (a classroom layout, desks, flags, a map) is later. The table is the honest skeleton; the polish lives on top of it without changing the data underneath.

The view is reachable from the branching practice screen at any time. The world view is also where editing happens: click a cell to edit, save commits the change, with a confirmation prompt in Korean for any change that affects the lesson's data.

This is the safety valve. The 6-vs-actual-count problem and the wrong-classmate-deletion problem are both solved by putting all destructive edits under the learner's deliberate hand in this interface. Exercises don't mutate the world destructively as a side-effect; they can only add or alter through author paths with confirmation. If the learner wants to remove a character or fix a typo, they go to the world view and do it explicitly.

Editing is scoped per lesson: a lesson's manifest declares which attributes are touchable in its editing interface. Lesson 1 lets the learner add or remove students and edit their nationality and grade. Lesson 2 adds new editable fields without removing the old ones.

Locations and spatial data will need a different structure than tables — a desk with objects on it, a map of buildings — and that will arrive when the relevant lessons do. For now: tables.

## 8. Synthesis

The closing phase. Two to three exercises tied to the lesson's stated objectives, demonstrating that the learner can do what the lesson set out to teach.

Synthesis is mostly recall — the world is the source material, the language is what's being demonstrated. But at least one exercise should be **production**: a longer utterance the learner composes, drawing on the lesson's vocabulary and grammar. For MVP without LLMs, production is simple: the learner types a sentence, the system checks for the required elements (a name, a year, a nationality particle) without trying to grade the full utterance. Feedback is soft and honest: "looks good, you used all three elements," not a fluency score.

Synthesis is visually and tonally distinct from branching practice. Different color. Longer, more narrative prompts. More audio. Slower pace. The framing is "demonstrate," not "assess." A soft closing note when it's done — "when this feels comfortable, move on to the next lesson" — and no grade.

The synthesis exercises for each lesson are hand-written, like the seed. They're the bookends. When LLMs arrive, synthesis is where they show up first: a short back-and-forth conversation with a character from the world, constrained tightly to in-vocabulary Korean and consistent with the world state. That's the post-MVP version of the production exercise.

## 9. Persistence and the World Data Model

The world data model supports cross-lesson connection from MVP onward — the data is shaped to carry across, even if only lesson 1 reads from it initially.

What this means concretely:

- Every entity (character, location, object) has a stable ID from the moment it's created.
- World state is additive. New facts attach to existing entities. Nothing is destroyed except through deliberate edits in the editing interface.
- Lessons declare what they read and what they write in a per-lesson manifest. This is what later cross-lesson logic will use.
- The data model is built once and used by every lesson. Lesson 1 doesn't have its own data shape; it uses the shared one.

To prove the data model can carry across, a stub of lesson 2 reads from lesson 1's world state — even if lesson 2's full content isn't built yet. This stub is the cheap insurance against a latent persistence bug that wouldn't be discovered until lesson 2 was being built for real.

What is *not* in MVP: full lesson 2 content, cross-lesson generated exercises, validation that all lessons remain mutually consistent, decay-and-trace logic. The data is shaped to support these; the logic isn't built yet.

## 10. The MVP

The smallest version that exercises every key idea:

1. **Lesson 1 seed flow.** Hand-written, walking the learner through every question type via the tutorial conversation with Gary. Proves the question types work and the author/recall distinction reads visually.

2. **The world data model.** Holds lesson 1's characters with stable IDs and additive state. Designed for cross-lesson use, only lesson 1 reads from it.

3. **The world view as a simple table.** Characters as rows, attributes as columns. Click to edit. Confirmation in Korean for any committed change.

4. **Three hand-written moves.** One pure author, one pure recall, one shared-attribute move that branches on world state.

5. **The branching practice screen.** Three moves plus shuffle, randomly picked from eligible moves. The world view accessible throughout.

6. **One synthesis exercise.** Hand-written, touching all of lesson 1's pedagogical objectives. At least one production element.

7. **A lesson 2 stub** that reads from lesson 1's world state, to prove the data model carries across.

That's it. The questions raised by building this prototype are the ones worth answering next. Anything more is planning past the next branch.

Out of MVP scope: LLM integration, the weighted move picker (random is fine), the notebook (count-free progress display), polished views, cross-lesson generation, multiple views per lesson, anything graph-like, anything resembling a small-models-reading-traces substrate.

## 11. After MVP

Named here so the bones don't preclude them:

**LLM-generated moves and exercises.** Once the skeleton works, LLMs can generate variation within a lesson's constraint set and world state. Constraint validation is mandatory; every generated sentence is tokenized and checked. World consistency is also checked; generated content must reference the learner's actual world state, not invent characters or facts.

**LLM-driven synthesis.** A short back-and-forth conversation with a character from the world, in-vocabulary, world-consistent. This is the natural home for the most distinctive learner-facing AI experience.

**The weighted move picker.** Replacing random selection with a small heuristic engine that reads world state — missing attributes weight toward authoring, untouched characters weight toward recall, low character count weights toward adding.

**Cross-lesson generation.** Lessons 5+ pull characters from lessons 1–4, with the right constraint logic ensuring no out-of-vocabulary Korean leaks across.

**The notebook.** Narrative session log replacing any latent counter. "Gary joined the class." "You moved the clock behind the desk." A small piece of writing craft that grows the platform's voice.

**Richer views.** Classroom layouts, school maps, desk diagrams. Locations and objects with spatial structure. Views polished from honest tables into something memorable.

**Loaded-presupposition move craft.** The most interesting writing space the platform has. "X and her friend are in the cafeteria. Her friend is also a freshman. Who is it?" — moves that assert structural facts and invite the learner to fill in the content. Worth deliberate writing time and post-MVP attention.

**The graph thing, if it earns its place.** The world is conceptually a graph. For now it's flat. If something forces graph traversal or graph dynamics, the data is shaped to lift cleanly into a real graph representation. We don't reach until something forces it.

## 12. Open Questions

These are real and unresolved.

**The right ratio of author to recall in the branching middle.** Lesson 1 probably wants a small number of authoring moments and a larger number of recall moments. The right ratio reveals itself in the building.

**What happens when a learner skips authoring in lesson 1.** If the seed establishes a mandatory minimum, this is partly answered: every learner has a baseline world. Beyond that, the question is whether further authoring is optional or whether the learner is gently nudged.

**The textbook canon vs. learner-authorable line.** The textbook says Lisa is American. The learner probably can't change that. The textbook says nothing about Lisa's major. The learner can author that. The line needs to be explicit in the per-lesson manifest.

**Whether the world ever forgets.** For now, no. Trace-and-decay is a post-MVP layer over the persistent world, not a replacement.

**The right name for moves.** "Move" is the working name. It might settle into something else with use.

## 13. What This Platform Optimizes For

- **Personal stake without gamification.** The learner cares because they authored, not because they're scoring.
- **Recurrence with meaning.** Vocabulary reappears because the world calls for it, not because a scheduler said so.
- **Textbook alignment.** A learner using *Integrated Korean* can use this as a supplement that respects what they're already doing.
- **Simple rules that compound.** Many small, consistent choices in harmony — the invariants, the two modes, the three phases, the move structure — producing something bigger than the sum of its parts.
- **A small MVP that doesn't preclude what comes later.** Same discipline as the rest of the architecture.

## 14. What This Platform Does Not Try to Do

- It is not a game. There's no win condition, no score, no progression in the gamified sense.
- It is not a creative writing tool. Authoring happens within tight language constraints, by design.
- It is not a replacement for textbook content. The textbook is the source of language; the world is a layer over it.
- It does not solve every pedagogical problem. Many exercises will sit outside the world layer entirely, and that's fine.
- It is not a graph database project, a visualization project, or an LLM project. It's a language learning project that uses a small persistent world to make recurrence and agency real.
