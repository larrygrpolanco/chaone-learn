# Korean Language Learning Platform — Philosophy

This document captures the beliefs that underpin the project. The architecture document explains *how* the platform is built; this one explains *why* it is built that way and what it is for. When a feature is being considered, a tradeoff is being weighed, or a direction feels uncertain, this document is the reference. It is meant to be re-read.

It is also written for AI agents who pick up this project mid-stream. The reasoning is here so it does not need to be re-explained each time.

## 1. Origin and Purpose

This project comes from a personal observation about how language is actually learned.

I grew up around Spanish my whole life. When I eventually tried to speak it, I felt like I was starting from zero — but I was not. I had years of input behind me. I needed to learn rules of production and some basics, but I improved very quickly because the receptive substrate was already there. Later, learning Chinese in Taiwan, the same pattern showed up from the other direction: listening was a much harder skill to build than speaking, and it was the skill that actually let conversations continue. You can stretch a small productive vocabulary a long way; you cannot stretch a small receptive one at all.

The platform exists to give learners more of what I had with Spanish without realizing it: hours of comprehensible input, calibrated to where they are, with enough structure that what they encounter actually sticks. It is not a textbook. It is not a course. It is a resource that sits alongside other learning — a teacher, a tutor, a textbook like *Integrated Korean*, or a learner's own self-directed study — and provides the input layer that those tools tend to underserve.

The pedagogical instinct it reacts against is the one where new vocabulary keeps stacking and old vocabulary rarely returns. New items are not the measure of progress. Returning to old items in new contexts is. A learner finishing this resource should not have a long list of words they have met once; they should have a smaller list of words they have *lived in.*

## 2. Who This Is For

This is for the learner who wants to **understand Korean as it appears in the world.**

They want to pick up more words while watching a Korean show. They want to read signs when they visit Korea. They want to follow more of what is said around them. They are not preparing for the TOPIK. They are not chasing a certificate. They are not, primarily, trying to become someone who *speaks* Korean — they are trying to become someone for whom Korean *means something.*

Their goal is participation, not credentialed fluency. They want the Korean they already encounter — in dramas, in songs, on signs, in conversation — to stop being noise and start being language. Production may follow, and we welcome it when it does, but it is not what they came for and it is not what we measure.

This portrait is the design filter. When a feature is being considered, the question is: *does this serve the learner who wants to understand the show they are already watching?* If the answer is no, the feature is probably out of scope, regardless of how good it might be for someone else.

## 3. The Reception Thesis

**Receptive competence is the substrate that makes productive competence cheap. Most language learning gets this backwards.**

This is the central pedagogical claim of the project. It is close to Krashen's Input Hypothesis, and we take it seriously rather than borrowing the vibe. A learner exposed to large amounts of comprehensible input — language at the edge of their current ability, where most of it is understood and a little is new — acquires the language. Drilling production before the receptive base is built forces output the learner has no ground to stand on, and tends to produce frustration rather than fluency.

We operationalize this with a concrete target: **roughly 98% comprehension on any content a learner encounters at their stage.** Below 95%, comprehension begins to break down. Below 90%, the learner is decoding rather than reading. The data layer exists to make this number mechanical rather than aspirational. Every story, every dialogue, every generated passage is validated against the constraint set of what the learner has been introduced to. The 98% target is not dogma — it is a calibration we will test and adjust — but having a number transforms the philosophy from preference into engineering target.

Production is welcomed and supported where it serves reception. A learner who wants to repeat what they hear, shadow audio, or read aloud should be able to do so naturally. We will not build features that demand production, evaluate it, or shame its absence. We will not build a speaking trainer, a pronunciation grader, or a conversational chatbot. Speaking instruction is what tutors and conversation partners are for; we stay in our lane.

This stance has consequences worth naming. It excludes forced-output exercises in early stages. It excludes "now you say it" prompts that punish silence. It excludes streaks tied to speaking. It also means that a learner who finishes everything we offer and still feels nervous about speaking has not failed our resource — they have used it correctly, and the next step is a tutor or a conversation partner, not us.

## 4. Reuse as the Mechanism

**The lesson is not the unit of learning. The corpus is.**

A lesson introduces. Learning happens across lessons, in the spaces where a word from lesson 3 appears in the story for lesson 7, and again in a graded reader, and again in a story session two stages later. The platform's job is to make every previously-introduced item recurrable in any new context, and to make that recurrence visible to authors, generators, and validators alike.

This is what the data layer is *for*. It is not a database for its own sake. It is a constraint specification system that makes pedagogical reuse mechanical. Every entity answers the question "can I be used at this learner stage?" so that hand-authored content, generated content, and validators all operate against the same source of truth. The pyramid stands on its scaffolding because the scaffolding is enforced in code.

This does not mean every word must reappear constantly. It means new items are introduced in service of being encountered again, and the platform is built to make those encounters happen. Vocabulary breadth is not the metric. Depth — the number of contexts in which an item has been met, understood, and reactivated — is.

The compounding consequence is that the corpus gains value with every lesson authored. A word introduced in Beginning 1 Lesson 4 becomes available to every story, every reader, every generated passage from that point forward. Authoring lesson 20 is easier than authoring lesson 4 because there is more material to draw from. This is the architectural payoff of the data-forward approach, and it is worth the upfront cost of doing the work in code rather than prose.

## 5. Agency Over Gamification

**The learner is an author and an audience, not a player. We provide structure and material; we do not score, rank, or reward.**

There is a real distinction between agency and gamification, and they are often conflated. Gamification is extrinsic motivation layered on top: points, streaks, badges, leaderboards, the reward-for-doing rather than the doing itself. Agency is the learner making meaningful choices that shape what they encounter. The reward is the encounter.

This project chooses agency. Not because gamification is bad — Duolingo does it well, and other resources serve the gamification niche capably — but because adding it here would increase complexity while providing little this project uniquely needs. More importantly, gamification tends to substitute for the engagement we want to come from the content itself. If a learner needs a streak to keep going, the streak is doing work the content should be doing.

This applies to vocabulary practice especially. Most platforms in this space treat vocabulary drilling as the load-bearing daily habit, with SRS schedulers nagging the learner to keep their counts clean. Our position is different: **the load-bearing thing is comprehensible input. Vocabulary practice is a supportive tool the learner reaches for when they want it.** Simple flashcards, optional cloze quizzes the learner can generate from their own constraint set, varied light activities — yes. A daily drill obligation, a "47 cards due" guilt counter, a streak — no. The learner decides how much vocabulary practice they want and what shape it takes.

Honesty about the plateau matters here. Every learner hits one. The point where novelty runs out and progress feels invisible is where most language learning resources lose people, and where gamification often steps in as a substitute for genuine engagement. We do not promise to solve the plateau. We believe a learner with agency over their input — what to read, what to author, what to revisit — is better equipped to push through it than one waiting for the next dopamine hit. But this is a belief we will test, not a guarantee we make.

The honest version of the plateau answer is the next section.

## 6. Story Sessions as the Engine

**Lessons introduce. Story sessions sustain.**

The story sessions — and the graded readers alongside them — are not just the destination that lessons build toward. They are the engine that keeps the learner reading and learning past the point where novelty runs out. A learner who has stalled on lessons may keep reading because they want to know what happens to their character. The interactive element gives them stakes in the content without gamifying the learning itself.

A story session is **constrained co-authorship**: a structured pedagogical experience where the learner provides intent, choices, and contributions, and the system provides Korean shaped by their input and the constraint set of their current stage. It is closer to a guided improvisation than to a chatbot conversation, closer to an interactive graded reader than to a choose-your-own-adventure. The learner is doing something with Korean at every step — parsing, choosing within it, transforming it — never just consuming generated narrative.

The inspiration is solo journaling tabletop RPGs: *Alone on a Journey*, *Notorious*, *Koriko*, *Thousand Year Old Vampire*. What makes those games compelling is not the mechanics but the pairing of constraint and agency. The structure provides prompts and limits; what the player does inside them is theirs. There are no win conditions, no scores, no audiences. The engagement is intrinsic to the act of authoring within the frame. We are stealing that shape and adapting it for language acquisition. The early lessons will tell us how.

Two boundaries on this:

**Story sessions are not open-ended LLM generation.** Any LLM use in this project lives inside a tight pedagogical harness. Every session has clear objectives, scaffolding, and constraints. The learner is not picking "left" forever and watching Korean stream by. There are checks, goals, and structure — closer to the text-message exercise than to a free-roaming chatbot. The LLM is a constrained component within a designed exercise, never the experience itself. We are not in the AI slop business.

**Story sessions vary in intensity.** Early sessions are heavily constrained — the learner has very little Korean to work with, so the system does most of the lifting and the learner contributes small choices. Later sessions expand the learner's agency as their Korean grows. The progression from light contribution to heavier co-authorship is itself part of the pedagogical arc.

The right name for these is still open. "Story sessions" is the working term. We will find the right one by building them.

## 7. L1 as a Tool, Used Carefully

**The learner's full linguistic repertoire is an asset. English is a tool we reach for when it preserves comprehension at the target level, and we set it down when Korean exposure would serve better.**

This is translanguaging, but stated precisely. We do not quarantine English from Korean — immersion-only is dogma, and it discards a useful resource. But we do not lean on English either. The mixed-language reader is for exactly the case where Korean structure is at the right level but a couple of words are unknown: English fills the gap, the rest of the sentence stays Korean, comprehension lands at the target. That is L1 doing useful work.

L1 has the same calibration target as everything else: it serves the 98% comprehension goal. Where Korean alone would put a learner at 90%, a couple of glossed words can bring them to 98% without sacrificing meaningful exposure. Where Korean alone already lands at 98%, English is unnecessary and we omit it. Translanguaging is not an ideology here; it is a calibration tool.

A consequence worth naming: in story sessions, learners may want to think and write in English while engaging with the Korean the system produces. We do not punish this. We design prompts that invite Korean where it is available without demanding it, and treat an English contribution from a beginner as a successful act of expression rather than a failure to perform. The harness handles the translation work where pedagogically appropriate; the learner's intent comes through in whatever language they have.

The constraint-set strictness question — what happens when an unknown word slips into a story — is genuinely open. Substituting it for English is one option. Letting it stand and glossing it inline is another. Letting it appear bare, with the assumption that occasional ambiguity at 98% comprehension is tolerable, is a third. We do not commit to one yet. The early lessons will tell us.

## 8. A Resource Alongside Other Learning

**This platform fills a gap. It does not try to be a complete curriculum.**

A learner using this resource will likely also have a teacher, or a textbook, or a tutor, or be doing self-directed study with other tools. We assume that. We do not try to replace it. The platform sits alongside other learning and provides the input layer that other tools tend to underserve: hours of calibrated comprehensible input, story-driven engagement, and the data infrastructure to keep both at the right level.

The closest analogue to our shape is *Integrated Korean*, the Klear series. The platform will follow it loosely as a guide for vocabulary and grammar ordering, both because it is pedagogically sound and because aligning with a widely-used textbook makes this resource useful to learners and classes already working through it. We are not bound to it — the data layer is the source of truth, not any specific textbook — but we draw inspiration from it.

The teacher's role in the project is quiet but firm. All content is reviewed by a Korean teacher before it ships. We do not trust ourselves alone, and we do not trust the LLM alone, to make pedagogical decisions about Korean. The teacher is the authority on Korean correctness and naturalness; the architecture is the authority on consistency; the author is the authority on experience. Three roles, not interchangeable, all required.

What we do not pretend to be:

We are not an assessment system. We do not certify levels, issue placements, or evaluate proficiency. The data layer encodes what a learner has been *introduced to*, not what they have *mastered*. A learner who has worked through Beginning 1 has been exposed to its corpus; whether they have internalized it is between them, their reading, and any teacher in their life.

We are not a learning companion or adaptive tutor. The platform does not chat with the learner about their progress, suggest study plans, or motivate them. It is a resource. The learner shows up, engages, and leaves. Their relationship is with the content, not with us.

We are not a complete production trainer. Speaking, writing, pronunciation, conversation — these are real skills, and we are not building infrastructure for them. A learner who finishes everything here and wants to speak should find a tutor or a conversation partner. We will have served them well by giving them the receptive base that makes those next steps cheap.

## 9. What We Will Not Build

This list is the decision filter. When a feature is tempting, it gets held up against this list. It is meant to grow as the project teaches us what it is not.

- **No streaks, points, badges, or leaderboards.** Gamification belongs in other resources.
- **No daily obligations or guilt counters.** "47 cards due" is not how this platform talks to a learner.
- **No certification, assessment, or placement testing.** We do not pretend to measure proficiency.
- **No forced production.** No "now you say it" prompts, no speaking gates, no output-required exercises in early stages.
- **No conversational chatbot or open-ended LLM generation.** Any LLM use lives inside a tight pedagogical harness.
- **No adaptive tutor or learning companion.** No nagging, no encouragement performances, no progress chat.
- **No replacement for human review.** Content ships only after a Korean teacher has seen it.
- **No CMS or admin tooling.** The TypeScript files are the textbook. Friction in authoring is acceptable; depth is the point.
- **No infinite-content features.** We are not in the AI slop business. Every piece of content has a reason to exist.
- **No abandonment of the constraint set.** The 98% comprehension target is enforced, not aspirational.

## 10. Tone

**Calm, honest, compassionate, not coddling, not performing.**

The platform speaks to the learner as a capable person engaged in real work. We do not perform encouragement. We do not infantilize. We do not punish absence with guilt or reward presence with fanfare. The content is the reward; our voice gets out of the way.

That said, the tone is not severe or adult-only. Kids play pretend; adults play pretend; the story sessions are a place for imagination, and the voice in them can be warm and playful where the content invites it. The constraint is honesty: we do not pretend the learner is doing better than they are, we do not manufacture excitement to mask thin content, and we do not condescend.

A learner who returns after a month should feel welcomed back without being chided for leaving. A learner who is struggling should feel seen without being patronized. A learner who is doing well should feel the work itself rewarding them, not the platform congratulating them.

This tone applies to every UI string, every error message, every story prompt. When in doubt: less is more, and the content is the point.

## 11. How This Document Is Used

This is a decision filter, not a specification. When a feature is being considered, the relevant questions are:

- Does it serve the learner described in §2?
- Does it respect the reception-first thesis in §3?
- Does it deepen reuse rather than just adding new items?
- Does it offer agency rather than gamify?
- Does it stay in our lane as a resource alongside other learning?
- Is it on the *will not build* list in §9?

Some questions are still open. The exact shape of the lesson sub-structure (the "arc" question from the architecture). The strictness of constraint-set enforcement around the occasional unknown word. The right name for the story sessions. The right balance of L1 in the early lessons. These are noted as open and will be resolved by building, testing, and revising.

This document will change. It should change. But it changes by deliberate revision, not by drift. When a section here is contradicted by a feature being shipped, one of the two is wrong, and we figure out which before going further.
