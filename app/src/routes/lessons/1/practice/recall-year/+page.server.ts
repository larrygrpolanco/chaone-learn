import { error } from '@sveltejs/kit';
import { loadWorld } from '$lib/server/world/state';
import { recallYear } from '$lib/content/lessons/lesson_1/moves/recall_year';

const DEV_LEARNER = 'dev_learner';

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	if (!recallYear.eligible(world)) {
		throw error(503, 'No characters with a year set. Add one or edit the world first.');
	}
	const q = recallYear.prepare(world);
	return {
		name: q.targetName,
		prompt: q.promptKr,
		successKr: q.successKr,
		options: q.options,
		correct: q.correct
	};
}
