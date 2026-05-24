<script lang="ts">
	import { enhance } from '$app/forms';
	import ClassRoster from '$lib/components/ClassRoster.svelte';

	let { data } = $props();

	let currentIndex = $state(0);
	let answeredResult = $state<null | { correct: boolean; correctAnswer: string; feedback: string }>(
		null
	);

	let currentQuestion = $derived(data.questions[currentIndex]);
	let isComplete = $derived(currentIndex >= data.questions.length);
</script>

<main>
	<h1>Lesson 1 — Synthesis Phase</h1>

	<div class="teacher-message">
		<p>🍎 {data.teacherMessage}</p>
	</div>

	{#if isComplete}
		<div class="completion">
			<p>🎉 Synthesis complete! You recalled everything from the world you built.</p>
		</div>
	{:else}
		<div class="progress">
			<span>Question {currentIndex + 1} of {data.questions.length}</span>
		</div>

		<div class="question-card">
			<p class="question">{currentQuestion.prompt}</p>
		</div>

		{#if answeredResult === null}
			<form
				method="POST"
				action="?/answer"
				use:enhance={({ formData }) => {
					return async ({ result }) => {
						if (result.type === 'success' && result.data?.result) {
							answeredResult = result.data.result as {
								correct: boolean;
								correctAnswer: string;
								feedback: string;
							};
						}
					};
				}}
			>
				<input type="hidden" name="targetId" value={currentQuestion.targetId} />
				<input type="hidden" name="questionType" value={currentQuestion.type} />

				<div class="field">
					<label for="answer">Your answer in Korean:</label>
					<input
						id="answer"
						name="answer"
						type="text"
						placeholder={currentQuestion.type === 'name' ? 'e.g. 민준' : currentQuestion.type === 'year' ? 'e.g. 2학년' : 'e.g. 미국 사람'}
						autocomplete="off"
						autocorrect="off"
					/>
				</div>

				<button type="submit">Submit answer</button>
			</form>
		{/if}

		{#if answeredResult !== null}
			<div
				class="result"
				class:correct={answeredResult.correct}
				class:incorrect={!answeredResult.correct}
			>
				{#if answeredResult.correct}
					<p>✅ {answeredResult.feedback}</p>
				{:else}
					<p>❌ {answeredResult.feedback}</p>
				{/if}
			</div>

			<button
				class="next-btn"
				onclick={() => {
					currentIndex++;
					answeredResult = null;
				}}
			>
				Next question →
			</button>
		{/if}
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
	.progress {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.5rem;
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
	.next-btn {
		margin-top: 1rem;
		background: #27ae60;
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
	.completion {
		background: #d5f5e3;
		border: 1px solid #27ae60;
		border-radius: 6px;
		padding: 1.5rem;
		text-align: center;
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}
	aside {
		margin-top: 2rem;
		border-top: 1px solid #eee;
		padding-top: 1rem;
	}
</style>
