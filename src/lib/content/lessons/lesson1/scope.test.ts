import { describe, it, expect } from 'vitest';
import {
	LESSON1_NATIONALITIES,
	LESSON1_YEARS,
	isValidNationality,
	isValidYear
} from './scope';

describe('Lesson 1 Scope', () => {
	describe('isValidNationality', () => {
		it('accepts all lesson 1 nationalities', () => {
			for (const nat of LESSON1_NATIONALITIES) {
				expect(isValidNationality(nat), `should accept "${nat}"`).toBe(true);
			}
		});

		it('rejects out-of-scope nationalities', () => {
			expect(isValidNationality('독일 사람')).toBe(false);
			expect(isValidNationality('이탈리아 사람')).toBe(false);
			expect(isValidNationality('American')).toBe(false);
			expect(isValidNationality('')).toBe(false);
		});
	});

	describe('isValidYear', () => {
		it('accepts all lesson 1 years', () => {
			for (const year of LESSON1_YEARS) {
				expect(isValidYear(year), `should accept "${year}"`).toBe(true);
			}
		});

		it('rejects invalid years', () => {
			expect(isValidYear('5학년')).toBe(false);
			expect(isValidYear('sophomore')).toBe(false);
			expect(isValidYear('학년')).toBe(false);
			expect(isValidYear('')).toBe(false);
		});
	});
});
