"""Tests for list models and loaders."""

from pathlib import Path

import pytest

from hanbun.lists import (
    VocabularyList,
    FrequencyList,
    VocabularyEntry,
    FrequencyEntry,
    load_vocab_yaml,
    load_freq_csv,
)

FIXTURES = Path(__file__).parent / "fixtures"


def test_vocab_entry_defaults():
    e = VocabularyEntry(lemma="먹", pos="VV")
    assert e.gloss == []
    assert e.tags == []
    assert e.romanization == ""


def test_freq_entry_requires_rank():
    e = FrequencyEntry(lemma="먹", pos="VV", rank=280)
    assert e.rank == 280
    assert e.dispersion is None


def test_vocab_list_lookup_hit():
    vl = VocabularyList(
        name="test",
        entries=[VocabularyEntry(lemma="먹", pos="VV", gloss=["to eat"])],
    )
    result = vl.lookup("먹", "VV")
    assert result is not None
    assert result.gloss == ["to eat"]


def test_vocab_list_lookup_miss():
    vl = VocabularyList(name="test", entries=[])
    assert vl.lookup("없", "VA") is None


def test_load_vocab_yaml():
    vl = load_vocab_yaml(FIXTURES / "small_vocab.yaml")
    assert vl.name == "small_test_vocab"
    assert len(vl.entries) == 7
    entry = vl.lookup("학생", "NNG")
    assert vl.lookup("이다", "VCP") is not None
    assert entry is not None
    assert "student" in entry.gloss


def test_load_freq_csv():
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    assert len(fl.entries) == 7
    entry = fl.lookup("먹다", "VV")
    assert entry is not None
    assert entry.rank == 280
    assert entry.dispersion == pytest.approx(0.88)


def test_freq_list_lookup_miss():
    fl = FrequencyList(name="test", entries=[])
    assert fl.lookup("없", "VA") is None


def test_vocab_lookup_strips_pos_suffix():
    vl = VocabularyList(
        name="test",
        entries=[VocabularyEntry(lemma="잡다", pos="VV", gloss=["to catch"])],
    )
    assert vl.lookup("잡다", "VV-R") is not None
    assert vl.lookup("잡다", "VV-I") is not None


def test_vocab_lookup_lemma_fallback_different_pos():
    vl = VocabularyList(
        name="test",
        entries=[VocabularyEntry(lemma="있다", pos="VX", gloss=["progressive aux"])],
    )
    result = vl.lookup("있다", "VV")
    assert result is not None
    assert result.pos == "VX"


def test_freq_lookup_strips_pos_suffix():
    fl = FrequencyList(
        name="test",
        entries=[FrequencyEntry(lemma="시끄럽다", pos="VA", rank=3163, gloss=["noisy"])],
    )
    assert fl.lookup("시끄럽다", "VA-I") is not None


def test_vocab_json_roundtrip():
    vl = VocabularyList(
        name="roundtrip",
        entries=[VocabularyEntry(lemma="집", pos="NNG", gloss=["house"])],
    )
    data = vl.model_dump_json()
    vl2 = VocabularyList.model_validate_json(data)
    assert vl2.lookup("집", "NNG") is not None
