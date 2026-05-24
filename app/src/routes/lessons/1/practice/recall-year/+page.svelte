<script lang="ts">
	let { data } = $props();

	let wrong = $state<Set<string>>(new Set());
	let solved = $state(false);

	function pick(opt: string) {
		if (solved || wrong.has(opt)) return;
		if (opt === data.correct) {
			solved = true;
		} else {
			wrong = new Set([...wrong, opt]);
		}
	}
</script>

<div class="move" data-writes="false">
	<header>
		<h1>{data.name}</h1>
	</header>

	<p class="prompt">{data.prompt}</p>

	<div class="choices">
		{#each data.options as opt}
			<button
				class:wrong={wrong.has(opt)}
				class:correct={solved && opt === data.correct}
				disabled={wrong.has(opt) || solved}
				onclick={() => pick(opt)}
			>
				{opt}
			</button>
		{/each}
	</div>

	{#if solved}
		<p class="ok">맞아요! {data.successKr}</p>
		<a class="next" href="/lessons/1/practice">Done</a>
	{/if}

	<p class="meta">
		<a href="/lessons/1/roster">Roster</a> · <a href="/lessons/1/practice">Back</a>
	</p>
</div>

<style>
	.move {
		max-width: 30rem;
		margin: 2rem auto;
		padding: 1.5rem;
		border-radius: 6px;
	}
	.move[data-writes='false'] {
		border-left: 6px solid #ee8b5a;
		background: #fff7f0;
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
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border: 1px solid #aaa;
		background: white;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	button:disabled {
		cursor: default;
	}
	button.wrong {
		opacity: 0.4;
		color: #999;
		background: #eee;
		animation: shake 0.3s;
	}
	button.correct {
		background: #4caf50;
		color: white;
		border-color: #4caf50;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-6px);
		}
		75% {
			transform: translateX(6px);
		}
	}
	.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.next {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.5rem 1rem;
		background: #ee8b5a;
		color: white;
		border-radius: 4px;
		text-decoration: none;
	}
	.meta {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}
</style>
