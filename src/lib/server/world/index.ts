import { eq, desc, asc } from 'drizzle-orm';
import type { Db } from '../db/index';
import { characters } from '../db/schema';
import type { Character } from '../db/schema';
import type { CharacterView } from '$lib/types';

export type CharacterUpdateableField = 'name' | 'year' | 'nationality';

export function createWorldState(db: Db) {
	function toView(c: Character): CharacterView {
		return {
			id: c.id,
			is_learner: c.is_learner,
			name: c.name,
			year: c.year,
			nationality: c.nationality
		};
	}

	function getAllCharacters(learnerId: string): CharacterView[] {
		const rows = db
			.select()
			.from(characters)
			.where(eq(characters.learner_id, learnerId))
			.orderBy(desc(characters.is_learner), asc(characters.id))
			.all();
		return rows.map(toView);
	}

	function addCharacter(
		learnerId: string,
		data: { name: string; nationality?: string; year?: string; is_learner?: boolean }
	): CharacterView {
		const inserted = db
			.insert(characters)
			.values({
				learner_id: learnerId,
				is_learner: data.is_learner ?? false,
				name: data.name,
				nationality: data.nationality ?? null,
				year: data.year ?? null
			})
			.returning()
			.get();
		return toView(inserted);
	}

	function updateCharacter(id: number, field: CharacterUpdateableField, value: string): CharacterView {
		const updated = db
			.update(characters)
			.set({ [field]: value })
			.where(eq(characters.id, id))
			.returning()
			.get();
		return toView(updated);
	}

	return { getAllCharacters, addCharacter, updateCharacter };
}

// Default instance using the real database
import { db as realDb } from '../db/index';
export const worldState = createWorldState(realDb);
