<script lang="ts">
	import { enhance } from '$app/forms';
	import { LESSON1_NATIONALITIES, LESSON1_YEARS } from '$lib/content/lessons/lesson1/scope';

	let { data, form } = $props();
</script>

<main>
	<h1>Lesson 1 — Building Phase</h1>

	<div class="teacher-message">
		<p>🍎 {data.teacherMessage}</p>
	</div>

	<!-- Add classmate form -->
	<section class="add-section">
		<h2>Add a classmate</h2>
		<form method="POST" action="?/addClassmate" use:enhance>
			<div class="field">
				<label for="name">이름 (Name)</label>
				<input id="name" name="name" type="text" required placeholder="Classmate's name" />
			</div>

			<div class="field">
				<label for="year">학년 (Year)</label>
				<select id="year" name="year" required>
					<option value="">— select —</option>
					{#each LESSON1_YEARS as yr}
						<option value={yr}>{yr}</option>
					{/each}
				</select>
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
	</section>

	<!-- Class Roster with inline edit -->
	<section class="roster-section">
		<h2>Class Roster</h2>
		{#if data.characters.length === 0}
			<p class="empty">The roster is empty.</p>
		{:else}
			{#each data.characters as character}
				<div class="character" class:learner={character.is_learner}>
					<div class="character-info">
						<span class="name">{character.name}</span>
						{#if character.is_learner}
							<span class="badge">You</span>
						{/if}
						{#if character.nationality}
							<span class="pill nationality">{character.nationality}</span>
						{/if}
						{#if character.year}
							<span class="pill year">{character.year}</span>
						{/if}
					</div>

					{#if !character.is_learner}
						<div class="edit-row">
							<!-- Update nationality -->
							<form method="POST" action="?/updateNationality" use:enhance class="inline-form">
								<input type="hidden" name="id" value={character.id} />
								<select name="nationality" aria-label="Update nationality for {character.name}">
									{#each LESSON1_NATIONALITIES as nat}
										<option value={nat} selected={character.nationality === nat}>{nat}</option>
									{/each}
								</select>
								<button type="submit" class="edit-btn">Update 국적</button>
							</form>

							<!-- Update year -->
							<form method="POST" action="?/updateYear" use:enhance class="inline-form">
								<input type="hidden" name="id" value={character.id} />
								<select name="year" aria-label="Update year for {character.name}">
									{#each LESSON1_YEARS as yr}
										<option value={yr} selected={character.year === yr}>{yr}</option>
									{/each}
								</select>
								<button type="submit" class="edit-btn">Update 학년</button>
							</form>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</section>

	<form method="POST" action="?/proceed" use:enhance>
		<button type="submit" class="proceed">
			Done adding classmates — go to Synthesis →
		</button>
	</form>
</main>

<style>
	main {
		max-width: 640px;
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
	.add-section,
	.roster-section {
		margin-bottom: 2rem;
	}
	h2 {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
		color: #333;
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
		width: 100%;
		margin-top: 0.5rem;
	}
	.error {
		color: #c0392b;
		font-size: 0.9rem;
	}
	.empty {
		color: #888;
		font-style: italic;
		font-size: 0.9rem;
	}

	/* Roster */
	.character {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
		background: #f9f9f9;
	}
	.character.learner {
		background: #eef2ff;
		border-color: #4a6cf7;
	}
	.character-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.name {
		font-weight: 600;
		flex: 1;
	}
	.badge {
		font-size: 0.7rem;
		background: #4a6cf7;
		color: white;
		padding: 0.15rem 0.4rem;
		border-radius: 999px;
	}
	.pill {
		font-size: 0.8rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
	}
	.pill.nationality {
		background: #e8f5e9;
		color: #2e7d32;
	}
	.pill.year {
		background: #fff3e0;
		color: #e65100;
	}
	.edit-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.inline-form {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}
	.inline-form select {
		padding: 0.3rem 0.5rem;
		font-size: 0.85rem;
	}
	.edit-btn {
		margin-top: 0;
		padding: 0.3rem 0.7rem;
		font-size: 0.8rem;
		background: #78909c;
	}
	.edit-btn:hover {
		background: #546e7a;
	}
</style>
