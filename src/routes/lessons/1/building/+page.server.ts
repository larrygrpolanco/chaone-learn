import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { isValidNationality } from '$lib/content/lessons/lesson1/scope';
import { teacherAssistant } from '$lib/content/lessons/lesson1/teacherAssistant';

const LESSON_ID = 1;

export const load: PageServerLoad = async () => {
	const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);

	// Seed must be complete to access building
	if (!state.completedPhases.includes('seed')) {
		redirect(302, '/lessons/1/seed');
	}

	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	return {
		characters,
		teacherMessage: teacherAssistant.building.start,
		buildingComplete: state.completedPhases.includes('building')
	};
};

export const actions: Actions = {
	addClassmate: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const nationality = data.get('nationality') as string;

		if (!name) return fail(400, { error: 'Name is required.' });
		if (!isValidNationality(nationality)) return fail(400, { error: 'Invalid nationality.' });

		worldState.addCharacter(DEV_LEARNER_ID, { name, nationality });

		// Return updated characters — use:enhance will reload page data
		return { success: true };
	},

	proceed: async () => {
		const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);
		if (!state.completedPhases.includes('building')) {
			phaseState.markPhaseComplete(DEV_LEARNER_ID, LESSON_ID, 'building');
		}
		redirect(302, '/lessons/1/synthesis');
	}
};
