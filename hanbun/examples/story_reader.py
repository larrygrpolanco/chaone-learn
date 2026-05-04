"""
Graded story reader: analyze a Korean story text against vocab/freq lists.
Shows coverage summary, unknown words, and mixed Korean/English rendering.

Usage:
    uv run python examples/story_reader.py examples/beginner-story.txt
    uv run python examples/story_reader.py examples/intermediate-story.txt --threshold 1000
    uv run python examples/story_reader.py examples/beginner-story.txt --vocab examples/lists/beginning-1-vocab.yaml
"""

import argparse
from pathlib import Path
from hanbun import analyze, load_vocab_yaml, load_freq_csv
from hanbun.render import RenderConfig, render_mixed

DEFAULT_FREQ = Path(__file__).parent / "lists" / "1-5000_freq.csv"
DEFAULT_VOCAB = Path(__file__).parent / "lists" / "beginning-1-vocab.yaml"


def render_to_string(spans) -> str:
    parts = []
    for s in spans:
        if s.status == "substituted" and s.gloss:
            parts.append(f"[{s.gloss}]")
        else:
            parts.append(s.original)
    return "".join(parts)


def main():
    parser = argparse.ArgumentParser(description="Analyze a Korean story file")
    parser.add_argument("story", help="Path to story .txt file")
    parser.add_argument("--vocab", default=str(DEFAULT_VOCAB), help="Vocab YAML list")
    parser.add_argument("--freq", default=str(DEFAULT_FREQ), help="Frequency CSV list")
    parser.add_argument("--threshold", type=int, default=500,
                        help="Freq rank threshold — words above this rank get English gloss (default: 500)")
    parser.add_argument("--no-vocab", action="store_true", help="Skip vocab list, use freq only")
    args = parser.parse_args()

    story_text = Path(args.story).read_text(encoding="utf-8")

    vocab_lists = [] if args.no_vocab else [load_vocab_yaml(args.vocab)]
    freq_lists = [load_freq_csv(args.freq)]

    result = analyze(story_text, vocab_lists=vocab_lists, freq_lists=freq_lists)
    config = RenderConfig(threshold_rank=args.threshold)
    spans = render_mixed(result, config)

    print(f"=== {Path(args.story).name} ===")
    print(f"Threshold: rank > {args.threshold} → English\n")
    print(result.summary)

    m = result.metrics
    print(f"  content tokens : {m.token_count}")
    print(f"  unique types   : {m.unique_lemma_count}")
    print(f"  coverage       : {m.coverage_pct:.1f}%")

    if result.unknowns:
        print(f"\n--- Unknowns ({len(result.unknowns)}) ---")
        for u in result.unknowns:
            print(f"  {u['lemma']:<15} ({u['pos']})  ×{u['count']}")
    else:
        print("\n--- No unknowns ---")

    print(f"\n--- Mixed rendering (threshold={args.threshold}) ---")
    print(render_to_string(spans))

    print(f"\n--- Span breakdown (first 30 content spans) ---")
    content_spans = [s for s in spans if s.status != "gap"][:30]
    for s in content_spans:
        label = f"[{s.status}]"
        display = f"[{s.gloss}]" if s.status == "substituted" else repr(s.original)
        print(f"  {label:<16} {display}")


if __name__ == "__main__":
    main()
