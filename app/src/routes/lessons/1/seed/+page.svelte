<script lang="ts">
	import { enhance } from '$app/forms';
	import { lesson1Manifest } from '$lib/content/lessons/lesson_1/manifest';

	let { data } = $props();

	let phase = $state<'name' | 'nationality' | 'year' | 'confirm'>('name');
	let nameInput = $state('');
	let chosenNationality = $state('');
	let chosenYear = $state('');

	let recallWrong = $state<Set<string>>(new Set());
	let recallSolved = $state(false);

	let updateChoice = $state<'asking' | 'choosing'>('asking');
	let alternatePick = $state('');

	$effect(() => {
		// Reset transient state when step changes.
		void data.step;
		phase = 'name';
		nameInput = '';
		chosenNationality = '';
		chosenYear = '';
		recallWrong = new Set();
		recallSolved = false;
		updateChoice = 'asking';
		alternatePick = '';
	});

	function pickRecall(opt: string, correct: string) {
		if (recallSolved || recallWrong.has(opt)) return;
		if (opt === correct) recallSolved = true;
		else recallWrong = new Set([...recallWrong, opt]);
	}

	function authorRestatement(): string {
		if (!nameInput || !chosenNationality || !chosenYear) return '';
		const attrs = { name: nameInput, nationality: chosenNationality, year: chosenYear };
		const lines = [
			lesson1Manifest.fields.name.restate(nameInput, attrs),
			lesson1Manifest.fields.nationality.restate(chosenNationality, attrs),
			lesson1Manifest.fields.year.restate(chosenYear, attrs)
		];
		return lines.join(' ');
	}
</script>

<div class="seed">
	<header>
		{#if data.stepData.speaker}
			<span class="speaker">{data.stepData.speaker}</span>
		{/if}
		<span class="progress">{data.step + 1} / {data.totalSteps}</span>
		<a class="world-link" href="/lessons/1/world">World</a>
	</header>

	{#if data.stepData.kind === 'narrative'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line big">{data.stepData.promptKr}</p>
		{#if data.stepData.subKr}
			<p class="line">{data.stepData.subKr}</p>
		{/if}
		<a class="cta" href="/lessons/1/seed?step={data.nextStep}">{data.stepData.cta}</a>

	{:else if data.stepData.kind === 'author_add_student'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line big">{data.stepData.promptKr}</p>

		{#if phase === 'name'}
			<label class="field">
				<span>이름:</span>
				<input
					value={nameInput}
					oninput={(e) => (nameInput = (e.target as HTMLInputElement).value)}
					placeholder="이름"
				/>
			</label>
			<button class="cta" disabled={!nameInput.trim()} onclick={() => (phase = 'nationality')}>
				다음
			</button>
		{:else if phase === 'nationality'}
			<p class="line">{nameInput}은/는 어느 나라 사람이에요?</p>
			<div class="choices">
				{#each data.stepData.nationalityOptions as opt}
					<button
						class:selected={chosenNationality === opt}
						onclick={() => (chosenNationality = opt)}
					>
						{opt}
					</button>
				{/each}
			</div>
			<button class="cta" disabled={!chosenNationality} onclick={() => (phase = 'year')}>
				다음
			</button>
		{:else if phase === 'year'}
			<p class="line">{nameInput}은/는 몇 학년이에요?</p>
			<div class="choices">
				{#each data.stepData.yearOptions as opt}
					<button class:selected={chosenYear === opt} onclick={() => (chosenYear = opt)}>
						{opt}
					</button>
				{/each}
			</div>
			<button class="cta" disabled={!chosenYear} onclick={() => (phase = 'confirm')}>다음</button>
		{:else}
			<p class="line restate">{authorRestatement()}</p>
			<p class="story-note">This will change the story.</p>
			<form method="POST" action="?/addStudent" use:enhance>
				<input type="hidden" name="name" value={nameInput} />
				<input type="hidden" name="nationality" value={chosenNationality} />
				<input type="hidden" name="year" value={chosenYear} />
				<button class="cta confirm" type="submit">확인</button>
				<button type="button" onclick={() => (phase = 'year')}>되돌아가기</button>
			</form>
		{/if}

	{:else if data.stepData.kind === 'recall_inline'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line">{data.stepData.setupKr}</p>
		<p class="line big">{data.stepData.promptKr}</p>

		<div class="choices">
			{#each data.stepData.options as opt}
				<button
					class:wrong={recallWrong.has(opt)}
					class:correct={recallSolved && opt === data.stepData.correct}
					disabled={recallWrong.has(opt) || recallSolved}
					onclick={() => {
						if (data.stepData.kind === 'recall_inline') {
							pickRecall(opt, data.stepData.correct);
						}
					}}
				>
					{opt}
				</button>
			{/each}
		</div>

		{#if recallSolved}
			<p class="line ok">맞아요! {data.stepData.successKr}</p>
			<a class="cta" href="/lessons/1/seed?step={data.nextStep}">다음</a>
		{/if}

	{:else if data.stepData.kind === 'update_inline'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line big">{data.stepData.promptKr}</p>

		{#if updateChoice === 'asking'}
			<div class="choices yn">
				<a class="cta confirm" href="/lessons/1/seed?step={data.nextStep}">네</a>
				<button onclick={() => (updateChoice = 'choosing')}>아니요</button>
			</div>
		{:else if updateChoice === 'choosing'}
			<p class="line">
				그럼 {data.stepData.targetName}은/는
				{data.stepData.field === 'nationality' ? '어느 나라 사람이에요?' : '몇 학년이에요?'}
			</p>
			<div class="choices">
				{#each data.stepData.alternateOptions as opt}
					<button
						class:selected={alternatePick === opt}
						onclick={() => (alternatePick = opt)}
					>
						{opt}
					</button>
				{/each}
			</div>
			<form method="POST" action="?/updateCommit" use:enhance>
				<input type="hidden" name="entityId" value={data.stepData.targetEntityId} />
				<input type="hidden" name="field" value={data.stepData.field} />
				<input type="hidden" name="value" value={alternatePick} />
				<button class="cta confirm" type="submit" disabled={!alternatePick}>확인</button>
				<button type="button" onclick={() => (updateChoice = 'asking')}>되돌아가기</button>
			</form>
			<p class="story-note">This will change the story.</p>
		{/if}

	{:else if data.stepData.kind === 'missing_target'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line big">{data.stepData.promptKr}</p>
		<a class="cta" href="/lessons/1/seed?step=0">처음으로</a>

	{:else if data.stepData.kind === 'wrap'}
		{#if data.stepData.bodyEn}
			{#each data.stepData.bodyEn.split('\n\n') as para}
				<p class="line body-en">{para}</p>
			{/each}
		{/if}
		<p class="line big">{data.stepData.promptKr}</p>
		<a class="cta" href="/lessons/1/practice">{data.stepData.cta}</a>
	{/if}

	<p class="meta">
		<a href="/lessons/1">Lesson home</a> · <a href="/lessons/1/world">World</a>
	</p>
</div>

<style>
	:global(body) {
		background: #fdf8f0;
	}
	.seed {
		max-width: 32rem;
		margin: 3rem auto;
		padding: 2rem 1.5rem;
		font-family: system-ui, sans-serif;
	}
	header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e6dcc6;
		margin-bottom: 2rem;
		font-size: 0.85rem;
		color: #7a6a4e;
	}
	.speaker {
		font-weight: bold;
		color: #5a4a2e;
	}
	.progress {
		margin-left: auto;
	}
	.world-link {
		color: #7a6a4e;
		text-decoration: none;
		border-bottom: 1px dotted #b8a880;
	}
	.line {
		font-size: 1.1rem;
		line-height: 1.7;
		margin: 1rem 0;
		color: #2e2418;
	}
	.line.big {
		font-size: 1.4rem;
		line-height: 1.6;
		margin: 1.5rem 0;
	}
	.line.restate {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		border-left: 4px solid #b8a880;
	}
	.line.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.story-note {
		font-size: 0.85rem;
		color: #b8862b;
		margin: 0.75rem 0;
		font-style: italic;
	}
	.field {
		display: block;
		margin: 1rem 0;
	}
	.field span {
		display: block;
		margin-bottom: 0.25rem;
		color: #5a4a2e;
	}
	input {
		padding: 0.6rem;
		font-size: 1.05rem;
		width: 100%;
		border: 1px solid #d6c9a5;
		border-radius: 4px;
		background: white;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.choices.yn button {
		min-width: 5rem;
	}
	button {
		padding: 0.6rem 1.2rem;
		font-size: 1rem;
		border: 1px solid #c4b487;
		background: white;
		border-radius: 4px;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
		color: #2e2418;
	}
	button:disabled {
		cursor: default;
		opacity: 0.5;
	}
	button.selected {
		background: #b8a880;
		color: white;
		border-color: #b8a880;
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
	.cta {
		display: inline-block;
		padding: 0.7rem 1.4rem;
		font-size: 1.05rem;
		background: #5a4a2e;
		color: white;
		border-radius: 4px;
		text-decoration: none;
		border: none;
		cursor: pointer;
		margin-top: 0.5rem;
	}
	.cta:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.cta.confirm {
		background: #2e7d32;
	}
	.meta {
		margin-top: 3rem;
		padding-top: 1rem;
		border-top: 1px solid #e6dcc6;
		font-size: 0.85rem;
		color: #7a6a4e;
	}
	.meta a {
		color: #7a6a4e;
	}
</style>
