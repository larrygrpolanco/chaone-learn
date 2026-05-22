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

export type MoveMode = 'author' | 'recall' | 'negotiated';

type MoveBase = {
	id: string;
	lesson: number;
	leadingQuestionEn: string;
	route: string;
	eligible: (world: WorldState) => boolean;
};

export type AuthorMove = MoveBase & {
	mode: 'author';
	steps: MoveStep[];
	confirmation: (facts: Record<string, string>) => string[];
};

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

export type NegotiatedQuestion = {
	targetEntityId: string;
	targetName: string;
	field: string;
	proposal: string;
	promptKr: string;
	isCurrent: boolean;
	options: string[];
	successKrIfYes: string;
};

export type NegotiatedMove = MoveBase & {
	mode: 'negotiated';
	field: string;
	prepare: (world: WorldState) => NegotiatedQuestion;
};

export type SharedAttributeBranch =
	| {
			branch: 'recall_matching';
			x: { id: string; name: string };
			y: { id: string; name: string };
			field: string;
			value: string;
			promptKr: string;
			options: string[];
			successKr: string;
	  }
	| {
			branch: 'author_one_missing';
			known: { id: string; name: string; value: string };
			missing: { id: string; name: string };
			field: string;
			proposal: string;
			promptKr: string;
			options: string[];
			successKr: string;
	  }
	| {
			branch: 'author_both_missing';
			x: { id: string; name: string };
			y: { id: string; name: string };
			field: string;
			stage1PromptKr: string;
			options: string[];
	  };

export type SharedAttributeMove = MoveBase & {
	mode: 'negotiated';
	field: string;
	prepare: (world: WorldState) => SharedAttributeBranch;
};

export type Move = AuthorMove | RecallMove | NegotiatedMove | SharedAttributeMove;
