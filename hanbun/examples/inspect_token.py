"""
Debug tool: see exactly what kiwipiepy produces for any Korean word or phrase.
Use this when a word isn't matching your lists — it shows the lemma and POS
that hanbun actually looks up.

Usage:
    uv run python examples/inspect_token.py 먹었어요
    uv run python examples/inspect_token.py "저는 학생입니다"
"""

import sys
from hanbun import tokenize, load_vocab_yaml, load_freq_csv, analyze, is_grammatical

def inspect(text: str, vocab_path: str | None = None, freq_path: str | None = None):
    print(f"\n=== Tokens for: {text!r} ===\n")

    tokens = tokenize(text)
    for t in tokens:
        gram = " [grammatical]" if is_grammatical(t.pos) else ""
        print(f"  {t.form:<12} lemma={t.lemma:<12} pos={t.pos}{gram}")

    if vocab_path or freq_path:
        print()
        vocab_lists = [load_vocab_yaml(vocab_path)] if vocab_path else []
        freq_lists = [load_freq_csv(freq_path)] if freq_path else []
        result = analyze(text, vocab_lists=vocab_lists, freq_lists=freq_lists)
        print(f"=== Lookup results (with lists) ===\n")
        for t in result.tokens:
            hits = t["hits"]
            if t["is_grammatical"]:
                status = "grammatical (skipped)"
            elif not hits:
                status = "UNKNOWN"
            else:
                ranks = [h["rank"] for h in hits if h["rank"] is not None]
                rank_str = f"rank={min(ranks)}" if ranks else "vocab list"
                status = f"found — {rank_str}"
            print(f"  {t['form']:<12} {t['lemma']:<12} {t['pos']:<8} → {status}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: uv run python examples/inspect_token.py <korean text>")
        print("       uv run python examples/inspect_token.py <text> [vocab.yaml] [freq.csv]")
        sys.exit(1)

    text = sys.argv[1]
    vocab = sys.argv[2] if len(sys.argv) > 2 else None
    freq = sys.argv[3] if len(sys.argv) > 3 else None
    inspect(text, vocab, freq)
