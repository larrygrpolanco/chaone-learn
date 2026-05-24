import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { isValidNationality, isValidYear } from '$lib/content/lessons/lesson1/scope';
import { teacherAssistant } from '$lib/content/lessons/lesson1/teacherAssistant';

const LESSON_ID = 1;

export const load: PageServerLoad = async () => {
	const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);

	// If seed is already complete, skip ahead
	if (state.completedPhases.includes('seed')) {
		redirect(302, '/lessons/1/building');
	}

	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	return {
		characters,
		teacherMessage: teacherAssistant.seed.intro
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const nationality = data.get('nationality') as string;
		const year = data.get('year') as string;

		// Validate
		if (!name) return fail(400, { error: 'Name is required.' });
		if (!isValidNationality(nationality)) return fail(400, { error: 'Invalid nationality.' });
		if (!isValidYear(year)) return fail(400, { error: 'Invalid year.' });

		worldState.addCharacter(DEV_LEARNER_ID, {
			name,
			nationality,
			year,
			is_learner: true
		});

		phaseState.markPhaseComplete(DEV_LEARNER_ID, LESSON_ID, 'seed');

		redirect(302, '/lessons/1/building');
	}
};
