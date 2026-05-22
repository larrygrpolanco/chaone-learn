import { topicMarker } from '$lib/korean';
import type { NegotiatedMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import {
	nonProfessorCharacters,
	pickRandom,
	shuffle,
	type CharacterRow
} from './_helpers';

const FIELD = 'nationality';
const WRONG_PROPOSAL_PROBABILITY = 0.2;

type CharRow = CharacterRow;

export const negotiateNationality: NegotiatedMove = {
	id: 'negotiate_nationality',
	lesson: 1,
	mode: 'negotiated',
	leadingQuestionEn: 'Did I hear right about this person?',
	route: '/lessons/1/practice/negotiate-nationality',
	field: FIELD,
	eligible: (world) => nonProfessorCharacters(world).length > 0,
	prepare: (world) => {
		const chars = nonProfessorCharacters(world);
		const lackers = chars.filter((c) => !c.attrs[FIELD]);
		const havers = chars.filter((c) => c.attrs[FIELD]);
		const pool = fieldOptions(FIELD);

		const goWrong =
			havers.length > 0 &&
			(lackers.length === 0 || Math.random() < WRONG_PROPOSAL_PROBABILITY);

		let target: CharRow;
		let proposal: string;
		if (goWrong) {
			target = pickRandom(havers);
			const current = target.attrs[FIELD];
			proposal = pickRandom(pool.filter((v) => v !== current));
		} else {
			target = pickRandom(lackers);
			proposal = pickRandom([...pool]);
		}

		const topic = `${target.attrs.name}${topicMarker(target.attrs.name)}`;
		return {
			targetEntityId: target.id,
			targetName: target.attrs.name,
			field: FIELD,
			proposal,
			promptKr: `${topic} ${proposal} 사람이에요?`,
			isCurrent: target.attrs[FIELD] === proposal,
			options: shuffle(pool.filter((v) => v !== proposal)).slice(0, 4),
			successKrIfYes: lesson1Manifest.fields[FIELD].restate(proposal, target.attrs)
		};
	}
};
