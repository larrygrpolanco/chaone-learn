import { error } from '@sveltejs/kit';
import { listEntitiesByKind } from '$lib/server/world/entities';
import { listAttributesForEntity } from '$lib/server/world/facts';
import { topicMarker } from '$lib/korean';

const DEV_LEARNER = 'dev_learner';

const NATIONALITY_POOL = [
	'한국',
	'미국',
	'영국',
	'일본',
	'중국',
	'프랑스',
	'독일',
	'스페인',
	'러시아'
];

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export async function load() {
	const chars = await listEntitiesByKind(DEV_LEARNER, 'character');
	const enriched = await Promise.all(
		chars.map(async (c) => ({ id: c.id, attrs: await listAttributesForEntity(DEV_LEARNER, c.id) }))
	);

	// Eligible: has both name and nationality; skip the titled professor for now
	// (lesson 1 grammar doesn't cover honorifics needed for 선생님).
	const eligible = enriched.filter(
		(e) => e.attrs.name && e.attrs.nationality && !e.attrs.name.includes('선생님')
	);

	if (eligible.length === 0) {
		throw error(503, 'No characters available to ask about. Add a classmate first.');
	}

	const target = eligible[Math.floor(Math.random() * eligible.length)];
	const correct = target.attrs.nationality;

	const distractors = shuffle(NATIONALITY_POOL.filter((n) => n !== correct)).slice(0, 3);
	const options = shuffle([correct, ...distractors]);

	const subject = `${target.attrs.name} 씨${topicMarker(target.attrs.name + ' 씨')}`;
	const prompt = `${subject} 어느 나라 사람이에요?`;

	return {
		name: target.attrs.name,
		prompt,
		options,
		correct
	};
}
