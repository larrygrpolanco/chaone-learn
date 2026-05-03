"""Core analyzer: tokenize text, look up against lists, return TextAnalysis."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from pydantic import BaseModel

from hanbun.lists import FrequencyEntry, FrequencyList, VocabularyEntry, VocabularyList
from hanbun.tokenize import Token, is_grammatical, tokenize


@dataclass(frozen=True)
class ListHit:
    list_name: str
    entry: VocabularyEntry | FrequencyEntry


@dataclass
class AnnotatedToken:
    token: Token
    hits: list[ListHit] = field(default_factory=list)

    @property
    def is_grammatical(self) -> bool:
        return is_grammatical(self.token.pos)

    @property
    def in_any_list(self) -> bool:
        return len(self.hits) > 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "form": self.token.form,
            "lemma": self.token.lemma,
            "pos": self.token.pos,
            "is_grammatical": self.is_grammatical,
            "start": self.token.start,
            "end": self.token.end,
            "hits": [
                {
                    "list": h.list_name,
                    "rank": h.entry.rank if isinstance(h.entry, FrequencyEntry) else None,
                    "gloss": h.entry.gloss,
                    "tags": h.entry.tags,
                }
                for h in self.hits
            ],
        }


class Metrics(BaseModel):
    token_count: int = 0
    unique_lemma_count: int = 0
    covered_count: int = 0
    coverage_pct: float = 0.0
    unknown_count: int = 0
    freq_band_counts: dict[str, int] = {}
    type_token_ratio: float = 0.0


class TextAnalysis(BaseModel):
    text: str
    tokens: list[dict[str, Any]] = []
    metrics: Metrics = Metrics()
    notes: list[str] = []
    unknowns: list[dict[str, Any]] = []
    summary: str = ""

    model_config = {"arbitrary_types_allowed": True}


def _freq_band(rank: int) -> str:
    if rank <= 500:
        return "1-500"
    elif rank <= 1000:
        return "501-1000"
    elif rank <= 2000:
        return "1001-2000"
    elif rank <= 5000:
        return "2001-5000"
    else:
        return "5001+"


def analyze(
    text: str,
    vocab_lists: list[VocabularyList] | None = None,
    freq_lists: list[FrequencyList] | None = None,
) -> TextAnalysis:
    """Tokenize text and look up each token against the provided lists."""
    vocab_lists = vocab_lists or []
    freq_lists = freq_lists or []

    raw_tokens = tokenize(text)

    annotated: list[AnnotatedToken] = []
    for tok in raw_tokens:
        at = AnnotatedToken(token=tok)
        for vl in vocab_lists:
            entry = vl.lookup(tok.lemma, tok.pos)
            if entry:
                at.hits.append(ListHit(list_name=vl.name, entry=entry))
        for fl in freq_lists:
            entry = fl.lookup(tok.lemma, tok.pos)
            if entry:
                at.hits.append(ListHit(list_name=fl.name, entry=entry))
        annotated.append(at)

    content_tokens = [at for at in annotated if not at.is_grammatical]
    token_count = len(content_tokens)
    covered_count = sum(1 for at in content_tokens if at.in_any_list)
    unique_lemmas = {(at.token.lemma, at.token.pos) for at in content_tokens}
    coverage_pct = (covered_count / token_count * 100) if token_count else 0.0
    type_token_ratio = (len(unique_lemmas) / token_count) if token_count else 0.0

    freq_band_counts: dict[str, int] = {}
    for at in annotated:
        for hit in at.hits:
            if isinstance(hit.entry, FrequencyEntry):
                band = _freq_band(hit.entry.rank)
                freq_band_counts[band] = freq_band_counts.get(band, 0) + 1

    unknown_map: dict[tuple[str, str], int] = {}
    for at in content_tokens:
        if not at.in_any_list:
            key = (at.token.lemma, at.token.pos)
            unknown_map[key] = unknown_map.get(key, 0) + 1

    unknowns = [
        {"lemma": lemma, "pos": pos, "count": count}
        for (lemma, pos), count in sorted(unknown_map.items(), key=lambda x: -x[1])
    ]

    metrics = Metrics(
        token_count=token_count,
        unique_lemma_count=len(unique_lemmas),
        covered_count=covered_count,
        coverage_pct=round(coverage_pct, 2),
        unknown_count=len(unknowns),
        freq_band_counts=freq_band_counts,
        type_token_ratio=round(type_token_ratio, 4),
    )

    summary_parts = [f"{token_count} tokens, {coverage_pct:.1f}% covered"]
    if unknowns:
        summary_parts.append(f"{len(unknowns)} unique unknowns")
    summary = "; ".join(summary_parts) + "."

    return TextAnalysis(
        text=text,
        tokens=[at.to_dict() for at in annotated],
        metrics=metrics,
        notes=[],
        unknowns=unknowns,
        summary=summary,
    )
