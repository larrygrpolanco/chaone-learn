import { LESSON1_NATIONALITIES, LESSON1_YEARS, isValidNationality, isValidYear } from './scope';

// ── Types ────────────────────────────────────────────────────────────────────

export type AuthoringField = {
	key: string;
	label: string;
	type: 'text' | 'select';
	options?: readonly string[];
	required: boolean;
};

export type ValidationResult = {
	valid: boolean;
	error?: string;
};

export type SeedStep = {
	step: number;
	id: string;
	target: 'learner' | 'classmate';
	field: AuthoringField;
	teacherMessage: string;
	validate: (value: string) => ValidationResult;
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

export type RecallExercise<C extends object = { classmateName: string }> = {
	phase: 'synthesis';
	id: string;
	prompt: (context: C) => string;
	evaluate: (answer: string, correctAnswer: string) => EvaluationResult;
};

// ── Seed Steps ────────────────────────────────────────────────────────────────

/** All 6 Seed-phase steps, in order. */
export const SEED_STEPS: SeedStep[] = [
	{
		step: 1,
		id: 'lesson1.seed.learner-name',
		target: 'learner',
		field: { key: 'value', label: '이름 (Name)', type: 'text', required: true },
		teacherMessage:
			"Welcome to Lesson 1! Every world starts with you — let's add you to the class roster. What's your name?",
		validate: (value) => {
			if (!value.trim()) return { valid: false, error: 'Name is required.' };
			return { valid: true };
		}
	},
	{
		step: 2,
		id: 'lesson1.seed.learner-year',
		target: 'learner',
		field: { key: 'value', label: '학년 (Year)', type: 'select', options: LESSON1_YEARS, required: true },
		teacherMessage: '반가워요! What year are you in?',
		validate: (value) => {
			if (!isValidYear(value)) return { valid: false, error: 'Please select a valid year.' };
			return { valid: true };
		}
	},
	{
		step: 3,
		id: 'lesson1.seed.learner-nationality',
		target: 'learner',
		field: {
			key: 'value',
			label: '국적 (Nationality)',
			type: 'select',
			options: LESSON1_NATIONALITIES,
			required: true
		},
		teacherMessage: 'Almost done with your profile! Where are you from?',
		validate: (value) => {
			if (!isValidNationality(value)) return { valid: false, error: 'Please select a valid nationality.' };
			return { valid: true };
		}
	},
	{
		step: 4,
		id: 'lesson1.seed.classmate-name',
		target: 'classmate',
		field: { key: 'value', label: '이름 (Name)', type: 'text', required: true },
		teacherMessage:
			"You're on the roster! Now let's add a classmate. Use anyone you like — a real friend, a fictional character, whoever. What's their name?",
		validate: (value) => {
			if (!value.trim()) return { valid: false, error: 'Name is required.' };
			return { valid: true };
		}
	},
	{
		step: 5,
		id: 'lesson1.seed.classmate-year',
		target: 'classmate',
		field: { key: 'value', label: '학년 (Year)', type: 'select', options: LESSON1_YEARS, required: true },
		teacherMessage: 'What year are they in?',
		validate: (value) => {
			if (!isValidYear(value)) return { valid: false, error: 'Please select a valid year.' };
			return { valid: true };
		}
	},
	{
		step: 6,
		id: 'lesson1.seed.classmate-nationality',
		target: 'classmate',
		field: {
			key: 'value',
			label: '국적 (Nationality)',
			type: 'select',
			options: LESSON1_NATIONALITIES,
			required: true
		},
		teacherMessage: 'Last step — where are they from? Once you submit, the Building phase unlocks!',
		validate: (value) => {
			if (!isValidNationality(value)) return { valid: false, error: 'Please select a valid nationality.' };
			return { valid: true };
		}
	}
];

// ── Building Exercises ─────────────────────────────────────────────────────────

/** Building: learner adds additional classmates (name, year, nationality) */
export const buildingClassmateExercise: AuthoringExercise = {
	phase: 'building',
	id: 'lesson1.building.classmate',
	fields: [
		{ key: 'name', label: '이름 (Name)', type: 'text', required: true },
		{ key: 'year', label: '학년 (Year)', type: 'select', options: LESSON1_YEARS, required: true },
		{
			key: 'nationality',
			label: '국적 (Nationality)',
			type: 'select',
			options: LESSON1_NATIONALITIES,
			required: true
		}
	]
};

export type UpdateFieldExercise = {
	phase: 'building';
	id: string;
	field: AuthoringField;
	validate: (value: string) => ValidationResult;
};

/** Building: update an existing character's nationality */
export const buildingUpdateNationalityExercise: UpdateFieldExercise = {
	phase: 'building',
	id: 'lesson1.building.update-nationality',
	field: {
		key: 'nationality',
		label: '국적 (Nationality)',
		type: 'select',
		options: LESSON1_NATIONALITIES,
		required: true
	},
	validate: (value) => {
		if (!isValidNationality(value)) return { valid: false, error: 'Please select a valid nationality.' };
		return { valid: true };
	}
};

/** Building: update an existing character's year */
export const buildingUpdateYearExercise: UpdateFieldExercise = {
	phase: 'building',
	id: 'lesson1.building.update-year',
	field: {
		key: 'year',
		label: '학년 (Year)',
		type: 'select',
		options: LESSON1_YEARS,
		required: true
	},
	validate: (value) => {
		if (!isValidYear(value)) return { valid: false, error: 'Please select a valid year.' };
		return { valid: true };
	}
};

// ── Synthesis Exercise ─────────────────────────────────────────────────────────

/** Synthesis: recall a classmate's nationality in Korean */
export const synthesisNationalityExercise: RecallExercise<{ classmateName: string }> = {
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

/** Synthesis: recall a classmate's year in Korean */
export const synthesisYearExercise: RecallExercise<{ classmateName: string }> = {
	phase: 'synthesis',
	id: 'lesson1.synthesis.year',
	prompt: ({ classmateName }) => `${classmateName} 씨는 몇 학년이에요?`,
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

/** Synthesis: recall a classmate's name from nationality and year */
export const synthesisNameExercise: RecallExercise<{ nationality: string; year: string }> = {
	phase: 'synthesis',
	id: 'lesson1.synthesis.name',
	prompt: ({ nationality, year }) => `${year} ${nationality} 학생의 이름이 뭐예요?`,
	evaluate: (answer, correctAnswer) => {
		const trimmed = answer.trim().toLowerCase();
		const correct = trimmed === correctAnswer.trim().toLowerCase();
		return {
			correct,
			correctAnswer,
			feedback: correct
				? '맞아요! 잘 했어요! 🎉'
				: `아니에요. The correct answer is: ${correctAnswer}`
		};
	}
};
