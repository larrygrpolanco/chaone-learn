<script lang="ts">
	import { enhance } from '$app/forms';
	import { topicMarker } from '$lib/korean';

	let { data } = $props();

	type Step = 'name' | 'nationality' | 'year' | 'confirm';
	let step = $state<Step>('name');
	let name = $state('');
	let nationality = $state('');
	let year = $state('');

	const topic = $derived(name ? `${name}${topicMarker(name)}` : '');
</script>

<div class="author">
	<header>
		<span class="badge">Author</span>
		<h1>새 친구가 왔어요</h1>
	</header>

	{#if step === 'name'}
		<p>이름이 뭐예요?</p>
		<input bind:value={name} placeholder="이름" />
		<button disabled={!name.trim()} onclick={() => (step = 'nationality')}>다음</button>
	{:else if step === 'nationality'}
		<p>{topic} 어느 나라 사람이에요?</p>
		<div class="choices">
			{#each data.nationalities as n}
				<button
					class:selected={nationality === n}
					onclick={() => {
						nationality = n;
						step = 'year';
					}}>{n}</button
				>
			{/each}
		</div>
	{:else if step === 'year'}
		<p>{topic} 몇 학년이에요?</p>
		<div class="choices">
			{#each data.years as y}
				<button
					class:selected={year === y}
					onclick={() => {
						year = y;
						step = 'confirm';
					}}>{y}</button
				>
			{/each}
		</div>
	{:else}
		<p class="restatement">
			{topic} {nationality} 사람이에요.<br />
			{topic} {year}이에요.
		</p>
		<form method="POST" action="?/commit" use:enhance>
			<input type="hidden" name="name" value={name} />
			<input type="hidden" name="nationality" value={nationality} />
			<input type="hidden" name="year" value={year} />
			<button type="submit">맞아요 (Confirm)</button>
			<button type="button" onclick={() => (step = 'name')}>고쳐요 (Edit)</button>
		</form>
	{/if}

	<p class="meta">
		<a href="/lessons/1/world">← 월드 보기</a>
	</p>
</div>

<style>
	.author {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-left: 6px solid #5a8dee;
		background: #f4f8ff;
		border-radius: 6px;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		background: #5a8dee;
		color: white;
		border-radius: 999px;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	h1 {
		margin: 0.5rem 0 1rem;
		font-size: 1.25rem;
	}
	p {
		font-size: 1.1rem;
	}
	.restatement {
		font-size: 1.2rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button.selected {
		background: #5a8dee;
		color: white;
	}
	input:not([type]) {
		padding: 0.5rem;
		font-size: 1rem;
		width: 100%;
		margin-bottom: 0.5rem;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
