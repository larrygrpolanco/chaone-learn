"""Tests for the core analyze() function."""

import json
from pathlib import Path

from hanbun import analyze
from hanbun.lists import load_freq_csv, load_vocab_yaml

FIXTURES = Path(__file__).parent / "fixtures"


def test_analyze_no_lists():
    result = analyze("저는 학생입니다.")
    assert result.text == "저는 학생입니다."
    assert result.metrics.token_count > 0
    assert result.metrics.coverage_pct == 0.0
    assert len(result.unknowns) > 0


def test_analyze_with_vocab_list():
    vl = load_vocab_yaml(FIXTURES / "small_vocab.yaml")
    result = analyze("저는 학생입니다.", vocab_lists=[vl])
    assert result.metrics.covered_count > 0
    assert result.metrics.coverage_pct > 0


def test_analyze_with_freq_list():
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    result = analyze("밥을 먹었어요.", freq_lists=[fl])
    assert result.metrics.covered_count > 0
    assert len(result.metrics.freq_band_counts) > 0


def test_analyze_both_lists():
    vl = load_vocab_yaml(FIXTURES / "small_vocab.yaml")
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    result = analyze("저는 밥을 먹었어요.", vocab_lists=[vl], freq_lists=[fl])
    assert result.metrics.coverage_pct > 0
    # a hit in both lists means the token shows up in hits twice
    any_double_hit = any(len(t["hits"]) > 1 for t in result.tokens)
    assert any_double_hit


def test_json_serialization():
    result = analyze("저는 학생입니다.")
    data = json.loads(result.model_dump_json())
    assert "tokens" in data
    assert "metrics" in data
    assert "unknowns" in data
    assert "summary" in data


def test_summary_is_nonempty():
    result = analyze("안녕하세요.")
    assert result.summary


def test_grammatical_tokens_excluded_from_coverage():
    # "저는" = 저 (NP, content) + 는 (JX, grammatical)
    # With no lists, coverage is 0 but token_count should only count content tokens
    result = analyze("저는.")
    total_morphemes = len(result.tokens)
    content_count = sum(1 for t in result.tokens if not t["is_grammatical"])
    assert result.metrics.token_count == content_count
    assert result.metrics.token_count < total_morphemes


def test_grammatical_flag_in_token_dict():
    result = analyze("저는 학생입니다.")
    for token in result.tokens:
        assert "is_grammatical" in token


def test_type_token_ratio_range():
    result = analyze("저는 저는 저는.")
    # TTR should be <= 1.0
    assert 0.0 <= result.metrics.type_token_ratio <= 1.0
