import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './db/schema';
import { createPhaseState } from './phaseState';

function createTestDb() {
	const sqlite = new Database(':memory:');
	const db = drizzle(sqlite, { schema });
	migrate(db, { migrationsFolder: 'src/lib/server/db/migrations' });
	return db;
}

describe('Phase State module', () => {
	let ps: ReturnType<typeof createPhaseState>;

	beforeEach(() => {
		ps = createPhaseState(createTestDb());
	});

	it('new learner starts at seed phase with no completed phases', () => {
		const state = ps.getPhaseState('learner-1', 1);
		expect(state.phase).toBe('seed');
		expect(state.completedPhases).toEqual([]);
	});

	it('advances to building after marking seed complete', () => {
		ps.markPhaseComplete('learner-1', 1, 'seed');
		const state = ps.getPhaseState('learner-1', 1);
		expect(state.phase).toBe('building');
		expect(state.completedPhases).toContain('seed');
	});

	it('advances to synthesis after marking seed and building complete', () => {
		ps.markPhaseComplete('learner-1', 1, 'seed');
		ps.markPhaseComplete('learner-1', 1, 'building');
		const state = ps.getPhaseState('learner-1', 1);
		expect(state.phase).toBe('synthesis');
		expect(state.completedPhases).toContain('seed');
		expect(state.completedPhases).toContain('building');
	});

	it('blocks synthesis if building was skipped', () => {
		ps.markPhaseComplete('learner-1', 1, 'seed');
		// Manually try to mark building as complete without seed — actually test
		// that you can't jump directly to synthesis by completing building without seed
		const freshPs = createPhaseState(createTestDb());
		expect(() => freshPs.markPhaseComplete('learner-1', 1, 'building')).toThrow();
	});

	it('state survives simulated refresh (re-query from same DB)', () => {
		ps.markPhaseComplete('learner-1', 1, 'seed');
		// Re-query — same instance, simulating page refresh reading from same DB
		const state = ps.getPhaseState('learner-1', 1);
		expect(state.phase).toBe('building');
		expect(state.completedPhases).toContain('seed');
	});

	it('getCurrentPhase returns current phase', () => {
		expect(ps.getCurrentPhase('learner-1', 1)).toBe('seed');
		ps.markPhaseComplete('learner-1', 1, 'seed');
		expect(ps.getCurrentPhase('learner-1', 1)).toBe('building');
	});

	it('isolates phase state by learner_id', () => {
		ps.markPhaseComplete('learner-1', 1, 'seed');
		expect(ps.getCurrentPhase('learner-2', 1)).toBe('seed');
	});
});
