<script lang="ts">
	import { enhance } from '$app/forms';
	import ClassRoster from '$lib/components/ClassRoster.svelte';

	let { data, form } = $props();
</script>

<main>
	<h1>Lesson 1 — Synthesis Phase</h1>

	<div class="teacher-message">
		<p>🍎 {data.teacherMessage}</p>
	</div>

	<div class="question-card">
		<p class="question">{data.question}</p>
	</div>

	<form method="POST" action="?/answer" use:enhance>
		<input type="hidden" name="targetId" value={data.targetCharacter.id} />

		<div class="field">
			<label for="answer">Your answer in Korean:</label>
			<input
				id="answer"
				name="answer"
				type="text"
				placeholder="e.g. 미국 사람"
				autocomplete="off"
				autocorrect="off"
			/>
		</div>

		<button type="submit">Submit answer</button>
	</form>

	{#if form?.result}
		<div class="result" class:correct={form.result.correct} class:incorrect={!form.result.correct}>
			{#if form.result.correct}
				<p>✅ {form.result.feedback}</p>
			{:else}
				<p>❌ {form.result.feedback}</p>
			{/if}
		</div>
	{/if}

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

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
	.question-card {
		background: #fff9e6;
		border: 1px solid #f0c040;
		border-radius: 6px;
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
	}
	.question {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
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
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}
	button {
		padding: 0.6rem 1.2rem;
		background: #4a6cf7;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}
	.result {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 4px;
	}
	.correct {
		background: #d5f5e3;
		border: 1px solid #27ae60;
	}
	.incorrect {
		background: #fdecea;
		border: 1px solid #e74c3c;
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
