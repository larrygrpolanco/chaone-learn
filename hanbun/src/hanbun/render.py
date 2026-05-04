"""Renderer: transform TextAnalysis into annotated RenderedSpan sequences."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from hanbun.analyzer import TextAnalysis


@dataclass
class RenderConfig:
    threshold_rank: int = 500  # freq rank above this → substituted; 0 = freq list ignored


@dataclass
class RenderedSpan:
    original: str           # original text slice (Korean or whitespace/punctuation)
    gloss: str | None       # English gloss when status is "substituted"
    status: str             # "known" | "substituted" | "unknown" | "grammatical" | "gap"
    token: dict[str, Any] | None  # underlying token dict; None for gap spans


def _best_gloss(hits: list[dict[str, Any]]) -> str | None:
    """Return the first gloss from the best hit: vocab hit (rank=None) preferred, else lowest rank."""
    vocab_hits = [h for h in hits if h["rank"] is None]
    if vocab_hits and vocab_hits[0]["gloss"]:
        return vocab_hits[0]["gloss"][0]
    freq_hits = sorted([h for h in hits if h["rank"] is not None], key=lambda h: h["rank"])
    if freq_hits and freq_hits[0]["gloss"]:
        return freq_hits[0]["gloss"][0]
    return None


def _classify(token: dict[str, Any], config: RenderConfig) -> tuple[str, str | None]:
    """Return (status, gloss) for a token."""
    if token["is_grammatical"]:
        return "grammatical", None

    hits = token["hits"]

    if not hits:
        return "unknown", None

    # Vocab hit (no rank) → always known
    if any(h["rank"] is None for h in hits):
        return "known", None

    # All hits are freq hits; check threshold
    if config.threshold_rank > 0 and all(h["rank"] > config.threshold_rank for h in hits):
        gloss = _best_gloss(hits)
        return "substituted", gloss

    return "known", None


def render_mixed(analysis: TextAnalysis, config: RenderConfig | None = None) -> list[RenderedSpan]:
    """Return a list of RenderedSpans covering the full original text."""
    if config is None:
        config = RenderConfig()

    text = analysis.text
    tokens = sorted(analysis.tokens, key=lambda t: t["start"])
    spans: list[RenderedSpan] = []
    cursor = 0

    for token in tokens:
        start, end = token["start"], token["end"]
        effective_start = max(start, cursor)

        # Skip tokens fully contained within already-emitted text (kiwipiepy can overlap)
        if effective_start >= end:
            continue

        # Gap before this token
        if cursor < start:
            spans.append(RenderedSpan(original=text[cursor:start], gloss=None, status="gap", token=None))

        status, gloss = _classify(token, config)
        spans.append(RenderedSpan(original=text[effective_start:end], gloss=gloss, status=status, token=token))
        cursor = end

    # Trailing gap
    if cursor < len(text):
        spans.append(RenderedSpan(original=text[cursor:], gloss=None, status="gap", token=None))

    return spans
