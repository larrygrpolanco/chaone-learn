<script lang="ts">
	let { data } = $props();
</script>

<div class="roster">
	<header>
		<h1>Roster</h1>
		<p class="meta">
			<a href="/lessons/1/practice">← Back to practice</a>
		</p>
	</header>

	{#if data.rows.length === 0}
		<p>The class is empty.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>이름</th>
					<th>나라</th>
					<th>학년</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row}
					<tr>
						<td>{row.attrs.name ?? '—'}</td>
						<td>{row.attrs.nationality ?? '—'}</td>
						<td>{row.attrs.year ?? '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.roster {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 1rem;
	}
	h1 {
		margin: 0 0 0.25rem;
	}
	.meta {
		font-size: 0.85rem;
		color: #666;
		margin-top: 0;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}
	th,
	td {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #eee;
	}
	th {
		font-size: 0.85rem;
		color: #666;
		font-weight: normal;
	}
</style>
