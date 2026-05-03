# List formats

This directory is for your vocabulary and frequency list files. Drop them here and load them with the appropriate loader function.

---

## Vocabulary lists

Use YAML for lists you edit by hand (textbook chapter lists, custom curriculum, etc.). Use CSV if you're exporting from a spreadsheet or another tool. JSON is available for machine-generated lists.

### YAML — recommended for hand-edited lists

```yaml
name: my-vocab-list          # required — used as the list's display name
source: "YONSEI 1A Ch.1"    # optional — where it came from

entries:
  - lemma: 학생
    pos: NNG
    gloss: ["student"]
    romanization: haksaeng   # optional
    tags: [sino-korean]      # optional — any labels you find useful

  - lemma: 먹다
    pos: VV
    gloss: ["to eat"]

  - lemma: 는
    pos: JX
    gloss: ["topic marker"]
```

Load it:

```python
from hanbun import load_vocab_yaml
vl = load_vocab_yaml("examples/lists/my-vocab.yaml")
```

### CSV — for spreadsheet imports

```
lemma,pos,gloss,romanization,tags
학생,NNG,student,haksaeng,sino-korean
먹다,VV,to eat,,
는,JX,topic marker,,
```

- `gloss` and `tags` can use `|` to separate multiple values: `to eat|to consume`
- `romanization` and `tags` columns are optional; leave blank if not needed

Load it:

```python
from hanbun import load_vocab_csv
vl = load_vocab_csv("examples/lists/my-vocab.csv")
```

---

## Frequency lists

Frequency lists must have a `rank` column (1 = most frequent). `dispersion` is optional but useful if your source provides it.

### CSV — standard format for frequency data

```
lemma,pos,rank,dispersion,gloss
이다,VCP,1,0.98,to be
하다,VV,2,0.97,to do
있다,VA,3,0.95,to exist/have
저,NP,12,0.95,I (humble)
학생,NNG,450,0.82,student
```

Load it:

```python
from hanbun import load_freq_csv
fl = load_freq_csv("examples/lists/korean-freq.csv")
```

### YAML — for smaller hand-curated frequency lists

```yaml
name: topik-core-500
source: "TOPIK word list"

entries:
  - lemma: 이다
    pos: VCP
    rank: 1
    gloss: ["to be"]

  - lemma: 하다
    pos: VV
    rank: 2
    gloss: ["to do"]
```

---

## The lemma form matters

hanbun uses [kiwipiepy](https://github.com/bab2min/kiwipiepy) for morphological analysis. The lemma form it produces must match what you write in your lists exactly.

| Word type | Example surface | Lemma to use in your list |
|-----------|----------------|---------------------------|
| Noun | 학생이 | `학생` |
| Verb | 먹었어요 | `먹다` (with 다) |
| Adjective | 예뻐요 | `예쁘다` (with 다) |
| Copula | 입니다 | `이다` |
| Topic marker | 는/은 | `는` |
| Object marker | 을/를 | `을` |

The key rule: **verb and adjective lemmas include 다**. Nouns, particles, and endings do not.

If you're unsure what lemma kiwipiepy produces for a word, run:

```python
from hanbun import tokenize
for t in tokenize("먹었어요"):
    print(t.lemma, t.pos)
```

---

## POS tags

hanbun uses the Sejong tagset as output by kiwipiepy. Common tags:

| Tag | Category | Examples |
|-----|----------|---------|
| NNG | General noun | 학생, 밥, 집 |
| NNP | Proper noun | 서울, 한국 |
| NP  | Pronoun | 저, 나, 우리 |
| VV  | Verb | 먹다, 가다, 하다 |
| VA  | Adjective | 예쁘다, 크다 |
| VCP | Copula | 이다 |
| VCN | Negative copula | 아니다 |
| MAG | Adverb | 빨리, 정말 |
| JX  | Auxiliary particle | 는, 도, 만 |
| JKO | Object case marker | 을 |
| JKS | Subject case marker | 이/가 |
| EP  | Pre-final ending | 었, 겠, 시 |
| EF  | Final ending | 아요, ㅂ니다 |
| EC  | Connective ending | 고, 서, 지만 |
| ETM | Adnominal ending | 는, ㄴ, ㄹ |
| XSV | Verb-forming suffix | 하 (in 공부하다) |

Full tagset: [kiwipiepy documentation](https://github.com/bab2min/kiwipiepy#part-of-speech-tags)
