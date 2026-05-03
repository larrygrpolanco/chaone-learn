"""Data models and loaders for vocabulary and frequency lists."""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, Field


class VocabularyEntry(BaseModel):
    lemma: str
    pos: str
    gloss: list[str] = Field(default_factory=list)
    romanization: str = ""
    tags: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class FrequencyEntry(VocabularyEntry):
    rank: int
    dispersion: float | None = None


def _base_pos(pos: str) -> str:
    """Strip kiwipiepy conjugation suffixes (-I irregular, -R regular) from a POS tag."""
    return pos.split("-")[0]


class VocabularyList(BaseModel):
    name: str
    source: str = ""
    entries: list[VocabularyEntry] = Field(default_factory=list)

    def lookup(self, lemma: str, pos: str) -> VocabularyEntry | None:
        base = _base_pos(pos)
        lemma_fallback = None
        for entry in self.entries:
            if entry.lemma == lemma:
                if entry.pos == base:
                    return entry
                if lemma_fallback is None:
                    lemma_fallback = entry
        return lemma_fallback


class FrequencyList(BaseModel):
    name: str
    source: str = ""
    entries: list[FrequencyEntry] = Field(default_factory=list)

    def lookup(self, lemma: str, pos: str) -> FrequencyEntry | None:
        base = _base_pos(pos)
        lemma_fallback = None
        for entry in self.entries:
            if entry.lemma == lemma:
                if entry.pos == base:
                    return entry
                if lemma_fallback is None:
                    lemma_fallback = entry
        return lemma_fallback


def _row_to_vocab(row: dict[str, str]) -> VocabularyEntry:
    return VocabularyEntry(
        lemma=row["lemma"],
        pos=row["pos"],
        gloss=[g.strip() for g in row.get("gloss", "").split("|") if g.strip()],
        romanization=row.get("romanization", ""),
        tags=[t.strip() for t in row.get("tags", "").split("|") if t.strip()],
    )


def _row_to_freq(row: dict[str, str]) -> FrequencyEntry:
    disp = row.get("dispersion", "")
    return FrequencyEntry(
        lemma=row["lemma"],
        pos=row["pos"],
        rank=int(row["rank"]),
        dispersion=float(disp) if disp else None,
        gloss=[g.strip() for g in row.get("gloss", "").split("|") if g.strip()],
        romanization=row.get("romanization", ""),
        tags=[t.strip() for t in row.get("tags", "").split("|") if t.strip()],
    )


def load_vocab_csv(path: str | Path, name: str = "", source: str = "") -> VocabularyList:
    p = Path(path)
    with p.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        entries = [_row_to_vocab(row) for row in reader]
    return VocabularyList(name=name or p.stem, source=source, entries=entries)


def load_freq_csv(path: str | Path, name: str = "", source: str = "") -> FrequencyList:
    p = Path(path)
    with p.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        entries = [_row_to_freq(row) for row in reader]
    return FrequencyList(name=name or p.stem, source=source, entries=entries)


def _parse_vocab_entries(raw: list[dict[str, Any]]) -> list[VocabularyEntry]:
    result = []
    for item in raw:
        gloss = item.get("gloss", [])
        if isinstance(gloss, str):
            gloss = [g.strip() for g in gloss.split("|") if g.strip()]
        tags = item.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split("|") if t.strip()]
        result.append(
            VocabularyEntry(
                lemma=item["lemma"],
                pos=item["pos"],
                gloss=gloss,
                romanization=item.get("romanization", ""),
                tags=tags,
                metadata=item.get("metadata", {}),
            )
        )
    return result


def _parse_freq_entries(raw: list[dict[str, Any]]) -> list[FrequencyEntry]:
    result = []
    for item in raw:
        gloss = item.get("gloss", [])
        if isinstance(gloss, str):
            gloss = [g.strip() for g in gloss.split("|") if g.strip()]
        tags = item.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split("|") if t.strip()]
        result.append(
            FrequencyEntry(
                lemma=item["lemma"],
                pos=item["pos"],
                rank=int(item["rank"]),
                dispersion=item.get("dispersion"),
                gloss=gloss,
                romanization=item.get("romanization", ""),
                tags=tags,
                metadata=item.get("metadata", {}),
            )
        )
    return result


def load_vocab_yaml(path: str | Path, name: str = "", source: str = "") -> VocabularyList:
    p = Path(path)
    with p.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    entries = _parse_vocab_entries(data.get("entries", data) if isinstance(data, dict) else data)
    return VocabularyList(
        name=name or data.get("name", p.stem) if isinstance(data, dict) else name or p.stem,
        source=source or (data.get("source", "") if isinstance(data, dict) else ""),
        entries=entries,
    )


def load_freq_yaml(path: str | Path, name: str = "", source: str = "") -> FrequencyList:
    p = Path(path)
    with p.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    entries = _parse_freq_entries(data.get("entries", data) if isinstance(data, dict) else data)
    return FrequencyList(
        name=name or data.get("name", p.stem) if isinstance(data, dict) else name or p.stem,
        source=source or (data.get("source", "") if isinstance(data, dict) else ""),
        entries=entries,
    )


def load_vocab_json(path: str | Path, name: str = "", source: str = "") -> VocabularyList:
    p = Path(path)
    with p.open(encoding="utf-8") as f:
        data = json.load(f)
    entries = _parse_vocab_entries(data.get("entries", data) if isinstance(data, dict) else data)
    return VocabularyList(
        name=name or data.get("name", p.stem) if isinstance(data, dict) else name or p.stem,
        source=source or (data.get("source", "") if isinstance(data, dict) else ""),
        entries=entries,
    )


def load_freq_json(path: str | Path, name: str = "", source: str = "") -> FrequencyList:
    p = Path(path)
    with p.open(encoding="utf-8") as f:
        data = json.load(f)
    entries = _parse_freq_entries(data.get("entries", data) if isinstance(data, dict) else data)
    return FrequencyList(
        name=name or data.get("name", p.stem) if isinstance(data, dict) else name or p.stem,
        source=source or (data.get("source", "") if isinstance(data, dict) else ""),
        entries=entries,
    )
