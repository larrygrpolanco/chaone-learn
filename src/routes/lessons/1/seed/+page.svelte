<script lang="ts">
	import { enhance } from '$app/forms';
	import ClassRoster from '$lib/components/ClassRoster.svelte';

	let { data, form } = $props();
</script>

<main>
	<h1>Lesson 1 — Seed Phase</h1>

	<p class="step-indicator">Step {data.step} of {data.totalSteps}</p>

	<div class="teacher-message">
		<p>🍎 {data.teacherMessage}</p>
	</div>

	<form method="POST" use:enhance>
		<input type="hidden" name="step" value={data.step} />

		<div class="field">
			<label for="value">{data.fieldLabel}</label>

			{#if data.fieldType === 'text'}
				<input id="value" name="value" type="text" required placeholder="Type here…" />
			{:else}
				<select id="value" name="value" required>
					<option value="">— select —</option>
					{#each data.fieldOptions as opt}
						<option value={opt}>{opt}</option>
					{/each}
				</select>
			{/if}
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<button type="submit">Continue →</button>
	</form>

	<aside>
		<h2>Class Roster</h2>
		<ClassRoster characters={data.characters} />
	</aside>
</main>

<style>
	main {
		max-width: 600px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: sans-serif;
	}
	.step-indicator {
		color: #888;
		font-size: 0.85rem;
		margin-bottom: 0.5rem;
	}
	.teacher-message {
		background: #f0f4ff;
		border-left: 4px solid #4a6cf7;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		border-radius: 0 4px 4px 0;
	}
	.field {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	label {
		font-weight: 600;
		font-size: 0.9rem;
	}
	input,
	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
	button {
		margin-top: 0.5rem;
		padding: 0.6rem 1.2rem;
		background: #4a6cf7;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}
	.error {
		color: #c0392b;
		font-size: 0.9rem;
	}
	aside {
		margin-top: 2rem;
		border-top: 1px solid #eee;
		padding-top: 1rem;
	}
</style>
