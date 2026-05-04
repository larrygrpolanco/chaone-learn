# hanbun

A Python library for analyzing Korean text against vocabulary and frequency lists. Give it a Korean text and a set of lists; it tells you which words are "known" and which aren't.

> See [HANBUN.md](../Plans/HANBUN.md) for the full design document — what this is for, what it's not, and why decisions were made.

---

## Possible directions (still being figured out)

Two use cases are driving the design, though neither is fully built yet:

**1. Mixed-language reading for TV/subtitles**
A learner loads a frequency band (e.g. top 500 most common words). They get back the Korean text with known words left in Korean and unfamiliar words swapped for their English gloss. The idea: stay in Korean as much as possible while letting the learner follow along without stopping. Today this works on SRT files downloaded from a streaming service.

**2. Graded story authoring**
Used internally to check and adjust Korean stories. The analyzer flags words outside the learner's band so writers can swap synonyms or rephrase to hit a coverage target (roughly 95–98% known). A future extension is an AI-assisted choose-your-own-adventure generator that adapts the story to the learner's level in real time.

---

## Status

The core pipeline is working end-to-end. You can tokenize Korean text, load vocabulary and frequency lists, run the analyzer, and render mixed Korean/English output today.

| Area | Status |
|------|--------|
| Data models (`lists.py`) | Done |
| kiwipiepy tokenizer wrapper (`tokenize.py`) | Done |
| `analyze()` function and `TextAnalysis` object (`analyzer.py`) | Done |
| Output renderer (`render.py`) | Done |
| Tests (38 passing) | Done |
| Note detectors (`notes.py`) | Not started |
| CLI (`cli.py`) | Not started |

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
from hanbun.render import RenderConfig, render_mixed

vl = load_vocab_yaml("examples/lists/my-vocab.yaml")
fl = load_freq_csv("examples/lists/korean-freq.csv")

result = analyze("저는 학생입니다.", vocab_lists=[vl], freq_lists=[fl])

print(result.summary)
# e.g. "5 tokens, 80.0% covered; 1 unique unknowns."

# Render mixed Korean/English — words above rank 500 get their English gloss
config = RenderConfig(threshold_rank=500)
spans = render_mixed(result, config)
output = "".join(s.gloss if s.status == "substituted" else s.original for s in spans)
print(output)
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

Lists must use the same lemma form that kiwipiepy produces. If a lookup still isn't hitting, use the debug script:

```bash
uv run python examples/inspect_token.py 먹었어요
uv run python examples/inspect_token.py 먹었어요 examples/lists/my-vocab.yaml examples/lists/korean-freq.csv
```

Or inline:

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

## What `render_mixed()` returns

```python
from hanbun.render import RenderConfig, render_mixed

config = RenderConfig(threshold_rank=500)
spans = render_mixed(result, config)
```

A `list[RenderedSpan]`, one entry per token or gap. Each span has:

- `original` — the surface text slice
- `status` — `"known"` | `"substituted"` | `"unknown"` | `"grammatical"` | `"gap"`
- `gloss` — English gloss string when `status == "substituted"`, else `None`
- `token` — the underlying token dict; `None` for gap spans

**Status rules:**
- `known` — found in a vocab list, or found in freq list at or below the threshold rank
- `substituted` — found in freq list but above the threshold rank; show `gloss` instead
- `unknown` — not found in any list
- `grammatical` — particle, verb ending, suffix, punctuation — excluded from coverage counts
- `gap` — whitespace or punctuation between tokens

Formatting is left to you — iterate spans and build whatever output you need.

---

## Run tests

```bash
uv run pytest
```

---

## Example scripts

Ready-to-run scripts in `examples/`:

**`inspect_token.py`** — debug tool: see exactly what lemma and POS kiwipiepy assigns to any word, and whether it hits your lists.
```bash
uv run python examples/inspect_token.py 먹었어요
uv run python examples/inspect_token.py 먹었어요 examples/lists/beginning-1-vocab.yaml examples/lists/1-5000_freq.csv
```

**`story_reader.py`** — analyze a Korean story `.txt` file: coverage summary, unknowns, and mixed rendering.
```bash
uv run python examples/story_reader.py examples/beginner-story-1.txt
uv run python examples/story_reader.py examples/intermediate-story-1.txt --threshold 1000
```

**`srt_mixed.py`** — process an SRT subtitle file, replacing above-threshold words with English glosses while preserving all timing.
```bash
uv run python examples/srt_mixed.py examples/My_Mister_episode_1.srt --preview 20 --stats
uv run python examples/srt_mixed.py examples/My_Mister_episode_1.srt --out output.srt
```

---

## What's next

1. **`notes.py`** — pluggable soft-note detectors. Speech level mixing, honorific count, sentence length distribution. Each note is a small function that runs over the token list and fires when its condition is met.
2. **`cli.py`** — `hanbun analyze story.txt --vocab my-list.yaml --freq korean-freq.csv`. Prints the report; `--json` flag for piping.

---

## Project layout

```
hanbun/
├── pyproject.toml
├── src/hanbun/
│   ├── __init__.py       # public API
│   ├── lists.py          # data models and loaders
│   ├── tokenize.py       # kiwipiepy wrapper
│   ├── analyzer.py       # analyze() and TextAnalysis
│   └── render.py         # render_mixed() → List[RenderedSpan]
├── tests/
│   ├── fixtures/         # small hand-built lists and texts
│   ├── test_lists.py
│   ├── test_tokenize.py
│   ├── test_analyzer.py
│   └── test_render.py
└── examples/
    ├── inspect_token.py          # debug: inspect lemma/POS for any word
    ├── story_reader.py           # analyze a story .txt file
    ├── srt_mixed.py              # process an SRT subtitle file
    ├── beginner-story-1.txt
    ├── beginner-story-2.txt
    ├── intermediate-story-1.txt
    ├── My_Mister_episode_1.srt
    ├── My_Mister_episode_2.srt
    └── lists/
        ├── README.md             # list format guide
        ├── beginning-1-vocab.yaml
        └── 1-5000_freq.csv
```
