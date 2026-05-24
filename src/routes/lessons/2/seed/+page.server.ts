import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { teacherAssistant } from '$lib/content/lessons/lesson2/teacherAssistant';

const LESSON1_ID = 1;

export const load: PageServerLoad = async () => {
	// Lesson 1 synthesis must be complete before Lesson 2 is reachable
	const lesson1State = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON1_ID);
	if (!lesson1State.completedPhases.includes('synthesis')) {
		redirect(302, '/lessons/1/synthesis');
	}

	// Characters carry over automatically — same worldState, no migration needed
	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	const firstClassmate = characters.find((c) => !c.is_learner) ?? null;

	return {
		characters,
		firstClassmate,
		teacherIntro: teacherAssistant.seed.intro,
		expansionMessage: firstClassmate
			? teacherAssistant.seed.expansion(firstClassmate.name)
			: null
	};
};
