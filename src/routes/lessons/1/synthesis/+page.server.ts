import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import {
	synthesisNationalityExercise,
	synthesisYearExercise,
	synthesisNameExercise
} from '$lib/content/lessons/lesson1/exercises';
import { teacherAssistant } from '$lib/content/lessons/lesson1/teacherAssistant';

const LESSON_ID = 1;

export const load: PageServerLoad = async () => {
	const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);

	// Building must be complete to access synthesis
	if (!state.completedPhases.includes('building')) {
		redirect(302, '/lessons/1/building');
	}

	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	const nonLearners = characters.filter((c) => !c.is_learner);

	if (nonLearners.length === 0) {
		redirect(302, '/lessons/1/building');
	}

	// Generate one question per attribute per character (nationality, year, name)
	const questions = nonLearners.flatMap((character) => [
		{
			type: 'nationality' as const,
			targetId: character.id,
			prompt: synthesisNationalityExercise.prompt({ classmateName: character.name })
		},
		{
			type: 'year' as const,
			targetId: character.id,
			prompt: synthesisYearExercise.prompt({ classmateName: character.name })
		},
		{
			type: 'name' as const,
			targetId: character.id,
			prompt: synthesisNameExercise.prompt({
				nationality: character.nationality ?? '',
				year: character.year ?? ''
			})
		}
	]);

	return {
		characters,
		questions,
		teacherMessage: teacherAssistant.synthesis.intro
	};
};

export const actions: Actions = {
	answer: async ({ request }) => {
		const data = await request.formData();
		const answer = (data.get('answer') as string) ?? '';
		const targetId = Number(data.get('targetId'));
		const questionType = data.get('questionType') as 'nationality' | 'year' | 'name';

		if (!targetId) return fail(400, { error: 'Missing target character.' });
		if (!questionType) return fail(400, { error: 'Missing question type.' });

		// Re-query server-side — never trust client for correct answer
		const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
		const target = characters.find((c) => c.id === targetId);

		if (!target) {
			return fail(400, { error: 'Target character not found.' });
		}

		let result;
		if (questionType === 'nationality') {
			if (!target.nationality) return fail(400, { error: 'Character has no nationality.' });
			result = synthesisNationalityExercise.evaluate(answer, target.nationality);
		} else if (questionType === 'year') {
			if (!target.year) return fail(400, { error: 'Character has no year.' });
			result = synthesisYearExercise.evaluate(answer, target.year);
		} else if (questionType === 'name') {
			result = synthesisNameExercise.evaluate(answer, target.name);
		} else {
			return fail(400, { error: 'Invalid question type.' });
		}

		return { result };
	}
};
