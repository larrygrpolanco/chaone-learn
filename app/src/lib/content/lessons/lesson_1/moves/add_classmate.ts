import type { AuthorMove } from '../../types';
import { lesson1Manifest } from '../manifest';

export const addClassmate: AuthorMove = {
	id: 'add_classmate',
	lesson: 1,
	mode: 'author',
	leadingQuestionEn: 'A new student joined the class. Who is it?',
	route: '/lessons/1/practice/add-classmate',
	eligible: () => true,

	steps: [
		{ kind: 'free-text', field: 'name', promptKr: '이름이 뭐예요?' },
		{ kind: 'choice', field: 'nationality', promptKr: '어느 나라 사람이에요?' },
		{ kind: 'choice', field: 'year', promptKr: '몇 학년이에요?' }
	],

	confirmation: (facts) => [
		lesson1Manifest.fields.nationality.restate(facts.nationality, facts),
		lesson1Manifest.fields.year.restate(facts.year, facts)
	]
};
