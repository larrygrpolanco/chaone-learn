<script lang="ts">
	import { enhance } from '$app/forms';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let name = $state('');
	let phase = $state<'asking' | 'confirming'>('asking');

	const restatement = $derived(
		name ? lesson1Manifest.fields.name.restate(name, { name }) : ''
	);
</script>

<div class="move" data-writes="true">
	<header>
		<h1>새 친구</h1>
	</header>

	{#if phase === 'asking'}
		<p class="prompt">이름이 뭐예요?</p>
		<input
			value={name}
			oninput={(e) => (name = (e.target as HTMLInputElement).value)}
			placeholder="이름"
		/>
		<button disabled={!name.trim()} onclick={() => (phase = 'confirming')}>Next</button>
	{:else}
		<p class="restatement">{restatement}</p>
		<p class="story-note">This will change the story.</p>
		<form method="POST" action="?/commit" use:enhance>
			<input type="hidden" name="name" value={name} />
			<button class="confirm" type="submit">Confirm</button>
			<button type="button" onclick={() => (phase = 'asking')}>Go back</button>
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
	input {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
		margin: 0.5rem 0;
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
