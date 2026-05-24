<script lang="ts">
	import type { CharacterView } from '$lib/types';

	let { characters }: { characters: CharacterView[] } = $props();
</script>

<div class="roster">
	{#if characters.length === 0}
		<p class="empty">The roster is empty. Add yourself to get started!</p>
	{:else}
		{#each characters as character}
			<div class="character" class:learner={character.is_learner}>
				<span class="name">{character.name}</span>
				{#if character.is_learner}
					<span class="badge">You</span>
				{/if}
				{#if character.nationality}
					<span class="nationality">{character.nationality}</span>
				{/if}
				{#if character.year}
					<span class="year">{character.year}</span>
				{/if}
			</div>
		{/each}
	{/if}
</div>

<style>
	.roster {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.empty {
		color: #888;
		font-style: italic;
		font-size: 0.9rem;
	}
	.character {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}
	.character.learner {
		background: #eef2ff;
		border-color: #4a6cf7;
	}
	.name {
		font-weight: 600;
		flex: 1;
	}
	.badge {
		font-size: 0.7rem;
		background: #4a6cf7;
		color: white;
		padding: 0.15rem 0.4rem;
		border-radius: 999px;
	}
	.nationality {
		color: #555;
		font-size: 0.9rem;
	}
	.year {
		color: #888;
		font-size: 0.85rem;
	}
</style>
