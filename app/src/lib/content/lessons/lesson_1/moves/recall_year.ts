import { topicMarker } from '$lib/korean';
import type { RecallMove } from '../../types';
import { fieldOptions, lesson1Manifest } from '../manifest';
import { buildChoices, charactersWithField, pickRandom } from './_helpers';

export const recallYear: RecallMove = {
	id: 'recall_year',
	lesson: 1,
	mode: 'recall',
	leadingQuestionsEn: [
		'Remind me about ${name}. What year are they in?',
		'${name} is sitting near the front. What year are they?',
		'Let’s check in with ${name}. Are they a freshman?',
		'I’m updating my notes. What year is ${name} again?'
	],
	route: '/lessons/1/practice/recall-year',
	field: 'year',
	eligible: (world) => charactersWithField(world, 'year').length > 0,
	previewTargetName: (world) => {
		const havers = charactersWithField(world, 'year');
		return havers.length ? havers[0].attrs.name : null;
	},
	prepare: (world) => {
		const target = pickRandom(charactersWithField(world, 'year'));
		const correct = target.attrs.year;
		const subject = `${target.attrs.name} 씨${topicMarker(target.attrs.name + ' 씨')}`;
		return {
			targetEntityId: target.id,
			targetName: target.attrs.name,
			field: 'year',
			promptKr: `${subject} 몇 학년이에요?`,
			successKr: lesson1Manifest.fields.year.restate(correct, target.attrs),
			options: buildChoices(correct, fieldOptions('year')),
			correct
		};
	}
};
