import { topicMarker } from '$lib/korean';
import type { UpdateAttributeMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import { charactersWithField, pickRandom, shuffle } from './_helpers';

const FIELD = 'nationality';

export const updateNationality: UpdateAttributeMove = {
	id: 'update_nationality',
	lesson: 1,
	mode: 'author',
	variant: 'update',
	leadingQuestionsEn: [
		'Let me double-check something. Was ${name} from Japan?',
		'Someone mentioned ${name}’s hometown. Let’s confirm where it is.',
		'Gary thinks he knows where ${name} is from. Is he right?',
		'Let’s make sure we have ${name}’s nationality right.'
	],
	route: '/lessons/1/practice/update-nationality',
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
			promptKr: `${topic} ${current} 사람이에요?`,
			options: shuffle(pool.filter((v) => v !== current)).slice(0, 4),
			successKrIfYes: lesson1Manifest.fields[FIELD].restate(current, target.attrs)
		};
	}
};
