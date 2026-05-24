import type { CharacterView } from '$lib/types';

export type SeedStepNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type SeedProgress = SeedStepNumber | 'complete';

/**
 * Derives the current Seed step from world state.
 * Returns 'complete' when both the learner and one classmate are fully populated.
 *
 * Steps:
 *   1 – enter learner name
 *   2 – enter learner year
 *   3 – enter learner nationality
 *   4 – enter classmate name
 *   5 – enter classmate year
 *   6 – enter classmate nationality → complete
 */
export function getSeedProgress(characters: CharacterView[]): SeedProgress {
	const learner = characters.find((c) => c.is_learner);

	if (!learner) return 1;
	if (!learner.year) return 2;
	if (!learner.nationality) return 3;

	const classmate = characters.find((c) => !c.is_learner);

	if (!classmate) return 4;
	if (!classmate.year) return 5;
	if (!classmate.nationality) return 6;

	return 'complete';
}
