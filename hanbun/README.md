# hanbun

A Python library for analyzing Korean text against vocabulary and frequency lists. Give it a Korean text and a set of lists; it tells you which words are "known" and which aren't.

> See [HANBUN.md](../Plans/HANBUN.md) for the full design document — what this is for, what it's not, and why decisions were made.

---

## Possible directions (still being figured out)

Two use cases are driving the design, though neither is fully built yet:

**1. Mixed-language reading for TV/subtitles**
A learner loads their personal vocab list plus a frequency band (e.g. top 500 most common words). They get back the Korean text with known words left in Korean and unfamiliar words swapped for their English gloss. The idea: stay in Korean as much as possible while letting the learner follow along without stopping. Eventually this could connect to subtitle/transcript files from streaming services, but the delivery method is a later problem.

**2. Graded story authoring**
Used internally to check and adjust Korean stories. The analyzer flags words outside the learner's band so writers can swap synonyms or rephrase to hit a coverage target (roughly 95–98% known). A future extension is an AI-assisted choose-your-own-adventure generator that adapts the story to the learner's level in real time — pre-planned story beats, AI-filled prose, English shown where the text goes out of band.

---

## Status

The core pipeline is working. You can tokenize Korean text, load vocabulary and frequency lists, and run the analyzer end-to-end today.

| Area | Status |
|------|--------|
| Data models (`lists.py`) | Done |
| kiwipiepy tokenizer wrapper (`tokenize.py`) | Done |
| `analyze()` function and `TextAnalysis` object (`analyzer.py`) | Done |
| Tests (20 passing) | Done |
| Note detectors (`notes.py`) | Not started |
| CLI (`cli.py`) | Not started |
| Output renderers (`render.py`) | Not started |

---

## Setup

```bash
# from the hanbun/ directory
uv sync
```

That's it. kiwipiepy, pydantic, pyyaml, and dev tools are all installed.

---

## Try it now

```python
from hanbun import analyze, load_vocab_yaml, load_freq_csv

vl = load_vocab_yaml("examples/lists/my-vocab.yaml")
fl = load_freq_csv("examples/lists/korean-freq.csv")

result = analyze("저는 학생입니다.", vocab_lists=[vl], freq_lists=[fl])

print(result.summary)
# e.g. "5 tokens, 80.0% covered; 1 unique unknowns."

print(result.model_dump_json(indent=2))
```

You can also call `analyze` with no lists — it will tokenize the text and report everything as unknown:

```python
result = analyze("안녕하세요. 잘 지내셨어요?")
print(result.unknowns)
```

### How matching works

Lookup is generous by design — both use cases benefit from false negatives (showing English for a known word) being worse than false positives.

- **Grammatical morphemes excluded**: particles (`은/는/이/가/을/를`…), verb endings (`-어서`, `-는데`…), suffixes, and punctuation are excluded from coverage entirely. They carry no standalone meaning a learner "knows or doesn't know," so counting them would distort your 95–98% targets. Each token exposes an `is_grammatical` flag for use in renderers.
- **POS suffix stripping**: kiwipiepy appends `-I` (irregular) or `-R` (regular) to verb/adjective tags. `잡다 (VV-R)` matches a list entry for `잡다 (VV)` automatically.
- **Lemma fallback**: if no exact POS match is found, the lookup falls back to any entry with the same lemma. `있다` tagged as `VV` (main verb) will match a list entry for `있다 (VX)` (auxiliary).

### Check what lemma kiwipiepy uses for a word

Lists must use the same lemma form that kiwipiepy produces. If a lookup still isn't hitting, run this:

```python
from hanbun import tokenize
for t in tokenize("먹었어요"):
    print(t.form, t.lemma, t.pos)
```

Verbs and adjectives include 다 in the lemma (`먹다`, `예쁘다`). See [examples/lists/README.md](examples/lists/README.md) for the full explanation and a POS tag reference.

---

## List formats

See [examples/lists/README.md](examples/lists/README.md) for the full format guide with copy-paste examples.

**Vocabulary list (YAML):**
```yaml
name: my-list
entries:
  - lemma: 학생
    pos: NNG
    gloss: ["student"]
  - lemma: 먹다
    pos: VV
    gloss: ["to eat"]
```

**Frequency list (CSV):**
```
lemma,pos,rank,dispersion,gloss
이다,VCP,1,0.98,to be
하다,VV,2,0.97,to do
```

---

## What `analyze()` returns

A `TextAnalysis` object with:

- `tokens` — every morpheme with its lemma, POS, `is_grammatical` flag, and which lists it was found in
- `metrics` — coverage percentage, frequency band distribution, type-token ratio, counts (grammatical morphemes excluded from all counts)
- `unknowns` — content-word lemmas not found in any list, sorted by frequency in the text
- `notes` — soft observations (speech level mix, etc.) — empty until `notes.py` is built
- `summary` — one-line human-readable summary

Everything serializes to JSON: `result.model_dump_json()`.

---

## Run tests

```bash
uv run pytest
```

---

## What's next

1. **`notes.py`** — pluggable soft-note detectors. Speech level mixing, honorific count, sentence length distribution. Each note is a small function that runs over the token list and fires when its condition is met.
2. **`cli.py`** — `hanbun analyze story.txt --vocab my-list.yaml --freq korean-freq.csv`. Prints the report; `--json` flag for piping.
3. **`render.py`** — output renderers. Mixed-language (known tokens in Korean, unknowns substituted with gloss), frequency-highlighted text, etc.

---

## Project layout

```
hanbun/
├── pyproject.toml
├── src/hanbun/
│   ├── __init__.py       # public API
│   ├── lists.py          # data models and loaders
│   ├── tokenize.py       # kiwipiepy wrapper
│   └── analyzer.py       # analyze() and TextAnalysis
├── tests/
│   ├── fixtures/         # small hand-built lists and texts
│   ├── test_lists.py
│   ├── test_tokenize.py
│   └── test_analyzer.py
└── examples/
    └── lists/
        └── README.md     # list format guide
```
