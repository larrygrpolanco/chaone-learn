# Context — chaone-learn

A Korean language learning app aligned to *Integrated Korean: Beginning 1*. Learners build a persistent world of characters through structured exercises, then get tested against the world they created.

---

## Glossary

### World
The learner-authored persistent state of characters and their attributes. Grows across lessons as vocabulary expands. Every fact in the world was put there by the learner — it is theirs.

### Character
An entity in the world with attributes (name, year, nationality, etc.). Characters are either introduced by the learner or carried over from a previous lesson. What attributes a character can have is determined by the current lesson's vocabulary scope.

### Learner Character
The character in the world that represents the learner themselves. Flagged separately in the data. Used to generate first-person prompts and to anchor the world to the learner's identity.

### Teacher Assistant
The meta voice that guides the learner through progression. Not a character in the world — speaks about the app and the learning process. Builds excitement around ownership and stakes. Brief and fun.

### Seed Phase
Phase 1 of a lesson. Narrative-driven questions that introduce the lesson's mechanic and seed the world with a minimum of initial data. The learner is introduced as a character first, then one or more classmates. Authoring only — no recall or testing here.

### Building Phase
Phase 2 of a lesson. The learner expands the world: adding characters, updating attributes, making the world their own. Pure authoring. No testing. The learner knows this world will be used in Synthesis.

### Synthesis Phase
Phase 3 of a lesson. Applied practice tested against the world the learner built. This is where recall and language testing live. The stakes are real because the world is theirs.

### Authoring
An exercise where the learner writes a fact into the world. The answer is about *their world* — it cannot be wrong in the language-learning sense; it is a definition. Authoring lives in Seed and Building phases.

### Recall
An exercise where the learner is tested on a fact already in their world. The answer can be right or wrong — this is where language learning is assessed. Recall lives in the Synthesis phase only.

### Lesson Scope
The set of vocabulary and grammar patterns available at a given lesson. No exercise may use language outside this scope. This constraint is the most important rule in the system.

### Carry-Over
Characters and their facts persist automatically from lesson to lesson — the world is additive. A new lesson's Seed phase expands existing characters with new facts rather than starting fresh. Lessons are modular in their mechanics and views, but the world underneath is continuous.

### Lesson View
A visual representation of world state that is specific to a lesson's content — e.g., a class roster for lesson 1, a family tree for lesson 2. Updates visibly when the world changes, giving the learner immediate feedback that their answers had an effect (effectance).
