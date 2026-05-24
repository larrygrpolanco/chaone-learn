import { topicMarker } from '$lib/korean';
import type { SetAttributeMove } from '../../types';
import { fieldOptions } from '../manifest';
import { nonProfessorCharacters, shuffle } from './_helpers';

const FIELD = 'nationality';

export const setNationality: SetAttributeMove = {
	id: 'set_nationality',
	lesson: 1,
	mode: 'author',
	variant: 'set',
	leadingQuestionsEn: [
		'We don’t know much about ${name} yet. Where are they from?',
		'${name} is filling out their registration. Where is their hometown?',
		'Let’s establish something about ${name}. Where are they from?',
		'${name} just joined the conversation. Where are they from?'
	],
	route: '/lessons/1/practice/set-nationality',
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
			promptKr: `${topic} 어느 나라 사람이에요?`,
			options: shuffle(fieldOptions(FIELD)).slice(0, 5)
		};
	}
};
