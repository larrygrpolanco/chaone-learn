<script lang="ts">
	let { data } = $props();

	type Card = (typeof data.eligible)[number];

	function shuffle<T>(arr: readonly T[]): T[] {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function pickThree(pool: readonly Card[]): Card[] {
		return shuffle(pool).slice(0, 3);
	}

	let visible = $state<Card[]>([]);

	$effect(() => {
		visible = pickThree(data.eligible);
	});

	function reshuffle() {
		visible = pickThree(data.eligible);
	}
</script>

<div class="hub">
	<header>
		<h1>Lesson 1</h1>
		<p class="meta">
			<a href="/lessons/1/roster">Roster</a> · <a href="/lessons/1">Lesson home</a>
		</p>
	</header>

	{#if visible.length === 0}
		<p>No one is in the class yet. <a href="/lessons/1">Lesson home</a>.</p>
	{:else}
		<div class="cards">
			{#each visible as card (card.id)}
				<a class="card" data-writes={card.writes} href={card.route}>
					<p class="lead">{card.leadingQuestionEn}</p>
				</a>
			{/each}
			<button class="card shuffle" onclick={reshuffle} type="button">
				<p class="lead">Shuffle</p>
			</button>
		</div>
	{/if}

	{#if data.eligible.length < 3 && data.eligible.length > 0}
		<p class="note">Only {data.eligible.length} eligible right now.</p>
	{/if}
</div>

<style>
	.hub {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 1rem;
	}
	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.4rem;
	}
	.meta {
		font-size: 0.85rem;
		color: #666;
		margin-top: 0;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
	.card {
		display: block;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: white;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		font: inherit;
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}
	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}
	.card[data-writes='true'] {
		border-left: 6px solid #5a8dee;
		background: #f4f8ff;
	}
	.card[data-writes='false'] {
		border-left: 6px solid #ee8b5a;
		background: #fff7f0;
	}
	.card.shuffle {
		border-left: 6px solid #888;
		background: #f5f5f5;
	}
	.lead {
		margin: 0;
		font-size: 1.05rem;
	}
	.note {
		margin-top: 1rem;
		font-size: 0.85rem;
		color: #888;
	}
</style>
