<script lang="ts">
	import { enhance } from '$app/forms';
	import ClassRoster from '$lib/components/ClassRoster.svelte';
	import { LESSON1_NATIONALITIES } from '$lib/content/lessons/lesson1/scope';

	let { data, form } = $props();
</script>

<main>
	<h1>Lesson 1 — Building Phase</h1>

	<div class="teacher-message">
		<p>🍎 {data.teacherMessage}</p>
	</div>

	<form method="POST" action="?/addClassmate" use:enhance>
		<div class="field">
			<label for="name">이름 (Name)</label>
			<input id="name" name="name" type="text" required placeholder="Classmate's name" />
		</div>

		<div class="field">
			<label for="nationality">국적 (Nationality)</label>
			<select id="nationality" name="nationality" required>
				<option value="">— select —</option>
				{#each LESSON1_NATIONALITIES as nat}
					<option value={nat}>{nat}</option>
				{/each}
			</select>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<button type="submit">Add classmate</button>
	</form>

	<form method="POST" action="?/proceed">
		<button type="submit" class="proceed">
			Done adding classmates — go to Synthesis →
		</button>
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
	.proceed {
		background: #27ae60;
		display: block;
		margin-top: 1rem;
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
