<script lang="ts">
	import type { CharacterView } from '$lib/types';

	let { characters }: { characters: CharacterView[] } = $props();

	const classmates = characters.filter((c) => !c.is_learner);
</script>

<div class="family-tree">
	<p class="stub-notice">🌳 Family Tree — coming in Lesson 2</p>
	{#if classmates.length === 0}
		<p class="empty">No classmates in the roster yet.</p>
	{:else}
		<ul class="character-list">
			{#each classmates as character}
				<li class="character-node">
					<span class="name">{character.name}</span>
					{#if character.nationality}
						<span class="detail">{character.nationality}</span>
					{/if}
					{#if character.year}
						<span class="detail">{character.year}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.family-tree {
		border: 1px dashed #ccc;
		border-radius: 6px;
		padding: 1rem;
		background: #fafafa;
	}
	.stub-notice {
		font-size: 0.85rem;
		color: #888;
		margin: 0 0 0.75rem 0;
		font-style: italic;
	}
	.empty {
		color: #aaa;
		font-size: 0.9rem;
	}
	.character-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.character-node {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.75rem;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}
	.name {
		font-weight: 600;
	}
	.detail {
		font-size: 0.85rem;
		color: #666;
		background: #f0f0f0;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
	}
</style>
