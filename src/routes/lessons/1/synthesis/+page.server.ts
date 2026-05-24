import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { synthesisNationalityExercise } from '$lib/content/lessons/lesson1/exercises';
import { teacherAssistant } from '$lib/content/lessons/lesson1/teacherAssistant';

const LESSON_ID = 1;

export const load: PageServerLoad = async () => {
	const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);

	// Building must be complete to access synthesis
	if (!state.completedPhases.includes('building')) {
		redirect(302, '/lessons/1/building');
	}

	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	const targetCharacter = characters.find((c) => !c.is_learner) ?? null;

	if (!targetCharacter) {
		redirect(302, '/lessons/1/building');
	}

	return {
		characters,
		targetCharacter,
		question: synthesisNationalityExercise.prompt({ classmateName: targetCharacter.name }),
		teacherMessage: teacherAssistant.synthesis.intro
	};
};

export const actions: Actions = {
	answer: async ({ request }) => {
		const data = await request.formData();
		const answer = (data.get('answer') as string) ?? '';
		const targetId = Number(data.get('targetId'));

		if (!targetId) return fail(400, { error: 'Missing target character.' });

		// Re-query server-side — never trust client for correct answer
		const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
		const target = characters.find((c) => c.id === targetId);

		if (!target || !target.nationality) {
			return fail(400, { error: 'Target character not found.' });
		}

		const result = synthesisNationalityExercise.evaluate(answer, target.nationality);
		return { result };
	}
};
