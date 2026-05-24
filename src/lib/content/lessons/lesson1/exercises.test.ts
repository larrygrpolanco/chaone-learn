import { describe, it, expect } from 'vitest';
import {
	seedSelfExercise,
	buildingClassmateExercise,
	synthesisNationalityExercise
} from './exercises';

describe('Lesson 1 exercise definitions', () => {
	describe('seedSelfExercise', () => {
		it('is in seed phase', () => {
			expect(seedSelfExercise.phase).toBe('seed');
		});

		it('has required name field', () => {
			const nameField = seedSelfExercise.fields.find((f) => f.key === 'name');
			expect(nameField).toBeDefined();
			expect(nameField?.required).toBe(true);
			expect(nameField?.type).toBe('text');
		});

		it('has required nationality select field', () => {
			const natField = seedSelfExercise.fields.find((f) => f.key === 'nationality');
			expect(natField).toBeDefined();
			expect(natField?.required).toBe(true);
			expect(natField?.type).toBe('select');
			expect(natField?.options?.length).toBeGreaterThan(0);
		});

		it('has required year select field', () => {
			const yearField = seedSelfExercise.fields.find((f) => f.key === 'year');
			expect(yearField).toBeDefined();
			expect(yearField?.required).toBe(true);
			expect(yearField?.type).toBe('select');
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
});
