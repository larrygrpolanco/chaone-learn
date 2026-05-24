<script lang="ts">
	import { enhance } from '$app/forms';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let { data } = $props();

	let phase = $state<'choosing' | 'confirming'>('choosing');
	let chosen = $state('');

	const restatement = $derived(
		chosen ? lesson1Manifest.fields[data.field].restate(chosen, { name: data.name }) : ''
	);
</script>

<div class="move" data-writes="true">
	<header>
		<h1>{data.name}</h1>
	</header>

	{#if phase === 'choosing'}
		<p class="prompt">{data.prompt}</p>
		<div class="choices">
			{#each data.options as opt}
				<button
					onclick={() => {
						chosen = opt;
						phase = 'confirming';
					}}
				>
					{opt}
				</button>
			{/each}
		</div>
	{:else}
		<p class="restatement">{restatement}</p>
		<p class="story-note">This will change the story.</p>
		<form method="POST" action="?/commit" use:enhance>
			<input type="hidden" name="entityId" value={data.entityId} />
			<input type="hidden" name="field" value={data.field} />
			<input type="hidden" name="value" value={chosen} />
			<button class="confirm" type="submit">Confirm</button>
			<button type="button" onclick={() => (phase = 'choosing')}>Go back</button>
		</form>
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
	}
	.move[data-writes='true'] {
		border-left: 6px solid #5a8dee;
		background: #f4f8ff;
	}
	h1 {
		margin: 0.5rem 0 1rem;
		font-size: 1.25rem;
	}
	.prompt,
	.restatement {
		font-size: 1.2rem;
		padding: 0.75rem;
		background: white;
		border-radius: 4px;
	}
	.story-note {
		font-size: 0.85rem;
		color: #5a8dee;
		margin: 0.75rem 0;
		font-style: italic;
	}
	button.confirm {
		background: #5a8dee;
		color: white;
		border-color: #5a8dee;
		font-weight: bold;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
