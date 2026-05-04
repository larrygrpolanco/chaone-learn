"""
AI-enhanced Korean SRT subtitle mixer for language learning.

Two-pass pipeline:
  1. hanbun analyzes and renders each line — known words (rank ≤ threshold) stay Korean,
     above-threshold words get their freq-list English gloss, unknowns stay Korean.
  2. Claude receives every changed line (original + hanbun draft) and acts as a language
     learning expert: it fixes formatting, improves glosses in sentence context, translates
     unknown Korean content words, and makes smart decisions about what helps a learner most.

Particles and grammatical morphemes always stay in Korean so learners see natural sentence
structure — this is intentional and pedagogically important.

Usage (from repo root via wrapper):
    ./learn subtitles/Stranger/S01_E09_Stranger.ko.cc.srt
    ./learn subtitles/Stranger/S01_E09_Stranger.ko.cc.srt --threshold 500
    ./learn subtitles/Stranger/S01_E09_Stranger.ko.cc.srt --preview 30 --stats
    ./learn subtitles/Stranger/S01_E09_Stranger.ko.cc.srt --threshold 200 --out my_output.srt
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

# Load .env from the same directory as this script
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip())

import anthropic
from hanbun import analyze, load_freq_csv, load_vocab_yaml
from hanbun.render import RenderConfig, render_mixed

REPO_ROOT = Path(__file__).parent.parent
DEFAULT_FREQ = REPO_ROOT / "hanbun" / "examples" / "lists" / "1-5000_freq.csv"

SRT_BLOCK = re.compile(
    r"(\d+)\n"
    r"(\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n"
    r"([\s\S]*?)(?=\n\n|\Z)",
    re.MULTILINE,
)

KOREAN_RE = re.compile(r"[가-힣]")
STAGE_RE = re.compile(r"^\[.*\]$|^\(.*\)$")

POLISH_SYSTEM = """\
You are a Korean language learning expert creating bilingual subtitles for intermediate \
Korean learners watching Korean TV dramas.

THE LEARNING GOAL:
The learner is trying to watch Korean content in Korean as much as possible. The subtitle \
strategy is "comprehensible input with scaffolding" — keep the Korean sentence structure \
intact so the learner absorbs grammar and particles naturally, while replacing words they \
likely don't know with English glosses so they can follow the story without stopping.

The ideal output lets a learner say: "I can read this subtitle, understand what's happening, \
AND I'm absorbing how Korean sentences are structured because the grammar is still in Korean."

HOW THE PIPELINE WORKS:
A frequency analysis tool (hanbun) has already done a first pass:
- Common words (within the learner's threshold rank) stay in Korean
- Words above the threshold got substituted with English glosses from a dictionary
- Truly unknown words (not in any list) stayed in Korean
- Particles (은/는/이/가/을/를/에서/으로 etc.) always stay Korean — this is intentional

YOUR JOB on each line:
1. Fix any mechanical errors from the first pass: missing spaces between English and Korean \
   (e.g. "resign하다" → "resign 하다"), awkward or wrong glosses, overly literal translations
2. Translate any remaining Korean content words the learner likely doesn't know — \
   check the original to find them
3. Keep ALL Korean particles exactly as-is — they are pedagogically valuable
4. Keep Korean words that are genuinely common/everyday (learner probably knows them)
5. Keep character names in Korean (they learn names from context)
6. Keep stage directions like [음악] (music cue) or (창준) (speaker label) exactly as-is
7. Use natural English glosses — not dictionary definitions. "to investigate" not "to conduct investigation"
8. Match subtitle length: don't expand a 4-word line into a sentence

CONTEXT: This is Stranger (비밀의 숲 / Secret Forest), a Korean legal/crime thriller. \
Vocabulary is heavy on: prosecutor/검사, investigation/수사, warrant/영장, suspect/피의자, \
district office/지검, special assignment/특임, evidence/증거, arrest/구속. \
Characters speak formally and precisely. Some speak in Seoul dialect with casual speech endings.

Return ONLY a JSON object: {"<id>": "<polished line>", ...}
No explanations, no markdown fences, just the JSON.
"""

POLISH_BATCH_SIZE = 40  # lines per Claude call


def has_korean(text: str) -> bool:
    return bool(KOREAN_RE.search(text))


def hanbun_render(line: str, freq_lists, vocab_lists, config: RenderConfig) -> str:
    """Run hanbun analysis and produce a draft mixed line."""
    if not has_korean(line) or STAGE_RE.match(line.strip()):
        return line
    result = analyze(line, vocab_lists=vocab_lists, freq_lists=freq_lists)
    spans = render_mixed(result, config)
    parts = []
    for s in spans:
        if s.status == "substituted" and s.gloss:
            parts.append(s.gloss)
        else:
            parts.append(s.original)
    return "".join(parts)


def polish_batch(items: list[dict], model: str) -> dict[str, str]:
    """
    Send a batch of {id, original, draft} to Claude for polishing.
    Returns {id: polished_line}.
    """
    prompt = (
        "Polish each subtitle line. For each entry: 'original' is the raw Korean, "
        "'draft' is the hanbun first-pass with some words already glossed.\n\n"
        + json.dumps(items, ensure_ascii=False, indent=2)
    )

    client = anthropic.Anthropic()
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        system=POLISH_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    json_match = re.search(r"\{[\s\S]*\}", raw)
    if not json_match:
        print("WARNING: could not parse polish response, keeping drafts", file=sys.stderr)
        return {}
    try:
        return json.loads(json_match.group())
    except json.JSONDecodeError as e:
        print(f"WARNING: JSON decode error in polish response: {e}", file=sys.stderr)
        return {}


def process_srt(srt_text: str, freq_lists, vocab_lists, config: RenderConfig, model: str):
    blocks = list(SRT_BLOCK.finditer(srt_text))
    if not blocks:
        print("WARNING: no SRT blocks found — check file format", file=sys.stderr)
        return srt_text, 0, 0

    # Pass 1: hanbun render every line; collect changed lines for polishing
    block_data = []
    to_polish: list[dict] = []
    line_id = 0

    for m in blocks:
        idx, timecode, text = m.group(1), m.group(2), m.group(3).strip()
        lines = text.split("\n")
        rendered = []
        ids = []
        for line in lines:
            draft = hanbun_render(line, freq_lists, vocab_lists, config)
            rendered.append(draft)
            if draft != line:
                to_polish.append({"id": str(line_id), "original": line, "draft": draft})
                ids.append(str(line_id))
            else:
                ids.append(None)
            line_id += 1
        block_data.append({
            "idx": idx, "timecode": timecode,
            "rendered": rendered, "ids": ids,
        })

    total_lines = line_id
    print(f"[pass 1] hanbun rendered {total_lines} lines, {len(to_polish)} sent to Claude", file=sys.stderr)

    # Pass 2: batch-polish changed lines with Claude
    polished: dict[str, str] = {}
    if to_polish:
        batches = [to_polish[i:i + POLISH_BATCH_SIZE] for i in range(0, len(to_polish), POLISH_BATCH_SIZE)]
        print(f"[pass 2] polishing in {len(batches)} batch(es) via {model}...", file=sys.stderr)
        for i, batch in enumerate(batches):
            result = polish_batch(batch, model)
            polished.update(result)
            print(f"[pass 2] batch {i+1}/{len(batches)}: {len(result)}/{len(batch)} polished", file=sys.stderr)

    # Pass 3: apply polished results and assemble SRT
    out_blocks = []
    substituted_blocks = 0

    for bd in block_data:
        final_lines = []
        block_changed = False
        for rendered_line, lid in zip(bd["rendered"], bd["ids"]):
            if lid is not None:
                block_changed = True
                final_lines.append(polished.get(lid, rendered_line))
            else:
                final_lines.append(rendered_line)
        if block_changed:
            substituted_blocks += 1
        out_blocks.append(f"{bd['idx']}\n{bd['timecode']}\n" + "\n".join(final_lines))

    return "\n\n".join(out_blocks) + "\n", total_lines, substituted_blocks


def main():
    parser = argparse.ArgumentParser(description="AI-enhanced Korean learning subtitle generator")
    parser.add_argument("srt", help="Input .srt file")
    parser.add_argument("--threshold", type=int, default=500,
                        help="Freq rank threshold — words above this rank get glossed (default: 500)")
    parser.add_argument("--freq", default=str(DEFAULT_FREQ), help="Frequency CSV list")
    parser.add_argument("--vocab", default=None, help="Optional vocabulary YAML list")
    parser.add_argument("--out", help="Output .srt file (default: <input>.learning.srt)")
    parser.add_argument("--stats", action="store_true", help="Print processing stats")
    parser.add_argument("--preview", type=int, default=0,
                        help="Preview first N subtitle blocks instead of full output")
    parser.add_argument("--model", default="claude-haiku-4-5-20251001",
                        help="Claude model for polishing (default: claude-haiku-4-5-20251001)")
    args = parser.parse_args()

    freq_lists = [load_freq_csv(args.freq)]
    vocab_lists = [load_vocab_yaml(args.vocab)] if args.vocab else []
    config = RenderConfig(threshold_rank=args.threshold)

    srt_text = Path(args.srt).read_text(encoding="utf-8")

    if args.preview:
        blocks = list(SRT_BLOCK.finditer(srt_text))[:args.preview]
        srt_text = "\n\n".join(m.group(0) for m in blocks)

    output, total, changed = process_srt(srt_text, freq_lists, vocab_lists, config, args.model)

    if args.stats or args.preview:
        scope = f"first {args.preview} blocks" if args.preview else "full file"
        print(
            f"[{scope}] threshold={args.threshold} | lines: {total} | blocks changed: {changed}",
            file=sys.stderr,
        )

    out_path = args.out or str(Path(args.srt).with_suffix("")) + ".learning.srt"
    Path(out_path).write_text(output, encoding="utf-8")
    print(f"Written to {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
