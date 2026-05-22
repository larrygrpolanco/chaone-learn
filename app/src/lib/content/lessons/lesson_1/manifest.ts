import { topicMarker } from '$lib/korean';
import type { LessonManifest } from '../types';

function topic(name: string): string {
	return name ? `${name}${topicMarker(name)}` : '';
}

export const lesson1Manifest: LessonManifest = {
	lessonId: 1,
	titleKr: '인사',
	titleEn: 'Greetings',

	objectives: [
		'greet someone',
		'introduce oneself (name, year, nationality)',
		'describe another person (name, year, nationality)'
	],

	fields: {
		name: {
			values: 'free-text',
			restate: (value) => `이름이 ${value}이에요.`
		},
		nationality: {
			values: ['한국', '미국', '영국', '일본', '중국', '프랑스', '독일', '스페인', '러시아'],
			restate: (value, attrs) => `${topic(attrs.name ?? '')} ${value} 사람이에요.`.trim()
		},
		year: {
			values: ['일학년', '이학년', '삼학년', '사학년'],
			restate: (value, attrs) => `${topic(attrs.name ?? '')} ${value}이에요.`.trim()
		}
	},

	focusAttribute: 'nationality',

	editable: {
		canAddEntities: ['character'],
		canDeleteEntities: ['character'],
		editableFields: ['name', 'year', 'nationality']
	}
};

export function fieldOptions(field: string): readonly string[] {
	const def = lesson1Manifest.fields[field];
	if (!def || def.values === 'free-text') return [];
	return def.values;
}

export function isAllowedValue(field: string, value: string): boolean {
	const def = lesson1Manifest.fields[field];
	if (!def) return false;
	if (def.values === 'free-text') return value.length > 0;
	return def.values.includes(value);
}
