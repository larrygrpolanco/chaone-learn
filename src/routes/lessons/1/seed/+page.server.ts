import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { worldState } from '$lib/server/world/index';
import { phaseState } from '$lib/server/phaseState';
import { DEV_LEARNER_ID } from '$lib/server/constants';
import { SEED_STEPS } from '$lib/content/lessons/lesson1/exercises';
import { getSeedProgress } from '$lib/content/lessons/lesson1/seedProgress';

const LESSON_ID = 1;

export const load: PageServerLoad = async () => {
	const state = phaseState.getPhaseState(DEV_LEARNER_ID, LESSON_ID);

	// If seed is already marked complete, skip ahead
	if (state.completedPhases.includes('seed')) {
		redirect(302, '/lessons/1/building');
	}

	const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
	const progress = getSeedProgress(characters);

	// Edge case: world data is complete but phase not yet marked
	if (progress === 'complete') {
		phaseState.markPhaseComplete(DEV_LEARNER_ID, LESSON_ID, 'seed');
		redirect(302, '/lessons/1/building');
	}

	const currentStep = SEED_STEPS[progress - 1];

	return {
		step: progress as number,
		totalSteps: SEED_STEPS.length,
		fieldLabel: currentStep.field.label,
		fieldType: currentStep.field.type,
		fieldOptions: currentStep.field.options ? Array.from(currentStep.field.options) : [],
		characters,
		teacherMessage: currentStep.teacherMessage
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const stepRaw = formData.get('step');
		const value = (formData.get('value') as string | null) ?? '';

		const step = parseInt(stepRaw as string, 10);
		if (!step || step < 1 || step > SEED_STEPS.length) {
			return fail(400, { error: 'Invalid step.' });
		}

		const stepDef = SEED_STEPS[step - 1];
		const validation = stepDef.validate(value);
		if (!validation.valid) return fail(400, { error: validation.error });

		const characters = worldState.getAllCharacters(DEV_LEARNER_ID);
		const learner = characters.find((c) => c.is_learner);
		const classmate = characters.find((c) => !c.is_learner);
		const trimmed = value.trim();

		switch (step) {
			case 1:
				// Create learner character with name only
				worldState.addCharacter(DEV_LEARNER_ID, { name: trimmed, is_learner: true });
				break;
			case 2:
				if (!learner) return fail(400, { error: 'Complete step 1 first.' });
				worldState.updateCharacter(learner.id, 'year', trimmed);
				break;
			case 3:
				if (!learner) return fail(400, { error: 'Complete step 1 first.' });
				worldState.updateCharacter(learner.id, 'nationality', trimmed);
				break;
			case 4:
				// Create classmate character with name only
				worldState.addCharacter(DEV_LEARNER_ID, { name: trimmed, is_learner: false });
				break;
			case 5:
				if (!classmate) return fail(400, { error: 'Complete step 4 first.' });
				worldState.updateCharacter(classmate.id, 'year', trimmed);
				break;
			case 6:
				if (!classmate) return fail(400, { error: 'Complete step 4 first.' });
				worldState.updateCharacter(classmate.id, 'nationality', trimmed);
				break;
		}

		// Check if seed is now complete and advance
		const updatedCharacters = worldState.getAllCharacters(DEV_LEARNER_ID);
		const newProgress = getSeedProgress(updatedCharacters);

		if (newProgress === 'complete') {
			phaseState.markPhaseComplete(DEV_LEARNER_ID, LESSON_ID, 'seed');
			redirect(302, '/lessons/1/building');
		}

		return { success: true };
	}
};
