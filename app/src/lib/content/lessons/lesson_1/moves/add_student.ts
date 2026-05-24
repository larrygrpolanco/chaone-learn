import type { StepsAuthorMove } from '../../types';
import { lesson1Manifest } from '../manifest';

export const addStudent: StepsAuthorMove = {
	id: 'add_student',
	lesson: 1,
	mode: 'author',
	variant: 'steps',
	leadingQuestionsEn: [
		'Someone new just walked into the classroom. Who is it?',
		'There’s an empty desk in the back. Who sits there?',
		"The roster has a new name on it. Let's add them."
	],
	route: '/lessons/1/practice/add-student',
	eligible: () => true,

	steps: [{ kind: 'free-text', field: 'name', promptKr: '이름이 뭐예요?' }],

	confirmation: (facts) => [lesson1Manifest.fields.name.restate(facts.name, facts)]
};
