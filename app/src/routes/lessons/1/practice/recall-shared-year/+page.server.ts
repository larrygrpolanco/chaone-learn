import { error } from '@sveltejs/kit';
import { loadWorld } from '$lib/server/world/state';
import { recallSharedYear } from '$lib/content/lessons/lesson_1/moves/recall_shared_year';

const DEV_LEARNER = 'dev_learner';

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	if (!recallSharedYear.eligible(world)) {
		throw error(503, 'No two classmates share a year yet.');
	}
	const q = recallSharedYear.prepare(world);
	return {
		name: q.targetName,
		prompt: q.promptKr,
		successKr: q.successKr,
		options: q.options,
		correct: q.correct
	};
}
