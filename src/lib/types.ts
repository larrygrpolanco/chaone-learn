/** Client-safe view of a character — excludes learner_id. */
export type CharacterView = {
	id: number;
	is_learner: boolean;
	name: string;
	year: string | null;
	nationality: string | null;
};
