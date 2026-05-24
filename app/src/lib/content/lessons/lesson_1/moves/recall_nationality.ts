import { topicMarker } from '$lib/korean';
import type { RecallMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import { buildChoices, charactersWithField, pickRandom } from './_helpers';

export const recallNationality: RecallMove = {
	id: 'recall_nationality',
	lesson: 1,
	mode: 'recall',
	leadingQuestionsEn: [
		'Remind me about ${name}. Where is their hometown?',
		'Let’s check in with ${name} for a moment. Where are they from?',
		'${name} is introducing themselves. Where are they from?',
		'I’m looking at the class roster. Where is ${name} from again?'
	],
	route: '/lessons/1/practice/recall-nationality',
	field: 'nationality',
	eligible: (world) => charactersWithField(world, 'nationality').length > 0,
	previewTargetName: (world) => {
		const havers = charactersWithField(world, 'nationality');
		return havers.length ? havers[0].attrs.name : null;
	},
	prepare: (world) => {
		const target = pickRandom(charactersWithField(world, 'nationality'));
		const correct = target.attrs.nationality;
		const subject = `${target.attrs.name} 씨${topicMarker(target.attrs.name + ' 씨')}`;
		return {
			targetEntityId: target.id,
			targetName: target.attrs.name,
			field: 'nationality',
			promptKr: `${subject} 어느 나라 사람이에요?`,
			successKr: lesson1Manifest.fields.nationality.restate(correct, target.attrs),
			options: buildChoices(correct, fieldOptions('nationality')),
			correct
		};
	}
};
