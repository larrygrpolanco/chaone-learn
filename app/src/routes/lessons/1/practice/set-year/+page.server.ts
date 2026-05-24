import { error, fail, redirect } from '@sveltejs/kit';
import { loadWorld } from '$lib/server/world/state';
import { commitAttributeFact } from '$lib/server/world/facts';
import { getEntity } from '$lib/server/world/entities';
import { isAllowedValue } from '$lib/content/lessons/lesson_1/manifest';
import { setYear } from '$lib/content/lessons/lesson_1/moves/set_year';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	if (!setYear.eligible(world)) {
		throw error(503, 'No one is missing a year.');
	}
	const q = setYear.prepare(world);
	return {
		entityId: q.targetEntityId,
		name: q.targetName,
		field: q.field,
		prompt: q.promptKr,
		options: q.options
	};
}

export const actions: Actions = {
	commit: async ({ request }) => {
		const data = await request.formData();
		const entityId = String(data.get('entityId') ?? '');
		const field = String(data.get('field') ?? '');
		const value = String(data.get('value') ?? '').trim();

		if (!entityId || field !== setYear.field || !isAllowedValue(field, value)) {
			return fail(400, { error: 'invalid commit', entityId, field, value });
		}

		const entity = await getEntity(DEV_LEARNER, entityId);
		if (!entity || entity.deletedAt) return fail(404, { error: 'no such entity' });

		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field,
			value,
			source: 'learner',
			lessonId: LESSON
		});

		throw redirect(303, '/lessons/1/practice');
	}
};
