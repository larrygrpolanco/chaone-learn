<script lang="ts">
	import { enhance } from '$app/forms';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let { data } = $props();

	type Phase = 'asking' | 'choosing' | 'done';
	let phase = $state<Phase>('asking');
	let chosenValue = $state('');
	let didWrite = $state(false);

	const successKr = $derived(
		chosenValue
			? lesson1Manifest.fields[data.field].restate(chosenValue, { name: data.name })
			: ''
	);

	function confirmNoWrite() {
		chosenValue = data.currentValue;
		didWrite = false;
		phase = 'done';
	}

	function onCommitted(value: string) {
		chosenValue = value;
		didWrite = true;
		phase = 'done';
	}

	const writes = $derived(phase !== 'done' || didWrite);
</script>

<div class="move" data-writes={writes}>
	<header>
		<h1>{data.name}</h1>
	</header>

	<p class="prompt">{data.prompt}</p>

	{#if phase === 'asking'}
		<p class="story-note">아니요 will change the story.</p>
		<div class="choices">
			<button class="yes" onclick={confirmNoWrite}>네</button>
			<button class="no" onclick={() => (phase = 'choosing')}>아니요</button>
		</div>
	{:else if phase === 'choosing'}
		<p class="story-note">This will change the story.</p>
		<p class="sub">그럼 어느 나라 사람이에요?</p>
		<div class="choices">
			{#each data.options as opt}
				<form
					method="POST"
					action="?/commit"
					use:enhance={() => async ({ result, update }) => {
						await update();
						if (result.type === 'success') onCommitted(opt);
					}}
				>
					<input type="hidden" name="entityId" value={data.entityId} />
					<input type="hidden" name="field" value={data.field} />
					<input type="hidden" name="value" value={opt} />
					<button type="submit">{opt}</button>
				</form>
			{/each}
		</div>
	{:else}
		<p class="ok">맞아요! {successKr}</p>
		<a class="next" href="/lessons/1/practice">Done</a>
	{/if}

	<p class="meta">
		<a href="/lessons/1/roster">Roster</a> · <a href="/lessons/1/practice">Back</a>
	</p>
</div>

<style>
	.move {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-radius: 6px;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.move[data-writes='true'] {
		border-left: 6px solid #5a8dee;
		background: #f4f8ff;
	}
	.move[data-writes='false'] {
		border-left: 6px solid #ee8b5a;
		background: #fff7f0;
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
	.story-note {
		font-size: 0.85rem;
		color: #5a8dee;
		margin: 0.75rem 0;
		font-style: italic;
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
	.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.next {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.5rem 1rem;
		background: #5a8dee;
		color: white;
		border-radius: 4px;
		text-decoration: none;
	}
	.move[data-writes='false'] .next {
		background: #ee8b5a;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
