import { LESSON1_NATIONALITIES, LESSON1_YEARS } from './scope';

// ── Types ────────────────────────────────────────────────────────────────────

export type AuthoringField = {
	key: string;
	label: string;
	type: 'text' | 'select';
	options?: readonly string[];
	required: boolean;
};

export type AuthoringExercise = {
	phase: 'seed' | 'building';
	id: string;
	fields: AuthoringField[];
};

export type EvaluationResult = {
	correct: boolean;
	correctAnswer: string;
	feedback: string;
};

export type RecallExercise = {
	phase: 'synthesis';
	id: string;
	prompt: (context: { classmateName: string }) => string;
	evaluate: (answer: string, correctAnswer: string) => EvaluationResult;
};

// ── Exercises ─────────────────────────────────────────────────────────────────

/** Seed: learner enters their own info */
export const seedSelfExercise: AuthoringExercise = {
	phase: 'seed',
	id: 'lesson1.seed.self',
	fields: [
		{ key: 'name', label: '이름 (Name)', type: 'text', required: true },
		{
			key: 'nationality',
			label: '국적 (Nationality)',
			type: 'select',
			options: LESSON1_NATIONALITIES,
			required: true
		},
		{
			key: 'year',
			label: '학년 (Year)',
			type: 'select',
			options: LESSON1_YEARS,
			required: true
		}
	]
};

/** Building: learner adds a classmate */
export const buildingClassmateExercise: AuthoringExercise = {
	phase: 'building',
	id: 'lesson1.building.classmate',
	fields: [
		{ key: 'name', label: '이름 (Name)', type: 'text', required: true },
		{
			key: 'nationality',
			label: '국적 (Nationality)',
			type: 'select',
			options: LESSON1_NATIONALITIES,
			required: true
		}
	]
};

/** Synthesis: recall a classmate's nationality in Korean */
export const synthesisNationalityExercise: RecallExercise = {
	phase: 'synthesis',
	id: 'lesson1.synthesis.nationality',
	prompt: ({ classmateName }) => `${classmateName} 씨는 어느 나라 사람이에요?`,
	evaluate: (answer, correctAnswer) => {
		const trimmed = answer.trim();
		const correct = trimmed === correctAnswer;
		return {
			correct,
			correctAnswer,
			feedback: correct
				? '맞아요! 잘 했어요! 🎉'
				: `아니에요. The correct answer is: ${correctAnswer}`
		};
	}
};
