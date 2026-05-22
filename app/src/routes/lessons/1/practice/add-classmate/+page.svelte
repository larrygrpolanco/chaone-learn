<script lang="ts">
	import { enhance } from '$app/forms';
	import { topicMarker } from '$lib/korean';
	import { fieldOptions } from '$lib/content/lessons/lesson_1/manifest';
	import { addClassmate } from '$lib/content/lessons/lesson_1/moves/add_classmate';

	const steps = addClassmate.steps;
	let stepIdx = $state(0);
	let facts = $state<Record<string, string>>({});

	const done = $derived(stepIdx >= steps.length);
	const current = $derived(done ? null : steps[stepIdx]);
	const name = $derived(facts.name ?? '');
	const topic = $derived(name ? `${name}${topicMarker(name)}` : '');
	const confirmationLines = $derived(done ? addClassmate.confirmation(facts) : []);

	function setFact(field: string, value: string) {
		facts = { ...facts, [field]: value };
		stepIdx += 1;
	}

	function restart() {
		facts = {};
		stepIdx = 0;
	}
</script>

<div class="author">
	<header>
		<span class="badge">Author</span>
		<h1>새 친구가 왔어요</h1>
	</header>

	{#if current}
		<p>
			{#if current.field !== 'name' && topic}<span>{topic} </span>{/if}{current.promptKr}
		</p>

		{#if current.kind === 'free-text'}
			<input
				value={facts[current.field] ?? ''}
				oninput={(e) =>
					(facts = { ...facts, [current!.field]: (e.target as HTMLInputElement).value })}
				placeholder="이름"
			/>
			<button
				disabled={!(facts[current.field] ?? '').trim()}
				onclick={() => (stepIdx += 1)}
			>
				다음
			</button>
		{:else}
			<div class="choices">
				{#each fieldOptions(current.field) as opt}
					<button
						class:selected={facts[current.field] === opt}
						onclick={() => setFact(current!.field, opt)}>{opt}</button
					>
				{/each}
			</div>
		{/if}
	{:else}
		<p class="restatement">
			{#each confirmationLines as line, i}
				{line}{#if i < confirmationLines.length - 1}<br />{/if}
			{/each}
		</p>
		<form method="POST" action="?/commit" use:enhance>
			{#each steps as step}
				<input type="hidden" name={step.field} value={facts[step.field] ?? ''} />
			{/each}
			<button type="submit">맞아요 (Confirm)</button>
			<button type="button" onclick={restart}>고쳐요 (Edit)</button>
		</form>
	{/if}

	<p class="meta">
		<a href="/lessons/1/world">← 월드 보기</a>
	</p>
</div>

<style>
	.author {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-left: 6px solid #5a8dee;
		background: #f4f8ff;
		border-radius: 6px;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		background: #5a8dee;
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
	p {
		font-size: 1.1rem;
	}
	.restatement {
		font-size: 1.2rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button.selected {
		background: #5a8dee;
		color: white;
	}
	input:not([type]) {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
		margin-bottom: 0.5rem;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
