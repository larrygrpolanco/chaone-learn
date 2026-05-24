import { describe, it, expect } from 'vitest';
import { getSeedProgress } from './seedProgress';
import type { CharacterView } from '$lib/types';

function learner(overrides: Partial<CharacterView> = {}): CharacterView {
	return { id: 1, is_learner: true, name: 'Larry', year: null, nationality: null, ...overrides };
}

function classmate(overrides: Partial<CharacterView> = {}): CharacterView {
	return { id: 2, is_learner: false, name: '민준', year: null, nationality: null, ...overrides };
}

describe('getSeedProgress', () => {
	it('returns 1 when no characters exist', () => {
		expect(getSeedProgress([])).toBe(1);
	});

	it('returns 2 when learner exists but has no year', () => {
		expect(getSeedProgress([learner()])).toBe(2);
	});

	it('returns 3 when learner has year but no nationality', () => {
		expect(getSeedProgress([learner({ year: '2학년' })])).toBe(3);
	});

	it('returns 4 when learner is fully populated but no classmate exists', () => {
		expect(getSeedProgress([learner({ year: '2학년', nationality: '미국 사람' })])).toBe(4);
	});

	it('returns 5 when classmate exists but has no year', () => {
		expect(
			getSeedProgress([learner({ year: '2학년', nationality: '미국 사람' }), classmate()])
		).toBe(5);
	});

	it('returns 6 when classmate has year but no nationality', () => {
		expect(
			getSeedProgress([
				learner({ year: '2학년', nationality: '미국 사람' }),
				classmate({ year: '1학년' })
			])
		).toBe(6);
	});

	it('returns complete when both learner and classmate are fully populated', () => {
		expect(
			getSeedProgress([
				learner({ year: '2학년', nationality: '미국 사람' }),
				classmate({ year: '1학년', nationality: '한국 사람' })
			])
		).toBe('complete');
	});
});
