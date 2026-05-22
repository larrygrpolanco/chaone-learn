import { fail, redirect } from '@sveltejs/kit';
import { createEntity } from '$lib/server/world/entities';
import { commitAttributeFact } from '$lib/server/world/facts';
import { isAllowedValue } from '$lib/content/lessons/lesson_1/manifest';
import { addClassmate } from '$lib/content/lessons/lesson_1/moves/add_classmate';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;

export const actions: Actions = {
	commit: async ({ request }) => {
		const data = await request.formData();
		const facts: Record<string, string> = {};
		for (const step of addClassmate.steps) {
			facts[step.field] = String(data.get(step.field) ?? '').trim();
		}

		for (const step of addClassmate.steps) {
			if (!isAllowedValue(step.field, facts[step.field])) {
				return fail(400, { error: `invalid ${step.field}`, ...facts });
			}
		}

		const entityId = `char_learner_${crypto.randomUUID().slice(0, 8)}`;
		await createEntity({
			id: entityId,
			learnerId: DEV_LEARNER,
			kind: 'character',
			source: 'learner',
			createdInLesson: LESSON
		});

		for (const step of addClassmate.steps) {
			await commitAttributeFact({
				learnerId: DEV_LEARNER,
				entityId,
				field: step.field,
				value: facts[step.field],
				source: 'learner',
				lessonId: LESSON
			});
		}

		throw redirect(303, '/lessons/1/world');
	}
};
