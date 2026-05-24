import { fail, redirect } from '@sveltejs/kit';
import { createEntity } from '$lib/server/world/entities';
import { commitAttributeFact } from '$lib/server/world/facts';
import { isAllowedValue } from '$lib/content/lessons/lesson_1/manifest';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;

export const actions: Actions = {
	commit: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		if (!isAllowedValue('name', name)) {
			return fail(400, { error: 'invalid name', name });
		}

		const entityId = `char_learner_${crypto.randomUUID().slice(0, 8)}`;
		await createEntity({
			id: entityId,
			learnerId: DEV_LEARNER,
			kind: 'character',
			source: 'learner',
			createdInLesson: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field: 'name',
			value: name,
			source: 'learner',
			lessonId: LESSON
		});

		throw redirect(303, '/lessons/1/practice');
	}
};
