<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let { data } = $props();

	type Phase = 'asking' | 'choosing' | 'done';
	let phase = $state<Phase>('asking');
	let chosenValue = $state('');

	const successKr = $derived(
		chosenValue
			? lesson1Manifest.fields[data.field].restate(chosenValue, { name: data.name })
			: ''
	);

	function acceptNoWrite() {
		chosenValue = data.proposal;
		phase = 'done';
	}

	function onCommitted(value: string) {
		chosenValue = value;
		phase = 'done';
	}

	async function next() {
		phase = 'asking';
		chosenValue = '';
		await invalidateAll();
	}
</script>

<div class="negotiated">
	<header>
		<span class="badge">Negotiated</span>
		<h1>{data.name}</h1>
	</header>

	<p class="prompt">{data.prompt}</p>

	{#if phase === 'asking'}
		<div class="choices">
			{#if data.isCurrent}
				<button class="yes" onclick={acceptNoWrite}>네</button>
			{:else}
				<form
					method="POST"
					action="?/commit"
					use:enhance={() => async ({ result, update }) => {
						await update();
						if (result.type === 'success') onCommitted(data.proposal);
					}}
				>
					<input type="hidden" name="entityId" value={data.entityId} />
					<input type="hidden" name="field" value={data.field} />
					<input type="hidden" name="value" value={data.proposal} />
					<button class="yes" type="submit">네</button>
				</form>
			{/if}
			<button class="no" onclick={() => (phase = 'choosing')}>아니요</button>
		</div>
	{:else if phase === 'choosing'}
		<p class="sub">그럼 어느 나라 사람이에요?</p>
		<div class="choices">
			{#each data.options as opt}
				<form
					method="POST"
					action="?/commit"
					use:enhance={() => async ({ result, update }) => {
						await update();
						if (result.type === 'success') onCommitted(opt);
					}}
				>
					<input type="hidden" name="entityId" value={data.entityId} />
					<input type="hidden" name="field" value={data.field} />
					<input type="hidden" name="value" value={opt} />
					<button type="submit">{opt}</button>
				</form>
			{/each}
		</div>
	{:else}
		<p class="ok">맞아요! {successKr}</p>
		<button class="nextbtn" onclick={next}>다음</button>
	{/if}

	<p class="meta">
		<a href="/lessons/1/world">← 월드 보기</a>
	</p>
</div>

<style>
	.negotiated {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-left: 6px solid #6aa86a;
		background: #f3faf3;
		border-radius: 6px;
	}
	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		background: #6aa86a;
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
	.prompt {
		font-size: 1.2rem;
		padding: 0.75rem;
		background: white;
		border-radius: 4px;
	}
	.sub {
		font-size: 1.05rem;
		margin-top: 1rem;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.choices :global(form) {
		display: inline;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button.yes {
		border-color: #6aa86a;
		color: #2e7d32;
		font-weight: bold;
	}
	button.no {
		border-color: #c66;
		color: #c66;
	}
	.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.nextbtn {
		margin-top: 0.5rem;
		background: #6aa86a;
		color: white;
		border-color: #6aa86a;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
