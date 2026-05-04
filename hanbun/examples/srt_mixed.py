"""
SRT subtitle mixer: replace above-threshold Korean words with English glosses.
Preserves all SRT timing and structure. Skips non-Korean lines (English, numbers,
markers like ♫ or parenthetical stage directions) untouched.

Usage:
    uv run python examples/srt_mixed.py examples/My_Mister_episode_1.srt
    uv run python examples/srt_mixed.py examples/My_Mister_episode_1.srt --threshold 1000 --out output.srt
    uv run python examples/srt_mixed.py examples/My_Mister_episode_1.srt --stats
"""

import argparse
import re
import sys
from pathlib import Path
from hanbun import analyze, load_freq_csv
from hanbun.render import RenderConfig, render_mixed

DEFAULT_FREQ = Path(__file__).parent / "lists" / "1-5000_freq.csv"

# Matches one SRT block: index, timecode, text lines
SRT_BLOCK = re.compile(
    r"(\d+)\n"                          # index
    r"(\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n"  # timecode
    r"([\s\S]*?)(?=\n\n|\Z)",           # text (may be multi-line)
    re.MULTILINE,
)

KOREAN_RE = re.compile(r"[가-힣]")


def has_korean(text: str) -> bool:
    return bool(KOREAN_RE.search(text))


def render_line(line: str, freq_lists, config: RenderConfig) -> str:
    if not has_korean(line):
        return line
    result = analyze(line, freq_lists=freq_lists)
    spans = render_mixed(result, config)
    parts = []
    for s in spans:
        if s.status == "substituted" and s.gloss:
            parts.append(s.gloss)
        else:
            parts.append(s.original)
    return "".join(parts)


def process_srt(srt_text: str, freq_lists, config: RenderConfig):
    blocks = list(SRT_BLOCK.finditer(srt_text))
    if not blocks:
        print("WARNING: no SRT blocks found — check file format", file=sys.stderr)
        return srt_text, 0, 0

    out_blocks = []
    total_lines = 0
    substituted_blocks = 0

    for m in blocks:
        idx, timecode, text = m.group(1), m.group(2), m.group(3).strip()
        lines = text.split("\n")
        rendered_lines = []
        block_changed = False
        for line in lines:
            rendered = render_line(line, freq_lists, config)
            rendered_lines.append(rendered)
            if rendered != line:
                block_changed = True
            total_lines += 1
        if block_changed:
            substituted_blocks += 1
        out_blocks.append(f"{idx}\n{timecode}\n" + "\n".join(rendered_lines))

    return "\n\n".join(out_blocks) + "\n", total_lines, substituted_blocks


def main():
    parser = argparse.ArgumentParser(description="Mix Korean SRT with English glosses")
    parser.add_argument("srt", help="Input .srt file")
    parser.add_argument("--freq", default=str(DEFAULT_FREQ), help="Frequency CSV list")
    parser.add_argument("--threshold", type=int, default=500,
                        help="Freq rank threshold (default: 500)")
    parser.add_argument("--out", help="Output .srt file (default: print to stdout)")
    parser.add_argument("--stats", action="store_true", help="Print processing stats")
    parser.add_argument("--preview", type=int, default=0,
                        help="Preview first N subtitle blocks instead of full output")
    args = parser.parse_args()

    freq_lists = [load_freq_csv(args.freq)]
    config = RenderConfig(threshold_rank=args.threshold)

    srt_text = Path(args.srt).read_text(encoding="utf-8")

    if args.preview:
        blocks = list(SRT_BLOCK.finditer(srt_text))[:args.preview]
        preview_text = "\n\n".join(m.group(0) for m in blocks)
        output, total, changed = process_srt(preview_text, freq_lists, config)
    else:
        output, total, changed = process_srt(srt_text, freq_lists, config)

    if args.stats or args.preview:
        scope = f"first {args.preview} blocks" if args.preview else "full file"
        print(f"[{scope}] threshold={args.threshold} | lines processed: {total} | blocks with substitutions: {changed}",
              file=sys.stderr)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"Written to {args.out}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
