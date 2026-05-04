from hanbun import analyze, load_vocab_yaml, load_freq_csv
from hanbun.render import RenderConfig, render_mixed

# Load lists
vl = load_vocab_yaml("examples/lists/beginning-1-vocab.yaml")
fl = load_freq_csv("examples/lists/1-5000_freq.csv")

story = """
옛날에 큰 호랑이 한 마리가 숲 속에 살았다.
어느 날 호랑이는 배가 고파서 마을로 갔다.
마을 옆 밭에 소 한 마리가 서 있었다.
호랑이는 소를 잡아 먹고 싶은데 갑자기 시끄러운 아기 울음소리를 들었다.
밭 옆에 있는 집에서 아기가 울고 있었다.
호랑이는 집으로 다가갔다.
아기가 맛있을 것 같아.
호랑이는 생각했다.
"""

result = analyze(story, vocab_lists=[vl], freq_lists=[fl])

print(result.summary)
print()

print("=== UNKNOWNS (not in any list) ===")
for u in result.unknowns:
    print(f"  {u['lemma']} ({u['pos']})  — appears {u['count']}x")
print()

# --- Renderer ---

print("=== RENDERED (threshold 500: words above rank 500 → English) ===")
config = RenderConfig(threshold_rank=500)
spans = render_mixed(result, config)
rendered = "".join(s.gloss if s.status == "substituted" else s.original for s in spans)
print(rendered)
print()

print("=== RENDERED (threshold 1000: stricter, more Korean shown) ===")
config_1000 = RenderConfig(threshold_rank=1000)
spans_1000 = render_mixed(result, config_1000)
rendered_1000 = "".join(s.gloss if s.status == "substituted" else s.original for s in spans_1000)
print(rendered_1000)
print()

print("=== SPAN BREAKDOWN (first sentence, threshold 500) ===")
first_sentence_spans = [s for s in spans if "\n" not in s.original][:20]
for s in first_sentence_spans:
    label = f"[{s.status}]"
    display = s.gloss if s.status == "substituted" else repr(s.original)
    print(f"  {label:<16} {display}")
