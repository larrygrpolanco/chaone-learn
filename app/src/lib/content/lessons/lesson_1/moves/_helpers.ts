import type { WorldState } from '../../types';

// Lesson 1 grammar doesn't cover honorifics (선생님), so titled characters
// are excluded from the recall pool. When honorifics arrive in a later lesson
// the check moves out of here.
export function isProfessor(name: string | undefined): boolean {
	return !!name && name.includes('선생님');
}

export type CharacterRow = { id: string; attrs: Record<string, string> };

export function nonProfessorCharacters(world: WorldState): CharacterRow[] {
	return world.entities
		.filter((e) => e.kind === 'character')
		.map((e) => ({ id: e.id, attrs: world.attrsByEntity[e.id] ?? {} }))
		.filter((c) => c.attrs.name && !isProfessor(c.attrs.name));
}

export function charactersWithField(world: WorldState, field: string): CharacterRow[] {
	return nonProfessorCharacters(world).filter((c) => c.attrs[field]);
}

export function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function buildChoices(correct: string, pool: readonly string[], n = 4): string[] {
	const distractors = shuffle(pool.filter((v) => v !== correct)).slice(0, n - 1);
	return shuffle([correct, ...distractors]);
}

export type Pair = [CharacterRow, CharacterRow];

// All pairs (X, Y) where both have `field` set and the values match.
export function matchingPairs(world: WorldState, field: string): Pair[] {
	const chars = charactersWithField(world, field);
	const pairs: Pair[] = [];
	for (let i = 0; i < chars.length; i++) {
		for (let j = i + 1; j < chars.length; j++) {
			if (chars[i].attrs[field] === chars[j].attrs[field]) {
				pairs.push([chars[i], chars[j]]);
			}
		}
	}
	return pairs;
}
