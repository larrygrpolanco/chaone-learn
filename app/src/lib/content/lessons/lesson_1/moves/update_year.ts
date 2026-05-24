import { topicMarker } from '$lib/korean';
import type { UpdateAttributeMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import { charactersWithField, pickRandom, shuffle } from './_helpers';

const FIELD = 'year';

export const updateYear: UpdateAttributeMove = {
	id: 'update_year',
	lesson: 1,
	mode: 'author',
	variant: 'update',
	leadingQuestionsEn: [
		'Gary thinks ${name} is a freshman. Let’s see if he’s right.',
		'Let me double-check something. What year is ${name}?',
		'Someone mentioned ${name}’s year. Let’s confirm it.',
		'Let’s make sure we have ${name}’s year right in the notes.'
	],
	route: '/lessons/1/practice/update-year',
	field: FIELD,
	eligible: (world) => charactersWithField(world, FIELD).length > 0,
	previewTargetName: (world) => {
		const havers = charactersWithField(world, FIELD);
		return havers.length ? havers[0].attrs.name : null;
	},
	prepare: (world) => {
		const target = pickRandom(charactersWithField(world, FIELD));
		const current = target.attrs[FIELD];
		const topic = `${target.attrs.name}${topicMarker(target.attrs.name)}`;
		const pool = fieldOptions(FIELD);
		return {
			targetEntityId: target.id,
			targetName: target.attrs.name,
			field: FIELD,
			currentValue: current,
			promptKr: `${topic} ${current}이에요?`,
			options: shuffle(pool.filter((v) => v !== current)).slice(0, 4),
			successKrIfYes: lesson1Manifest.fields[FIELD].restate(current, target.attrs)
		};
	}
};
