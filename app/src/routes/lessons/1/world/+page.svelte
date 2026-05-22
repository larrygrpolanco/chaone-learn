<script lang="ts">
	import { enhance } from '$app/forms';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let { data } = $props();

	type Editing = { id: string; field: 'name' | 'nationality' | 'year'; value: string } | null;
	let editing = $state<Editing>(null);
	let confirming = $state(false);

	function startEdit(id: string, field: 'name' | 'nationality' | 'year', current: string) {
		editing = { id, field, value: current };
		confirming = false;
	}

	function cancel() {
		editing = null;
		confirming = false;
	}

	function restatement(row: { attrs: Record<string, string> }, e: NonNullable<Editing>): string {
		const merged = { ...row.attrs, [e.field]: e.value };
		return lesson1Manifest.fields[e.field].restate(e.value, merged);
	}
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
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.rows as r (r.id)}
			<tr>
				<td><code>{r.id}</code></td>
				{#each ['name', 'nationality', 'year'] as const as field}
					<td>
						<button class="cell" onclick={() => startEdit(r.id, field, r.attrs[field] ?? '')}>
							{r.attrs[field] ?? '—'}
						</button>
					</td>
				{/each}
				<td><small>{r.source}</small></td>
				<td>
					{#if r.source === 'learner'}
						<form
							method="POST"
							action="?/delete"
							use:enhance
							onsubmit={(e) => {
								if (!confirm(`${r.attrs.name ?? r.id}을 지울까요?`)) e.preventDefault();
							}}
						>
							<input type="hidden" name="entityId" value={r.id} />
							<button type="submit" class="del">삭제</button>
						</form>
					{:else}
						<button class="del" disabled title="Textbook characters cannot be deleted">삭제</button>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if editing}
	{@const row = data.rows.find((r) => r.id === editing!.id)!}
	<div class="modal-backdrop" onclick={cancel} role="presentation"></div>
	<div class="modal">
		<h2>Edit {editing.field}</h2>

		{#if !confirming}
			{#if editing.field === 'name'}
				<input bind:value={editing.value} />
			{:else if editing.field === 'nationality'}
				<select bind:value={editing.value}>
					{#each data.nationalities as n}
						<option value={n}>{n}</option>
					{/each}
				</select>
			{:else}
				<select bind:value={editing.value}>
					{#each data.years as y}
						<option value={y}>{y}</option>
					{/each}
				</select>
			{/if}

			<div class="actions">
				<button onclick={() => (confirming = true)} disabled={!editing.value.trim()}>다음</button>
				<button onclick={cancel}>취소</button>
			</div>
		{:else}
			<p class="restatement">{restatement(row, editing)}</p>
			<form
				method="POST"
				action="?/edit"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') cancel();
					};
				}}
			>
				<input type="hidden" name="entityId" value={editing.id} />
				<input type="hidden" name="field" value={editing.field} />
				<input type="hidden" name="value" value={editing.value} />
				<div class="actions">
					<button type="submit">맞아요</button>
					<button type="button" onclick={() => (confirming = false)}>고쳐요</button>
				</div>
			</form>
		{/if}
	</div>
{/if}

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
	.cell {
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		font: inherit;
		color: inherit;
		cursor: pointer;
		border-radius: 3px;
	}
	.cell:hover {
		background: #eef3ff;
	}
	.del {
		font-size: 0.85rem;
		padding: 0.15rem 0.5rem;
		border: 1px solid #c66;
		background: white;
		color: #c66;
		border-radius: 3px;
		cursor: pointer;
	}
	.del:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		border-color: #ccc;
		color: #ccc;
	}
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
	}
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 1.5rem;
		border-radius: 6px;
		min-width: 20rem;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
	}
	.modal h2 {
		margin-top: 0;
		font-size: 1rem;
		text-transform: capitalize;
	}
	.modal input,
	.modal select {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
		margin-bottom: 1rem;
	}
	.restatement {
		font-size: 1.15rem;
		padding: 0.75rem;
		background: #f4f8ff;
		border-radius: 4px;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.actions button {
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		border: 1px solid #888;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
