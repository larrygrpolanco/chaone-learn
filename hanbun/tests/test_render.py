"""Tests for render_mixed() and RenderConfig."""

from pathlib import Path

import pytest

from hanbun import analyze
from hanbun.lists import load_freq_csv, load_vocab_yaml
from hanbun.render import RenderConfig, RenderedSpan, render_mixed

FIXTURES = Path(__file__).parent / "fixtures"


def test_vocab_hit_is_known_regardless_of_threshold():
    # 학생 is in the vocab list (no rank); threshold=1 should NOT substitute it
    vl = load_vocab_yaml(FIXTURES / "small_vocab.yaml")
    analysis = analyze("학생입니다.", vocab_lists=[vl])
    config = RenderConfig(threshold_rank=1)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "known"


def test_freq_hit_within_threshold_is_known():
    # 학생 rank=450, threshold=500 → known
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("학생입니다.", freq_lists=[fl])
    config = RenderConfig(threshold_rank=500)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "known"


def test_freq_hit_above_threshold_is_substituted():
    # 학생 rank=450, threshold=300 → substituted
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("학생입니다.", freq_lists=[fl])
    config = RenderConfig(threshold_rank=300)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "substituted"
    assert student_span.gloss is not None


def test_vocab_hit_wins_over_freq_hit_above_threshold():
    # 학생 in both lists; freq rank=450, threshold=300 → vocab hit wins → known
    vl = load_vocab_yaml(FIXTURES / "small_vocab.yaml")
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("학생입니다.", vocab_lists=[vl], freq_lists=[fl])
    config = RenderConfig(threshold_rank=300)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "known"


def test_no_hits_is_unknown():
    # 호랑이 (tiger) is not in any fixture list
    analysis = analyze("호랑이가 왔어요.")
    spans = render_mixed(analysis)
    tiger_span = next((s for s in spans if s.original == "호랑이"), None)
    assert tiger_span is not None
    assert tiger_span.status == "unknown"
    assert tiger_span.gloss is None


def test_grammatical_morpheme_is_grammatical():
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("저는 학생입니다.", freq_lists=[fl])
    spans = render_mixed(analysis)
    grammatical_spans = [s for s in spans if s.status == "grammatical"]
    assert len(grammatical_spans) > 0


def test_spaces_produce_gap_spans():
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("저는 학생입니다.", freq_lists=[fl])
    spans = render_mixed(analysis)
    gap_spans = [s for s in spans if s.status == "gap"]
    # There's a space between 저는 and 학생
    assert any(s.original == " " for s in gap_spans)


def test_spans_reconstruct_original_text():
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("저는 학생입니다.", freq_lists=[fl])
    spans = render_mixed(analysis)
    assert "".join(s.original for s in spans) == analysis.text


def test_threshold_zero_disables_freq_substitution():
    # threshold=0 → the freq-list guard is skipped, all freq hits treated as known
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("학생입니다.", freq_lists=[fl])
    config = RenderConfig(threshold_rank=0)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "known"


def test_substituted_span_gloss_is_populated():
    # 학생 rank=450, threshold=300 → substituted, gloss should be "student"
    fl = load_freq_csv(FIXTURES / "small_freq.csv")
    analysis = analyze("학생입니다.", freq_lists=[fl])
    config = RenderConfig(threshold_rank=300)
    spans = render_mixed(analysis, config)
    student_span = next(s for s in spans if s.original == "학생")
    assert student_span.status == "substituted"
    assert student_span.gloss == "student"
