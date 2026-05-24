import { topicMarker } from '$lib/korean';
import type { SetAttributeMove } from '../../types';
import { fieldOptions } from '../manifest';
import { nonProfessorCharacters } from './_helpers';

const FIELD = 'year';

export const setYear: SetAttributeMove = {
	id: 'set_year',
	lesson: 1,
	mode: 'author',
	variant: 'set',
	leadingQuestionsEn: [
		'We don’t know much about ${name} yet. What year are they?',
		'${name} is looking for their class. What year are they in?',
		'Let’s establish something about ${name}. Are they a freshman?',
		'${name} is holding a textbook. What year is it for?'
	],
	route: '/lessons/1/practice/set-year',
	field: FIELD,
	eligible: (world) => nonProfessorCharacters(world).some((c) => !c.attrs[FIELD]),
	previewTargetName: (world) => {
		const lackers = nonProfessorCharacters(world).filter((c) => !c.attrs[FIELD]);
		return lackers.length ? lackers[0].attrs.name : null;
	},
	prepare: (world) => {
		const lackers = nonProfessorCharacters(world).filter((c) => !c.attrs[FIELD]);
		const target = lackers[Math.floor(Math.random() * lackers.length)];
		const name = target.attrs.name;
		const topic = `${name}${topicMarker(name)}`;
		return {
			targetEntityId: target.id,
			targetName: name,
			field: FIELD,
			promptKr: `${topic} 몇 학년이에요?`,
			options: [...fieldOptions(FIELD)]
		};
	}
};
