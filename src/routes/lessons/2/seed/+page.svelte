<script lang="ts">
	import FamilyTree from '$lib/components/FamilyTree.svelte';

	let { data } = $props();
</script>

<main>
	<h1>Lesson 2 — Seed Phase</h1>

	<div class="teacher-message">
		<p>🍎 {data.teacherIntro}</p>
	</div>

	{#if data.characters.length > 0}
		<section class="carry-over">
			<h2>Your Class from Lesson 1</h2>
			<p class="carry-over-note">
				These classmates carry over automatically — no action needed.
			</p>
			<ul class="roster">
				{#each data.characters as character}
					<li class:learner={character.is_learner}>
						<strong>{character.name}</strong>
						{#if character.is_learner}<span class="tag">you</span>{/if}
						{#if character.nationality}
							<span class="detail">{character.nationality}</span>
						{/if}
						{#if character.year}
							<span class="detail">{character.year}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.firstClassmate && data.expansionMessage}
		<section class="expansion-question">
			<h2>Expansion: Family Connections</h2>
			<div class="teacher-message secondary">
				<p>🍎 {data.expansionMessage}</p>
			</div>
			<p class="coming-soon">
				Family expansion exercises are coming in the full Lesson 2 build.
				This stub confirms your Lesson 1 world carries over correctly.
			</p>
		</section>
	{/if}

	<section class="family-tree-section">
		<h2>Family Tree</h2>
		<FamilyTree characters={data.characters} />
	</section>
</main>

<style>
	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: sans-serif;
	}
	.teacher-message {
		background: #f0f4ff;
		border-left: 4px solid #4a6cf7;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		border-radius: 0 4px 4px 0;
	}
	.teacher-message.secondary {
		background: #f5fff8;
		border-left-color: #27ae60;
	}
	h2 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}
	section {
		margin-bottom: 2rem;
	}
	.carry-over-note {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 0.75rem;
	}
	.roster {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.roster li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.75rem;
		background: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}
	.roster li.learner {
		background: #eef2ff;
		border-color: #c3cdf7;
	}
	.tag {
		font-size: 0.75rem;
		background: #4a6cf7;
		color: white;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
	}
	.detail {
		font-size: 0.85rem;
		color: #666;
		background: #f0f0f0;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
	}
	.coming-soon {
		font-size: 0.9rem;
		color: #888;
		font-style: italic;
		background: #fafafa;
		border: 1px dashed #ccc;
		border-radius: 4px;
		padding: 0.75rem 1rem;
	}
	.family-tree-section {
		margin-top: 2rem;
		border-top: 1px solid #eee;
		padding-top: 1rem;
	}
</style>
