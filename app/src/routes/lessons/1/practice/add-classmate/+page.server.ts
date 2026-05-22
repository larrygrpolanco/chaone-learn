import { fail, redirect } from '@sveltejs/kit';
import { createEntity } from '$lib/server/world/entities';
import { commitAttributeFact } from '$lib/server/world/facts';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;

const nationalities = [
	'한국',
	'미국',
	'영국',
	'일본',
	'중국',
	'프랑스',
	'독일',
	'스페인',
	'러시아'
] as const;

const years = ['일학년', '이학년', '삼학년', '사학년'] as const;

export function load() {
	return { nationalities, years };
}

export const actions: Actions = {
	commit: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const nationality = String(data.get('nationality') ?? '');
		const year = String(data.get('year') ?? '');

		if (!name || !nationalities.includes(nationality as never) || !years.includes(year as never)) {
			return fail(400, { error: 'missing or invalid fields', name, nationality, year });
		}

		const entityId = `char_learner_${crypto.randomUUID().slice(0, 8)}`;
		await createEntity({
			id: entityId,
			learnerId: DEV_LEARNER,
			kind: 'character',
			source: 'learner',
			createdInLesson: LESSON
		});

		for (const [field, value] of [
			['name', name],
			['nationality', nationality],
			['year', year]
		] as const) {
			await commitAttributeFact({
				learnerId: DEV_LEARNER,
				entityId,
				field,
				value,
				source: 'learner',
				lessonId: LESSON
			});
		}

		throw redirect(303, '/lessons/1/world');
	}
};
