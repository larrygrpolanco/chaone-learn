import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../db/schema';
import { createWorldState } from './index';

function createTestDb() {
	const sqlite = new Database(':memory:');
	const db = drizzle(sqlite, { schema });
	migrate(db, { migrationsFolder: 'src/lib/server/db/migrations' });
	return db;
}

describe('World State module', () => {
	let worldState: ReturnType<typeof createWorldState>;

	beforeEach(() => {
		worldState = createWorldState(createTestDb());
	});

	it('returns empty array for a new learner', () => {
		const result = worldState.getAllCharacters('learner-1');
		expect(result).toEqual([]);
	});

	it('adds a learner character with is_learner=true', () => {
		worldState.addCharacter('learner-1', {
			name: 'Larry',
			nationality: '미국 사람',
			year: '2학년',
			is_learner: true
		});
		const result = worldState.getAllCharacters('learner-1');
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Larry');
		expect(result[0].is_learner).toBe(true);
		expect(result[0].nationality).toBe('미국 사람');
	});

	it('orders learner character first', () => {
		worldState.addCharacter('learner-1', { name: 'Classmate A', nationality: '한국 사람' });
		worldState.addCharacter('learner-1', { name: 'Larry', nationality: '미국 사람', is_learner: true });

		const result = worldState.getAllCharacters('learner-1');
		expect(result[0].name).toBe('Larry');
		expect(result[0].is_learner).toBe(true);
		expect(result[1].name).toBe('Classmate A');
	});

	it('updates a character field', () => {
		const created = worldState.addCharacter('learner-1', { name: 'Larry', nationality: '한국 사람' });
		worldState.updateCharacter(created.id, 'nationality', '미국 사람');
		const result = worldState.getAllCharacters('learner-1');
		expect(result[0].nationality).toBe('미국 사람');
	});

	it('isolates characters by learner_id', () => {
		worldState.addCharacter('learner-1', { name: 'Larry' });
		worldState.addCharacter('learner-2', { name: 'Other' });

		expect(worldState.getAllCharacters('learner-1')).toHaveLength(1);
		expect(worldState.getAllCharacters('learner-2')).toHaveLength(1);
		expect(worldState.getAllCharacters('learner-3')).toHaveLength(0);
	});
});
