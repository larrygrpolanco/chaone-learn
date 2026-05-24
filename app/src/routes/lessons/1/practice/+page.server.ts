import { loadWorld } from '$lib/server/world/state';
import { lesson1Moves } from '$lib/content/lessons/lesson_1/moves';
import type { Move, WorldState } from '$lib/content/lessons/types';

const DEV_LEARNER = 'dev_learner';

function pickLeadingQuestion(move: Move, world: WorldState): string {
	const variants = move.leadingQuestionsEn;
	const template = variants[Math.floor(Math.random() * variants.length)];
	const vars = move.previewVars?.(world) ?? {};
	if (move.previewTargetName && vars.name === undefined) {
		vars.name = move.previewTargetName(world) ?? '';
	}
	return template.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

export async function load() {
	const world = await loadWorld(DEV_LEARNER);
	const eligible = lesson1Moves
		.filter((m) => m.eligible(world))
		.map((m) => ({
			id: m.id,
			writes: m.mode === 'author',
			route: m.route,
			leadingQuestionEn: pickLeadingQuestion(m, world)
		}));
	return { eligible };
}
