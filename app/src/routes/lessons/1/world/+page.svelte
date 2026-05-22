<script lang="ts">
	let { data } = $props();
</script>

<h1>Lesson 1 — World</h1>

<table>
	<thead>
		<tr>
			<th>id</th>
			<th>name</th>
			<th>nationality</th>
			<th>year</th>
			<th>source</th>
		</tr>
	</thead>
	<tbody>
		{#each data.rows as r}
			<tr>
				<td>{r.id}</td>
				<td>{r.attrs.name ?? ''}</td>
				<td>{r.attrs.nationality ?? ''}</td>
				<td>{r.attrs.year ?? ''}</td>
				<td><small>{r.source}</small></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
	}
	th,
	td {
		padding: 0.25rem 0.75rem;
		border: 1px solid #ccc;
		text-align: left;
	}
</style>
