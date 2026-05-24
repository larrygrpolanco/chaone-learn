import { andMarker, topicMarker } from '$lib/korean';
import type { RecallMove } from '../../types';
import { fieldOptions } from '../manifest';
import { buildChoices, matchingPairs, pickRandom } from './_helpers';

const FIELD = 'year';

export const recallSharedYear: RecallMove = {
	id: 'recall_shared_year',
	lesson: 1,
	mode: 'recall',
	leadingQuestionsEn: [
		'Are ${name} and ${partner} in the same year?',
		'${name} and ${partner} share a grade — which year are they in?',
		'${name} and ${partner} are studying together. Same year?',
		'Do ${name} and ${partner} match years?'
	],
	route: '/lessons/1/practice/recall-shared-year',
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
			promptKr: `${pairTopic} ____이에요.`,
			successKr: `${pairTopic} ${value}이에요.`,
			options: buildChoices(value, fieldOptions(FIELD)),
			correct: value
		};
	}
};
