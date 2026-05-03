# hanbun

*Working name. Likely to change.*

A Python library for analyzing Korean text against a vocabulary specification. It tokenizes, lemmatizes, looks each token up against the lists you give it, and returns a structured report. Everything else is built on that one operation.

This document is the source of truth for what the library is and is not. It is meant to be re-read. When a feature is being considered, a tradeoff is being weighed, or a direction feels uncertain, this document is the reference. It will change — but by deliberate revision, not drift.

It is also written for AI agents picking up the project mid-stream. The reasoning is here so it does not need to be re-explained each time.

## 1. What This Is For

The library exists to answer one question, mechanically:

> Given a Korean text and a set of lists (frequency, vocabulary), what's in the text relative to those lists?

The motivating use cases:

- **Grading existing text.** Take a Korean story, news article, or drama subtitle and find out what a given learner can and can't read in it. Decide which words to gloss in English, which to substitute, which to leave alone.
- **Validating authored or generated text.** Author a graded reader against a constraint set; verify the text honors it. Same operation: tokenize, look up, report.
- **Powering an LLM react-loop.** An LLM generates Korean against a constraint set, the library reports what's in/out of bounds with actionable detail, the LLM revises. The library is the harness; the LLM is a swappable component inside it.
- **Substituting tokens in a real text.** Take a drama subtitle, run it through a frequency list, replace tokens above a chosen threshold with English glosses (or hand the report to an LLM to rewrite the line as a more comprehensible version). Same primitive: tokenize, look up, transform.

These are all the same operation under different surfaces. The library provides the operation. The surfaces are thin.

## 2. Principles

These are the decisions that shape everything else. When something feels uncertain, return here.

### The library knows nothing about pedagogy.

The library does not ship with a "default" frequency list, a "default" vocabulary list, or any opinion about levels, stages, textbooks, or curricula. It defines the *shape* of these things and the *operations* over them. The user brings the data.

Pedagogy lives in the lists you load. A textbook companion product is a different *bundle of lists*, not a different library. The TOPIK edition is a different list. Your custom curriculum is a different list. The library is the same.

This is the move that prevents the library from sprawling into a Korean-learning platform. It refuses that job.

### Frequency lists and vocabulary lists are different things.

They answer different questions and are loaded separately.

A **frequency list** tells you where in Korean a lemma sits, in absolute terms. Derived from a corpus of real usage (news, drama, balanced corpora, etc.). Rank, lemma, POS, optionally a dispersion score. A property of the language. Rarely changes.

A **vocabulary list** tells you what a learner has been introduced to in some pedagogical context. Lemma, POS, optionally a gloss, optionally tags, optionally a "lesson" or "chapter" identifier. A property of a course or curriculum. Changes constantly during authoring.

You can use one without the other. You can use both. You can use multiple of either. The analyzer handles whatever it's given.

### The corpus is morphemes, not words.

A Korean "word" in any practical sense is a stack of morphemes. Particles and endings carry the bulk of grammar and dominate the high-frequency core (the top 20 entries of any honest Korean frequency list are mostly bound morphemes — particles, endings, the copula). Treating these as "grammar" and excluding them from the vocabulary list would mean ignoring the most frequent and most pedagogically important items in the language.

A vocabulary entry, in this library, is a lemmatized morpheme. Whether the lemma is a free word (집), a verb stem (먹다 / lemma 먹), a particle (을/를), or a bound ending (-았/었) is a property of the entry, not a different kind of thing. The Korean frequency dictionary by Routledge is the model: every entry has a part of speech, and they all coexist on one ranked list.

This collapses what would otherwise be a "vocabulary layer" and a "grammar layer" into one layer. It is simpler, and it matches Korean.

### Hard metrics, soft notes.

The analyzer's report has two layers.

**Hard metrics** are the parts with numeric meaning: vocabulary coverage percentage, frequency-band distribution, sentence count and length, type-token ratio. These have unambiguous tests and can drive a numeric target like 98% comprehension.

**Soft notes** are observations the report surfaces for human (or LLM) attention but does not score. "This passage uses honorific -시- six times." "Three relative clauses in two sentences." "Mixes -아요 and -ㅂ니다 speech levels." Notes don't pass or fail; they call attention.

The split exists because some things about a text are clean and quantifiable and some things are fuzzy and judgment-shaped, and pretending the fuzzy things are clean produces false confidence. Notes are honest about the fuzziness.

The note set is itself pluggable — a list of small detector functions, each producing a note when its condition fires. New notes can be added without touching the core analyzer.

### Surfaces are thin.

The CLI is a few lines that call `analyze` and pretty-print the result. A future FastAPI server is a few lines that call `analyze` and return JSON. A future GUI calls `analyze` and renders. The harness for an LLM react-loop calls `analyze` in a loop and formats the report into a prompt. None of these are the library; they're surfaces over the library.

This is the move that keeps the library small. New use cases are usually new surfaces, not changes to the core.

### Output is structured data, never just printed text.

The analyzer returns a typed object. Surfaces decide how to render it. This is what makes the library easy to use from any other language later (the object serializes to JSON cleanly), and what makes the LLM react-loop feasible (the LLM consumes structured data, not paragraphs).

## 3. What This Is Not

Naming what's out of scope is as important as naming what's in.

- **Not a Korean grammar engine.** The library does morpheme-level lookup. It does not parse Korean syntactically. It does not detect named "grammar patterns" like *-아/어 보다* in v1 (see §7 on extensions).
- **Not a corpus in the linguistic-research sense.** It consumes lists; it does not produce them. Building a frequency list from a text corpus is a separate task. (A future utility for this is reasonable; it's not v1.)
- **Not opinionated about pedagogy.** No built-in levels, stages, or progressions. No claims about what a learner "should" know.
- **Not a learning platform.** No user state, no progress tracking, no UI for learners. The library is consumed by tools that may have those things.
- **Not a TTS or audio tool.** Text in, structured analysis out.
- **Not a translation tool.** It can render glosses if a vocabulary list provides them. It does not generate translations.
- **Not a grader of LLM output's correctness.** It checks LLM output against a constraint set. Whether the output is good Korean is a separate question, answered by humans or by another model.

## 4. Architecture

Three layers, each thin, building outward.

### Layer 1: The lists

The data the library reasons about. Pure data classes, loadable from common formats (CSV, YAML, JSON).

A **VocabularyEntry** is the atomic unit:
- `lemma` — the dictionary form of a morpheme (먹, 집, 을/를, -았/었)
- `pos` — part of speech, using the Sejong/Kiwi tagset (NNG, VV, JKO, EP, EF, EC, etc.)
- `gloss` — optional English meaning(s)
- `romanization` — optional, since some lists provide it
- `tags` — optional list of strings (honorific, irregular, sino-korean, formal, etc.)
- `metadata` — optional free-form key/value space for source-specific fields

A **FrequencyEntry** extends VocabularyEntry with:
- `rank` — integer, 1 = most frequent
- `dispersion` — optional float, 0–1, how evenly the lemma is distributed across the source corpus

A **VocabularyList** is a collection of `VocabularyEntry`, with a name and an optional source description. A **FrequencyList** is a collection of `FrequencyEntry`. They are separate types. You can hold any number of either.

The library defines loaders for the formats above and a clear schema. Lists from any source — your Frequency Dictionary export, a textbook chapter you typed up, a TOPIK list scraped from somewhere — become well-formed `VocabularyList` or `FrequencyList` objects through these loaders.

### Layer 2: The analyzer

Takes text and lists, returns a structured analysis.

The pipeline:
1. Tokenize the text with kiwipiepy. Get a sequence of `(form, lemma, pos, position)` tuples.
2. For each token, look up `(lemma, pos)` against each list provided. Record what was found and where (which list, what rank).
3. Run the note detectors over the token sequence. Collect any notes they emit.
4. Compute aggregate metrics: coverage percentages, frequency distribution, sentence statistics.
5. Return a `TextAnalysis` object.

The `TextAnalysis` object contains:
- `tokens` — the full token-by-token breakdown, each annotated with which lists it was found in
- `metrics` — coverage stats, distributions, counts
- `notes` — the list of soft notes that fired
- `unknowns` — tokens not found in any provided list, with their counts and positions
- `summary` — a short text rendering for casual reading

All fields are typed (Pydantic), all fields serialize to JSON. Surfaces consume this object; they don't reach back into the analyzer.

### Layer 3: Surfaces

Built on top, never inside, the analyzer.

**CLI** — a small command-line tool. `hanbun analyze story.txt --vocab my-vocab.yaml --frequency korean-freq.csv` and similar. Pretty-prints the report; can output JSON for piping to other tools.

**Renderers** — functions that take a `TextAnalysis` and produce a particular output format. The mixed-language renderer (known tokens in Korean, unknown tokens substituted with their gloss) lives here. The "highlight tokens above frequency rank N in red" renderer lives here. Drama-subtitle substitution is a renderer.

**Harness** *(future)* — orchestrators that call the analyzer in a loop. The LLM react-loop is the canonical example: prompt → generate → analyze → format report → revise → repeat until the report passes a threshold. The harness is small and the rules are obvious; it earns being written when there's a real use case to test it against.

**HTTP service** *(future, if needed)* — a thin FastAPI wrapper exposing `analyze` over HTTP. Built only if something actually wants to call the library from another language or another machine.

## 5. Tokenization and the Korean morphology question

A note on what kiwipiepy actually gives us, since this is the most magical-feeling part of the library and it's worth being clear about its limits.

kiwipiepy is a high-quality Korean morphological analyzer. Given Korean text, it returns a sequence of morphemes, each with a lemma form and a Sejong-tagset POS label. It correctly handles inflection, irregular verbs (mostly), honorific forms, contractions, and most of the messy edges of Korean morphology. It is not perfect; it has known failure modes around homographs, neologisms, and certain dialectal forms. It exposes hooks for adding user words and overriding analyses, which we will use.

For our purposes, kiwipiepy is the substrate. Every token in the analyzer's output came from kiwipiepy. The library's job is what to do with those tokens — match them against lists, count them, surface notes — not to do morphology itself.

The analyzer wraps kiwipiepy in a thin layer that:
- Caches the tokenizer instance (it has a non-trivial startup cost)
- Exposes a clean interface for the rest of the library
- Provides a place to inject overrides and user-added lemmas
- Normalizes the output into our internal token shape

If kiwipiepy is ever replaced — by a better Korean analyzer that doesn't exist yet, or by a custom one for a specific domain — the change is local to this wrapper.

## 6. Project structure

```
hanbun/
├── pyproject.toml
├── README.md
├── HANBUN.md                 # this file
├── LICENSE
├── docs/
│   └── recipes/              # task-shaped how-tos, grown over time
├── src/
│   └── hanbun/
│       ├── __init__.py       # the public API: a small set of names
│       ├── lists.py          # VocabularyList, FrequencyList, entry types, loaders
│       ├── tokenize.py       # kiwipiepy wrapper
│       ├── analyzer.py       # the analyze() function and TextAnalysis
│       ├── notes.py          # note detectors and the registry
│       ├── render.py         # output renderers (mixed-language, highlighted, etc.)
│       └── cli.py            # command-line entry point
├── tests/
│   ├── fixtures/             # small hand-built lists and texts
│   ├── test_lists.py
│   ├── test_tokenize.py
│   ├── test_analyzer.py
│   └── test_notes.py
└── examples/
    └── lists/                # example list files in the supported formats
```

The `src/` layout keeps tests honest: they run against the installed package, not the source files. This catches packaging mistakes early.

The public API surface is intentionally small and lives in `__init__.py`. Users import from `hanbun`, not from `hanbun.analyzer`. The internal modules can be reorganized without breaking anyone.

## 7. What's deferred

Things named here so the architecture doesn't preclude them, but not built in v1.

- **Grammar pattern detection.** Recognizing named patterns like *-아/어 보다* (try doing) or *-(으)ㄴ 적이 있다* (have ever done) as units. Useful, but a separate concern from morpheme lookup, and the right shape for it is unclear until the core is in real use. Will likely live in its own module that consumes the analyzer's token output.
- **Acquisition-order proxies.** Notes that flag morphemes or constructions typically learned later (e.g. *-더라고요*, *-았/었던*). Belongs in the notes module; needs a Korean SLA expert to draft the inventory. Tractable but requires real expertise to get right.
- **List building from corpora.** A utility for generating frequency lists from text corpora. Reasonable to build later; the library should consume frequency lists before it produces them.
- **The HTTP / API surface.** Built when something needs it.
- **The LLM react-loop harness.** Built when there's a real authoring task that wants it.
- **A GUI.** Built when there's a real user that wants it.
- **Multi-language support.** The library is Korean-specific. Other languages would be different libraries with the same shape. Trying to abstract over languages now is premature.

## 8. Tooling and conventions

- **Python 3.11+.** Modern type hints, pattern matching available.
- **uv** for project management, virtual environments, dependency installation, builds.
- **Pydantic** for data models. Free serialization, free validation, good error messages.
- **pytest** for testing. Fixture-based, with hand-built tiny lists and known-output texts.
- **mypy or pyright** for type checking, run in CI.
- **ruff** for linting and formatting. One tool, fast, zero-config to start.
- **kiwipiepy** for morphological analysis. The version pin is in `pyproject.toml`; major upgrades are evaluated, not auto-accepted, since they can shift tokenization output.
- **Documentation.** Plain markdown in this file and `docs/`. If/when the public API stabilizes enough to be worth auto-generating reference docs, MkDocs with `mkdocstrings`.

## 9. Open questions

These are not commitments; they are flagged so we revisit them deliberately.

- **The exact shape of the loader format(s).** YAML for hand-edited lists, CSV for imports from existing dictionaries, JSON for machine-generated lists. Probably all three; the question is which is canonical and how schema validation surfaces errors.
- **How the analyzer reports against multiple lists.** When a token is in three lists, the report should make that legible without becoming noisy. Likely: each list contributes a small annotation; the renderer decides what to display.
- **The frequency-band scheme.** Bands of 1–500, 501–1000, etc. is one option; logarithmic is another; matching whichever frequency list is loaded is a third. Probably user-configurable with a sensible default.
- **What the CLI looks like in detail.** Will be designed by hand-using the analyzer first, then extracting commands.
- **The note inventory.** The starter set is small and obvious (speech-level mix, honorific count, sentence length distribution). Growing it is something to do with real texts in front of us.

## 10. How this document is used

This is a decision filter, not a specification. When a feature is being considered, the relevant questions are:

- Does it serve the question in §1?
- Does it respect the principles in §2?
- Is it on the *not* list in §3?
- Does it belong in a layer that exists, or is it a new layer the architecture didn't anticipate?
- Is it deferred in §7? If so, has the time come, or are we reaching for it too early?

When the answer is "this doesn't fit," the right response is usually to leave it out, not to expand the library. The library stays small on purpose. New use cases become new surfaces.
