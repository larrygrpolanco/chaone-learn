<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { fieldOptions, lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';
	import { andMarker, topicMarker } from '$lib/korean';
	import { shuffle } from '$lib/content/lessons/lesson_1/moves/_helpers';

	let { data } = $props();
	const q = $derived(data.q);

	let recallPhase = $state<'asking' | 'choosing' | 'done'>('asking');
	let recallWrong = $state<Set<string>>(new Set());

	let onePhase = $state<'asking' | 'choosing' | 'done'>('asking');
	let oneCommitted = $state('');

	let bothPhase = $state<'stage1' | 'stage2_asking' | 'stage2_choosing' | 'done'>('stage1');
	let xCommitted = $state('');
	let yCommitted = $state('');
	let yOptions = $state<string[]>([]);

	function enhanceCommit(handler: (value: string) => void) {
		return ({ formData }: { formData: FormData }) => {
			const value = String(formData.get('value') ?? '');
			return async ({ result, update }: { result: { type: string }; update: () => Promise<void> }) => {
				await update();
				if (result.type === 'success') handler(value);
			};
		};
	}

	function recallPick(opt: string) {
		if (q.branch !== 'recall_matching') return;
		if (recallPhase !== 'choosing' || recallWrong.has(opt)) return;
		if (opt === q.value) recallPhase = 'done';
		else recallWrong = new Set([...recallWrong, opt]);
	}

	function openStage2Choosing() {
		if (q.branch !== 'author_both_missing') return;
		yOptions = shuffle(fieldOptions(q.field).filter((v) => v !== xCommitted)).slice(0, 4);
		bothPhase = 'stage2_choosing';
	}

	async function next() {
		recallPhase = 'asking';
		recallWrong = new Set();
		onePhase = 'asking';
		oneCommitted = '';
		bothPhase = 'stage1';
		xCommitted = '';
		yCommitted = '';
		yOptions = [];
		await invalidateAll();
	}
</script>

<div class="shared">
	<header>
		<span class="badge">Shared</span>
		{#if q.branch === 'author_one_missing'}
			<h1>{q.known.name} &amp; {q.missing.name}</h1>
		{:else}
			<h1>{q.x.name} &amp; {q.y.name}</h1>
		{/if}
	</header>

	{#if q.branch === 'recall_matching'}
		<p class="prompt">{q.promptKr}</p>
		{#if recallPhase === 'asking'}
			<div class="choices">
				<button class="yes" onclick={() => (recallPhase = 'done')}>네</button>
				<button class="no" onclick={() => (recallPhase = 'choosing')}>아니요</button>
			</div>
		{:else if recallPhase === 'choosing'}
			<p class="sub">
				{q.x.name}{andMarker(q.x.name)} {q.y.name}{topicMarker(q.y.name)} 어느 나라 사람이에요?
			</p>
			<div class="choices">
				{#each q.options as opt}
					<button
						class:wrong={recallWrong.has(opt)}
						disabled={recallWrong.has(opt)}
						onclick={() => recallPick(opt)}
					>
						{opt}
					</button>
				{/each}
			</div>
		{:else}
			<p class="ok">맞아요! {q.successKr}</p>
			<button class="nextbtn" onclick={next}>다음</button>
		{/if}
	{:else if q.branch === 'author_one_missing'}
		<p class="prompt">{q.promptKr}</p>
		{#if onePhase === 'asking'}
			<div class="choices">
				<form
					method="POST"
					action="?/commit"
					use:enhance={enhanceCommit((v) => {
						oneCommitted = v;
						onePhase = 'done';
					})}
				>
					<input type="hidden" name="entityId" value={q.missing.id} />
					<input type="hidden" name="field" value={q.field} />
					<input type="hidden" name="value" value={q.proposal} />
					<button class="yes" type="submit">네</button>
				</form>
				<button class="no" onclick={() => (onePhase = 'choosing')}>아니요</button>
			</div>
		{:else if onePhase === 'choosing'}
			<p class="sub">
				그럼 {q.missing.name}{topicMarker(q.missing.name)} 어느 나라 사람이에요?
			</p>
			<div class="choices">
				{#each q.options as opt}
					<form
						method="POST"
						action="?/commit"
						use:enhance={enhanceCommit((v) => {
							oneCommitted = v;
							onePhase = 'done';
						})}
					>
						<input type="hidden" name="entityId" value={q.missing.id} />
						<input type="hidden" name="field" value={q.field} />
						<input type="hidden" name="value" value={opt} />
						<button type="submit">{opt}</button>
					</form>
				{/each}
			</div>
		{:else}
			<p class="ok">
				맞아요! {lesson1Manifest.fields[q.field].restate(oneCommitted, { name: q.missing.name })}
			</p>
			<button class="nextbtn" onclick={next}>다음</button>
		{/if}
	{:else}
		{#if bothPhase === 'stage1'}
			<p class="prompt">{q.stage1PromptKr}</p>
			<div class="choices">
				{#each q.options as opt}
					<form
						method="POST"
						action="?/commit"
						use:enhance={enhanceCommit((v) => {
							xCommitted = v;
							bothPhase = 'stage2_asking';
						})}
					>
						<input type="hidden" name="entityId" value={q.x.id} />
						<input type="hidden" name="field" value={q.field} />
						<input type="hidden" name="value" value={opt} />
						<button type="submit">{opt}</button>
					</form>
				{/each}
			</div>
		{:else if bothPhase === 'stage2_asking'}
			<p class="ok">
				{lesson1Manifest.fields[q.field].restate(xCommitted, { name: q.x.name })}
			</p>
			<p class="prompt">{q.y.name}도 {xCommitted} 사람이에요?</p>
			<div class="choices">
				<form
					method="POST"
					action="?/commit"
					use:enhance={enhanceCommit((v) => {
						yCommitted = v;
						bothPhase = 'done';
					})}
				>
					<input type="hidden" name="entityId" value={q.y.id} />
					<input type="hidden" name="field" value={q.field} />
					<input type="hidden" name="value" value={xCommitted} />
					<button class="yes" type="submit">네</button>
				</form>
				<button class="no" onclick={openStage2Choosing}>아니요</button>
			</div>
		{:else if bothPhase === 'stage2_choosing'}
			<p class="ok">
				{lesson1Manifest.fields[q.field].restate(xCommitted, { name: q.x.name })}
			</p>
			<p class="sub">
				그럼 {q.y.name}{topicMarker(q.y.name)} 어느 나라 사람이에요?
			</p>
			<div class="choices">
				{#each yOptions as opt}
					<form
						method="POST"
						action="?/commit"
						use:enhance={enhanceCommit((v) => {
							yCommitted = v;
							bothPhase = 'done';
						})}
					>
						<input type="hidden" name="entityId" value={q.y.id} />
						<input type="hidden" name="field" value={q.field} />
						<input type="hidden" name="value" value={opt} />
						<button type="submit">{opt}</button>
					</form>
				{/each}
			</div>
		{:else}
			<p class="ok">
				{lesson1Manifest.fields[q.field].restate(xCommitted, { name: q.x.name })}<br />
				{lesson1Manifest.fields[q.field].restate(yCommitted, { name: q.y.name })}
			</p>
			<button class="nextbtn" onclick={next}>다음</button>
		{/if}
	{/if}

	<p class="meta">
		<a href="/lessons/1/world">← 월드 보기</a>
	</p>
</div>

<style>
	.shared {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-left: 6px solid #b06acd;
		background: #faf3fc;
		border-radius: 6px;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		background: #b06acd;
		color: white;
		border-radius: 999px;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	h1 {
		margin: 0.5rem 0 1rem;
		font-size: 1.25rem;
	}
	.prompt {
		font-size: 1.2rem;
		padding: 0.75rem;
		background: white;
		border-radius: 4px;
	}
	.sub {
		font-size: 1.05rem;
		margin-top: 1rem;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.choices :global(form) {
		display: inline;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	button:disabled {
		cursor: default;
	}
	button.yes {
		border-color: #6aa86a;
		color: #2e7d32;
		font-weight: bold;
	}
	button.no {
		border-color: #c66;
		color: #c66;
	}
	button.wrong {
		opacity: 0.4;
		color: #999;
		background: #eee;
		animation: shake 0.3s;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-6px);
		}
		75% {
			transform: translateX(6px);
		}
	}
	.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.nextbtn {
		margin-top: 0.5rem;
		background: #b06acd;
		color: white;
		border-color: #b06acd;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
