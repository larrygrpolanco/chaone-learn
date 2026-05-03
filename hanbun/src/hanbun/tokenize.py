"""kiwipiepy wrapper: tokenize Korean text into normalized morpheme tuples."""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from kiwipiepy import Kiwi


_GRAMMATICAL_PREFIXES = ("J", "E", "XS", "XPN", "SF", "SP", "SS", "SE", "SO", "SW", "SY")


def is_grammatical(pos: str) -> bool:
    """Return True for particles, endings, suffixes, and punctuation — morphemes with no standalone learnable meaning."""
    return pos.split("-")[0].startswith(_GRAMMATICAL_PREFIXES)


@dataclass(frozen=True)
class Token:
    form: str       # surface form as it appears in text
    lemma: str      # dictionary / base form
    pos: str        # Sejong POS tag (NNG, VV, JKO, EP, EF, EC, …)
    start: int      # character offset in original text
    end: int        # exclusive end offset


@lru_cache(maxsize=1)
def _get_kiwi() -> Kiwi:
    return Kiwi()


def tokenize(text: str) -> list[Token]:
    """Return a list of Tokens for the given Korean text."""
    kiwi = _get_kiwi()
    result = kiwi.tokenize(text)
    tokens: list[Token] = []
    for token in result:
        lemma = token.lemma if token.lemma else token.form
        tokens.append(
            Token(
                form=token.form,
                lemma=lemma,
                pos=str(token.tag),
                start=token.start,
                end=token.start + token.len,
            )
        )
    return tokens
