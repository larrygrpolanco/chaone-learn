<script lang="ts">
	let { data } = $props();
</script>

<div class="stub">
	<h1>Lesson 2 (stub)</h1>
	<p class="note">Reads from lesson 1's world. No moves yet.</p>

	{#if data.rows.length === 0}
		<p>아직 학생이 없어요.</p>
	{:else}
		<p>여기는 1과의 학생들이에요:</p>
		<ul>
			{#each data.rows as row}
				<li>
					<strong>{row.name}</strong> — {row.nationality || '?'}, {row.year || '?'}
				</li>
			{/each}
		</ul>
	{/if}

	<p class="meta"><a href="/lessons/1">← Lesson 1</a></p>
</div>

<style>
	.stub {
		max-width: 30rem;
		margin: 3rem auto;
		padding: 1rem;
		font-family: system-ui, sans-serif;
	}
	h1 {
		margin: 0 0 0.5rem;
	}
	.note {
		font-size: 0.85rem;
		color: #888;
		font-style: italic;
	}
	ul {
		padding-left: 1.25rem;
	}
	li {
		margin: 0.4rem 0;
	}
	.meta {
		margin-top: 2rem;
		font-size: 0.85rem;
	}
</style>
