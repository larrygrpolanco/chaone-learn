export type FieldValues = 'free-text' | readonly string[];

export type FieldDef = {
	values: FieldValues;
	restate: (value: string, attrs: Record<string, string>) => string;
};

export type LessonManifest = {
	lessonId: number;
	titleKr: string;
	titleEn: string;
	objectives: string[];
	fields: Record<string, FieldDef>;
	focusAttribute: string;
	editable: {
		canAddEntities: string[];
		canDeleteEntities: string[];
		editableFields: string[];
	};
};

export type WorldEntity = {
	id: string;
	kind: string;
	source: 'textbook' | 'learner';
};

export type WorldState = {
	entities: WorldEntity[];
	attrsByEntity: Record<string, Record<string, string>>;
};

export type MoveStep =
	| { kind: 'free-text'; field: string; promptKr: string }
	| { kind: 'choice'; field: string; promptKr: string };

export type MoveMode = 'author' | 'recall';

type MoveBase = {
	id: string;
	lesson: number;
	leadingQuestionsEn: string[];
	route: string;
	eligible: (world: WorldState) => boolean;
	previewTargetName?: (world: WorldState) => string | null;
	previewVars?: (world: WorldState) => Record<string, string> | null;
};

// --- Author variants ----------------------------------------------------

export type StepsAuthorMove = MoveBase & {
	mode: 'author';
	variant: 'steps';
	steps: MoveStep[];
	confirmation: (facts: Record<string, string>) => string[];
};

export type SetAttributeQuestion = {
	targetEntityId: string;
	targetName: string;
	field: string;
	promptKr: string;
	options: string[];
};

export type SetAttributeMove = MoveBase & {
	mode: 'author';
	variant: 'set';
	field: string;
	prepare: (world: WorldState) => SetAttributeQuestion;
};

export type UpdateAttributeQuestion = {
	targetEntityId: string;
	targetName: string;
	field: string;
	currentValue: string;
	promptKr: string;
	options: string[];
	successKrIfYes: string;
};

export type UpdateAttributeMove = MoveBase & {
	mode: 'author';
	variant: 'update';
	field: string;
	prepare: (world: WorldState) => UpdateAttributeQuestion;
};

export type AuthorMove = StepsAuthorMove | SetAttributeMove | UpdateAttributeMove;

// --- Recall -------------------------------------------------------------

export type RecallQuestion = {
	targetEntityId: string;
	targetName: string;
	field: string;
	promptKr: string;
	successKr: string;
	options: string[];
	correct: string;
};

export type RecallMove = MoveBase & {
	mode: 'recall';
	field: string;
	prepare: (world: WorldState) => RecallQuestion;
};

export type Move = AuthorMove | RecallMove;
