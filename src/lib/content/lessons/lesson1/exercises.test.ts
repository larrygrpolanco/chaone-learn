import { describe, it, expect } from 'vitest';
import {
	SEED_STEPS,
	buildingClassmateExercise,
	synthesisNationalityExercise
} from './exercises';
import { LESSON1_NATIONALITIES, LESSON1_YEARS } from './scope';

describe('SEED_STEPS', () => {
	it('has exactly 6 steps', () => {
		expect(SEED_STEPS).toHaveLength(6);
	});

	it('steps are numbered 1–6 in order', () => {
		SEED_STEPS.forEach((s, i) => expect(s.step).toBe(i + 1));
	});

	it('steps 1 and 4 target text fields', () => {
		expect(SEED_STEPS[0].field.type).toBe('text');
		expect(SEED_STEPS[3].field.type).toBe('text');
	});

	it('steps 2, 3, 5, 6 target select fields', () => {
		[1, 2, 4, 5].forEach((i) => expect(SEED_STEPS[i].field.type).toBe('select'));
	});

	it('year steps (2, 5) reference LESSON1_YEARS options', () => {
		expect(SEED_STEPS[1].field.options).toEqual(LESSON1_YEARS);
		expect(SEED_STEPS[4].field.options).toEqual(LESSON1_YEARS);
	});

	it('nationality steps (3, 6) reference LESSON1_NATIONALITIES options', () => {
		expect(SEED_STEPS[2].field.options).toEqual(LESSON1_NATIONALITIES);
		expect(SEED_STEPS[5].field.options).toEqual(LESSON1_NATIONALITIES);
	});

	it('each step has a non-empty teacherMessage', () => {
		SEED_STEPS.forEach((s) => expect(s.teacherMessage.trim().length).toBeGreaterThan(0));
	});

	describe('step 1 validate (learner name)', () => {
		const { validate } = SEED_STEPS[0];

		it('accepts a valid name', () => {
			expect(validate('Larry').valid).toBe(true);
		});

		it('rejects an empty string', () => {
			const result = validate('');
			expect(result.valid).toBe(false);
			expect(result.error).toBeDefined();
		});

		it('rejects whitespace-only input', () => {
			expect(validate('   ').valid).toBe(false);
		});
	});

	describe('step 2 validate (learner year)', () => {
		const { validate } = SEED_STEPS[1];

		it('accepts a valid year', () => {
			expect(validate('2학년').valid).toBe(true);
		});

		it('rejects an invalid year string', () => {
			expect(validate('5학년').valid).toBe(false);
		});

		it('rejects empty input', () => {
			expect(validate('').valid).toBe(false);
		});
	});

	describe('step 3 validate (learner nationality)', () => {
		const { validate } = SEED_STEPS[2];

		it('accepts a valid nationality', () => {
			expect(validate('미국 사람').valid).toBe(true);
		});

		it('rejects an invalid nationality string', () => {
			expect(validate('독일 사람').valid).toBe(false);
		});
	});

	describe('step 4 validate (classmate name)', () => {
		const { validate } = SEED_STEPS[3];

		it('accepts a valid name', () => {
			expect(validate('민준').valid).toBe(true);
		});

		it('rejects an empty string', () => {
			expect(validate('').valid).toBe(false);
		});
	});

	describe('step 5 validate (classmate year)', () => {
		const { validate } = SEED_STEPS[4];

		it('accepts a valid year', () => {
			expect(validate('1학년').valid).toBe(true);
		});

		it('rejects an invalid year', () => {
			expect(validate('invalid').valid).toBe(false);
		});
	});

	describe('step 6 validate (classmate nationality)', () => {
		const { validate } = SEED_STEPS[5];

		it('accepts a valid nationality', () => {
			expect(validate('한국 사람').valid).toBe(true);
		});

		it('rejects an invalid nationality', () => {
			expect(validate('').valid).toBe(false);
		});
	});
});

describe('buildingClassmateExercise', () => {
	it('is in building phase', () => {
		expect(buildingClassmateExercise.phase).toBe('building');
	});

	it('has required name field', () => {
		const nameField = buildingClassmateExercise.fields.find((f) => f.key === 'name');
		expect(nameField?.required).toBe(true);
	});

	it('has required nationality field', () => {
		const natField = buildingClassmateExercise.fields.find((f) => f.key === 'nationality');
		expect(natField?.required).toBe(true);
	});
});

describe('synthesisNationalityExercise', () => {
	it('is in synthesis phase', () => {
		expect(synthesisNationalityExercise.phase).toBe('synthesis');
	});

	it('generates correct prompt with classmate name', () => {
		const prompt = synthesisNationalityExercise.prompt({ classmateName: '민준' });
		expect(prompt).toBe('민준 씨는 어느 나라 사람이에요?');
	});

	it('returns correct=true for exact match', () => {
		const result = synthesisNationalityExercise.evaluate('미국 사람', '미국 사람');
		expect(result.correct).toBe(true);
	});

	it('trims whitespace before evaluating', () => {
		const result = synthesisNationalityExercise.evaluate('  미국 사람  ', '미국 사람');
		expect(result.correct).toBe(true);
	});

	it('returns correct=false for spacing difference', () => {
		const result = synthesisNationalityExercise.evaluate('미국사람', '미국 사람');
		expect(result.correct).toBe(false);
	});

	it('returns correct=false for wrong nationality, includes correctAnswer', () => {
		const result = synthesisNationalityExercise.evaluate('독일 사람', '미국 사람');
		expect(result.correct).toBe(false);
		expect(result.correctAnswer).toBe('미국 사람');
	});
});
