import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { isValidNationality, isValidYear } from '$lib/content/lessons/lesson1/scope';
import {
	buildingUpdateNationalityExercise,
	buildingUpdateYearExercise
} from '$lib/content/lessons/lesson1/exercises';
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
		const year = data.get('year') as string;

		if (!name) return fail(400, { error: 'Name is required.' });
		if (!isValidNationality(nationality)) return fail(400, { error: 'Invalid nationality.' });
		if (!isValidYear(year)) return fail(400, { error: 'Invalid year.' });

		worldState.addCharacter(DEV_LEARNER_ID, { name, nationality, year });

		return { success: true };
	},

	updateNationality: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const nationality = data.get('nationality') as string;

		if (!id) return fail(400, { error: 'Missing character id.' });

		const validation = buildingUpdateNationalityExercise.validate(nationality);
		if (!validation.valid) return fail(400, { error: validation.error });

		worldState.updateCharacter(id, 'nationality', nationality);
		return { success: true };
	},

	updateYear: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const year = data.get('year') as string;

		if (!id) return fail(400, { error: 'Missing character id.' });

		const validation = buildingUpdateYearExercise.validate(year);
		if (!validation.valid) return fail(400, { error: validation.error });

		worldState.updateCharacter(id, 'year', year);
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
