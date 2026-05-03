from hanbun import analyze, load_vocab_yaml, load_freq_csv

# Load  lists
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
