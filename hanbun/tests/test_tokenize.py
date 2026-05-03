"""Tests for the kiwipiepy tokenizer wrapper."""

from hanbun.tokenize import Token, is_grammatical, tokenize


def test_returns_list_of_tokens():
    tokens = tokenize("저는 학생입니다.")
    assert isinstance(tokens, list)
    assert len(tokens) > 0
    assert all(isinstance(t, Token) for t in tokens)


def test_token_fields_populated():
    tokens = tokenize("먹다")
    for t in tokens:
        assert t.form
        assert t.lemma
        assert t.pos
        assert t.end >= t.start


def test_known_sentence_contains_expected_lemmas():
    tokens = tokenize("저는 학생입니다.")
    lemmas = {t.lemma for t in tokens}
    assert "저" in lemmas
    assert "학생" in lemmas


def test_empty_string():
    tokens = tokenize("")
    assert tokens == []


def test_is_grammatical_particles_and_endings():
    assert is_grammatical("JKO") is True   # object particle
    assert is_grammatical("JX") is True    # auxiliary particle
    assert is_grammatical("EC") is True    # connective ending
    assert is_grammatical("EF") is True    # final ending
    assert is_grammatical("EP") is True    # pre-final ending
    assert is_grammatical("ETM") is True   # modifier ending
    assert is_grammatical("XSV") is True   # verb suffix
    assert is_grammatical("SF") is True    # period
    assert is_grammatical("SP") is True    # comma


def test_is_grammatical_content_words():
    assert is_grammatical("NNG") is False  # common noun
    assert is_grammatical("VV") is False   # verb
    assert is_grammatical("VA") is False   # adjective
    assert is_grammatical("MAG") is False  # adverb
    assert is_grammatical("NNG") is False


def test_is_grammatical_strips_pos_suffix():
    assert is_grammatical("VV-R") is False
    assert is_grammatical("EC-R") is True


def test_verb_lemma_normalized():
    # kiwipiepy returns the infinitive form (먹다) as the lemma for VV tokens
    tokens = tokenize("밥을 먹었어요.")
    vv_tokens = [t for t in tokens if t.pos == "VV"]
    assert any("먹" in t.lemma for t in vv_tokens)
