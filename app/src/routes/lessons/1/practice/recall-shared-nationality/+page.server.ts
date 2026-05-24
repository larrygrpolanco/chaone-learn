import { error } from '@sveltejs/kit';
import { loadWorld } from '$lib/server/world/state';
import { recallSharedNationality } from '$lib/content/lessons/lesson_1/moves/recall_shared_nationality';

const DEV_LEARNER = 'dev_learner';

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	if (!recallSharedNationality.eligible(world)) {
		throw error(503, 'No two classmates share a nationality yet.');
	}
	const q = recallSharedNationality.prepare(world);
	return {
		name: q.targetName,
		prompt: q.promptKr,
		successKr: q.successKr,
		options: q.options,
		correct: q.correct
	};
}
