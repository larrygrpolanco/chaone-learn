import { andMarker, topicMarker } from '$lib/korean';
import type { RecallMove } from '../../types';
import { fieldOptions } from '../manifest';
import { buildChoices, matchingPairs, pickRandom } from './_helpers';

const FIELD = 'nationality';

export const recallSharedNationality: RecallMove = {
	id: 'recall_shared_nationality',
	lesson: 1,
	mode: 'recall',
	leadingQuestionsEn: [
		'Are ${name} and ${partner} from the same place?',
		'${name} and ${partner} share a hometown. Where are they from?',
		'${name} and ${partner} have something in common — is it where they’re from?',
		'Do ${name} and ${partner} share a nationality?'
	],
	route: '/lessons/1/practice/recall-shared-nationality',
	field: FIELD,
	eligible: (world) => matchingPairs(world, FIELD).length > 0,
	previewVars: (world) => {
		const pairs = matchingPairs(world, FIELD);
		if (!pairs.length) return null;
		const [a, b] = pairs[0];
		return { name: a.attrs.name, partner: b.attrs.name };
	},
	prepare: (world) => {
		const [a, b] = pickRandom(matchingPairs(world, FIELD));
		const value = a.attrs[FIELD];
		const pairTopic = `${a.attrs.name}${andMarker(a.attrs.name)} ${b.attrs.name}${topicMarker(b.attrs.name)}`;
		return {
			targetEntityId: a.id,
			targetName: `${a.attrs.name} & ${b.attrs.name}`,
			field: FIELD,
			promptKr: `${pairTopic} ____ 사람이에요.`,
			successKr: `${pairTopic} ${value} 사람이에요.`,
			options: buildChoices(value, fieldOptions(FIELD)),
			correct: value
		};
	}
};
