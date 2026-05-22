import { fail } from '@sveltejs/kit';
import { deleteEntity, getEntity, listEntitiesByKind } from '$lib/server/world/entities';
import { commitAttributeFact, listAttributesForEntity } from '$lib/server/world/facts';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;

const NATIONALITIES = [
	'한국',
	'미국',
	'영국',
	'일본',
	'중국',
	'프랑스',
	'독일',
	'스페인',
	'러시아'
];
const YEARS = ['일학년', '이학년', '삼학년', '사학년'];

const EDITABLE_FIELDS = new Set(['name', 'nationality', 'year']);

function valueAllowed(field: string, value: string): boolean {
	if (field === 'name') return value.length > 0;
	if (field === 'nationality') return NATIONALITIES.includes(value);
	if (field === 'year') return YEARS.includes(value);
	return false;
}

export async function load() {
	const chars = await listEntitiesByKind(DEV_LEARNER, 'character');
	const rows = await Promise.all(
		chars.map(async (c) => ({
			id: c.id,
			source: c.source,
			attrs: await listAttributesForEntity(DEV_LEARNER, c.id)
		}))
	);
	return { rows, nationalities: NATIONALITIES, years: YEARS };
}

export const actions: Actions = {
	edit: async ({ request }) => {
		const data = await request.formData();
		const entityId = String(data.get('entityId') ?? '');
		const field = String(data.get('field') ?? '');
		const value = String(data.get('value') ?? '').trim();

		if (!entityId || !EDITABLE_FIELDS.has(field) || !valueAllowed(field, value)) {
			return fail(400, { error: 'invalid edit', entityId, field, value });
		}

		const entity = await getEntity(DEV_LEARNER, entityId);
		if (!entity || entity.deletedAt) return fail(404, { error: 'no such entity' });

		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field,
			value,
			source: 'learner',
			lessonId: LESSON
		});

		return { ok: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const entityId = String(data.get('entityId') ?? '');
		const entity = await getEntity(DEV_LEARNER, entityId);
		if (!entity) return fail(404, { error: 'no such entity' });
		if (entity.source !== 'learner') {
			return fail(403, { error: 'cannot delete textbook entity' });
		}
		await deleteEntity(DEV_LEARNER, entityId);
		return { ok: true };
	}
};
