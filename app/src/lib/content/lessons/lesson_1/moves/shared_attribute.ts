import { andMarker, topicMarker } from '$lib/korean';
import type { SharedAttributeMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import {
	buildChoices,
	nonProfessorCharacters,
	pickRandom,
	shuffle,
	viableSharedPairs
} from './_helpers';

const FIELD = lesson1Manifest.focusAttribute;

export const sharedAttribute: SharedAttributeMove = {
	id: 'shared_attribute',
	lesson: 1,
	mode: 'negotiated',
	leadingQuestionEn: 'These two share something. What is it?',
	route: '/lessons/1/practice/shared-attribute',
	field: FIELD,
	eligible: (world) =>
		viableSharedPairs(nonProfessorCharacters(world), FIELD).length > 0,
	prepare: (world) => {
		const pairs = viableSharedPairs(nonProfessorCharacters(world), FIELD);
		const [a, b] = pickRandom(pairs);
		const av = a.attrs[FIELD];
		const bv = b.attrs[FIELD];
		const pool = fieldOptions(FIELD);

		if (av && bv) {
			// recall_matching — both defined, equal (by viable-pair filter)
			const value = av;
			const promptKr = `${a.attrs.name}${andMarker(a.attrs.name)} ${b.attrs.name}${topicMarker(b.attrs.name)} ${value} 사람이에요?`;
			return {
				branch: 'recall_matching',
				x: { id: a.id, name: a.attrs.name },
				y: { id: b.id, name: b.attrs.name },
				field: FIELD,
				value,
				promptKr,
				options: buildChoices(value, pool),
				successKr: `${a.attrs.name}${andMarker(a.attrs.name)} ${b.attrs.name}${topicMarker(b.attrs.name)} ${value} 사람이에요.`
			};
		}

		if (av || bv) {
			// author_one_missing — presupposition: they share
			const [known, missing] = av ? [a, b] : [b, a];
			const value = known.attrs[FIELD];
			const knownTopic = `${known.attrs.name}${topicMarker(known.attrs.name)}`;
			return {
				branch: 'author_one_missing',
				known: { id: known.id, name: known.attrs.name, value },
				missing: { id: missing.id, name: missing.attrs.name },
				field: FIELD,
				proposal: value,
				promptKr: `${knownTopic} ${value} 사람이에요. ${missing.attrs.name}도 ${value} 사람이에요?`,
				options: shuffle(pool.filter((v) => v !== value)).slice(0, 4),
				successKr: lesson1Manifest.fields[FIELD].restate(value, missing.attrs)
			};
		}

		// author_both_missing — two stages, client-managed
		const xTopic = `${a.attrs.name}${topicMarker(a.attrs.name)}`;
		return {
			branch: 'author_both_missing',
			x: { id: a.id, name: a.attrs.name },
			y: { id: b.id, name: b.attrs.name },
			field: FIELD,
			stage1PromptKr: `${xTopic} 어느 나라 사람이에요?`,
			options: shuffle([...pool]).slice(0, 4)
		};
	}
};
