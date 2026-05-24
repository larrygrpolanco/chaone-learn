import { eq, and } from 'drizzle-orm';
import type { Db } from './db/index';
import { phase_state } from './db/schema';

export type Phase = 'seed' | 'building' | 'synthesis';

export type PhaseState = {
	phase: Phase;
	completedPhases: Phase[];
};

const PHASE_ORDER: Phase[] = ['seed', 'building', 'synthesis'];

export function createPhaseState(db: Db) {
	function getPhaseState(learnerId: string, lessonId: number): PhaseState {
		const row = db
			.select()
			.from(phase_state)
			.where(
				and(eq(phase_state.learner_id, learnerId), eq(phase_state.lesson_id, lessonId))
			)
			.get();

		if (!row) {
			return { phase: 'seed', completedPhases: [] };
		}

		const completedPhases = JSON.parse(row.completed_phases) as Phase[];
		return { phase: row.phase as Phase, completedPhases };
	}

	function markPhaseComplete(learnerId: string, lessonId: number, phase: Phase): void {
		const current = getPhaseState(learnerId, lessonId);
		const completedPhases = current.completedPhases.includes(phase)
			? current.completedPhases
			: [...current.completedPhases, phase];

		// Determine next phase
		const currentIndex = PHASE_ORDER.indexOf(phase);
		const nextPhase = PHASE_ORDER[currentIndex + 1] ?? phase;

		// Guard: synthesis requires both seed and building to be complete
		if (
			nextPhase === 'synthesis' &&
			(!completedPhases.includes('seed') || !completedPhases.includes('building'))
		) {
			throw new Error('Cannot advance to synthesis: seed and building must be complete first.');
		}

		db.insert(phase_state)
			.values({
				learner_id: learnerId,
				lesson_id: lessonId,
				phase: nextPhase,
				completed_phases: JSON.stringify(completedPhases)
			})
			.onConflictDoUpdate({
				target: [phase_state.learner_id, phase_state.lesson_id],
				set: {
					phase: nextPhase,
					completed_phases: JSON.stringify(completedPhases)
				}
			})
			.run();
	}

	function getCurrentPhase(learnerId: string, lessonId: number): Phase {
		return getPhaseState(learnerId, lessonId).phase;
	}

	return { getPhaseState, markPhaseComplete, getCurrentPhase };
}

// Default instance using the real database
import { db as realDb } from './db/index';
export const phaseState = createPhaseState(realDb);
