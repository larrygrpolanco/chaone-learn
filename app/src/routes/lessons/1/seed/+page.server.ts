import { fail, redirect } from '@sveltejs/kit';
import { topicMarker } from '$lib/korean';
import {
	createEntity,
	getEntity,
	listEntitiesByKind,
	resetLearner
} from '$lib/server/world/entities';
import { commitAttributeFact, listAttributesForEntity } from '$lib/server/world/facts';
import {
	fieldOptions,
	isAllowedValue,
	lesson1Manifest
} from '$lib/content/lessons/lesson_1/manifest';
import { buildChoices } from '$lib/content/lessons/lesson_1/moves/_helpers';
import { lesson1Seed, type SeedStep } from '$lib/content/lessons/lesson_1/seed';
import type { Actions } from './$types';

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;
const GARY_ID = 'char_textbook_gary_l1';

type Speaker = string;

type StepData =
	| {
			kind: 'narrative';
			speaker: Speaker;
			bodyEn?: string;
			promptKr: string;
			subKr?: string;
			cta: string;
	  }
	| {
			kind: 'author_add_student';
			speaker: Speaker;
			bodyEn?: string;
			promptKr: string;
			nationalityOptions: readonly string[];
			yearOptions: readonly string[];
	  }
	| {
			kind: 'recall_inline';
			speaker: Speaker;
			bodyEn?: string;
			setupKr: string;
			targetName: string;
			promptKr: string;
			successKr: string;
			options: string[];
			correct: string;
	  }
	| {
			kind: 'update_inline';
			speaker: Speaker;
			bodyEn?: string;
			targetEntityId: string;
			targetName: string;
			field: 'nationality' | 'year';
			currentValue: string;
			promptKr: string;
			alternateOptions: string[];
	  }
	| {
			kind: 'missing_target';
			speaker: Speaker;
			bodyEn?: string;
			promptKr: string;
	  }
	| { kind: 'wrap'; speaker: Speaker; bodyEn?: string; promptKr: string; cta: string };

function clampStep(raw: string | null): number {
	const n = Number(raw ?? 0);
	if (!Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(lesson1Seed.length - 1, Math.floor(n)));
}

async function pickLatestLearnerCharacter(): Promise<
	{ id: string; attrs: Record<string, string> } | null
> {
	const rows = await listEntitiesByKind(DEV_LEARNER, 'character');
	const learners = rows
		.filter((r) => r.source === 'learner')
		.sort((a, b) => b.createdAt - a.createdAt);
	for (const row of learners) {
		const attrs = await listAttributesForEntity(DEV_LEARNER, row.id);
		if (attrs.name) return { id: row.id, attrs };
	}
	return null;
}

// Gary is textbook canon for lesson 1's seed (the update beat targets him).
// Idempotent: only writes on first load when he doesn't yet exist.
async function ensureGary(): Promise<{ id: string; attrs: Record<string, string> }> {
	const existing = await getEntity(DEV_LEARNER, GARY_ID);
	if (!existing) {
		await createEntity({
			id: GARY_ID,
			learnerId: DEV_LEARNER,
			kind: 'character',
			source: 'textbook',
			createdInLesson: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId: GARY_ID,
			field: 'name',
			value: '게리',
			source: 'textbook',
			lessonId: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId: GARY_ID,
			field: 'year',
			value: '일학년',
			source: 'textbook',
			lessonId: LESSON
		});
	}
	const attrs = await listAttributesForEntity(DEV_LEARNER, GARY_ID);
	return { id: GARY_ID, attrs };
}

function buildStepData(
	def: SeedStep,
	ctx: {
		latest: { id: string; attrs: Record<string, string> } | null;
		gary: { id: string; attrs: Record<string, string> };
	}
): StepData {
	switch (def.kind) {
		case 'narrative':
			return {
				kind: 'narrative',
				speaker: def.speaker,
				bodyEn: def.bodyEn,
				promptKr: def.promptKr,
				subKr: def.subKr,
				cta: def.cta
			};
		case 'author_add_student':
			return {
				kind: 'author_add_student',
				speaker: def.speaker,
				bodyEn: def.bodyEn,
				promptKr: def.promptKr,
				nationalityOptions: fieldOptions('nationality'),
				yearOptions: fieldOptions('year')
			};
		case 'recall_inline': {
			if (!ctx.latest || !ctx.latest.attrs[def.field]) {
				return {
					kind: 'missing_target',
					speaker: def.speaker,
					bodyEn: def.bodyEn,
					promptKr: '아직 학생이 없어요.'
				};
			}
			const name = ctx.latest.attrs.name;
			const value = ctx.latest.attrs[def.field];
			const topic = `${name}${topicMarker(name)}`;
			const promptKr =
				def.field === 'nationality'
					? `${topic} 어느 나라 사람이에요?`
					: `${topic} 몇 학년이에요?`;
			return {
				kind: 'recall_inline',
				speaker: def.speaker,
				bodyEn: def.bodyEn,
				setupKr: def.setupKr,
				targetName: name,
				promptKr,
				successKr: lesson1Manifest.fields[def.field].restate(value, ctx.latest.attrs),
				options: buildChoices(value, fieldOptions(def.field)),
				correct: value
			};
		}
		case 'update_inline': {
			// Gary is the only update target in this seed.
			const target = ctx.gary;
			if (!target.attrs[def.field]) {
				return {
					kind: 'missing_target',
					speaker: def.speaker,
					bodyEn: def.bodyEn,
					promptKr: '아직 학생이 없어요.'
				};
			}
			const name = target.attrs.name;
			const currentValue = target.attrs[def.field];
			const topic = `${name}${topicMarker(name)}`;
			const promptKr =
				def.field === 'nationality'
					? `${topic} ${currentValue} 사람이에요?`
					: `${topic} ${currentValue}이에요?`;
			return {
				kind: 'update_inline',
				speaker: def.speaker,
				bodyEn: def.bodyEn,
				targetEntityId: target.id,
				targetName: name,
				field: def.field,
				currentValue,
				promptKr,
				alternateOptions: fieldOptions(def.field).filter((v) => v !== currentValue)
			};
		}
		case 'wrap':
			return {
				kind: 'wrap',
				speaker: def.speaker,
				bodyEn: def.bodyEn,
				promptKr: def.promptKr,
				cta: def.cta
			};
	}
}

export async function load({ url }: { url: URL }) {
	const step = clampStep(url.searchParams.get('step'));
	const def = lesson1Seed[step];
	// Landing on step 0 restarts the seed: wipe and re-seed Gary.
	// Keeps the flow deterministic — no ghost students from prior runs.
	if (step === 0) await resetLearner(DEV_LEARNER);
	const gary = await ensureGary();
	const latest = await pickLatestLearnerCharacter();
	const stepData = buildStepData(def, { latest, gary });

	return {
		step,
		totalSteps: lesson1Seed.length,
		nextStep: Math.min(step + 1, lesson1Seed.length - 1),
		isLast: step === lesson1Seed.length - 1,
		stepData
	};
}

export const actions: Actions = {
	addStudent: async ({ request, url }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const nationality = String(data.get('nationality') ?? '').trim();
		const year = String(data.get('year') ?? '').trim();

		if (!isAllowedValue('name', name)) return fail(400, { error: 'invalid name' });
		if (!isAllowedValue('nationality', nationality))
			return fail(400, { error: 'invalid nationality' });
		if (!isAllowedValue('year', year)) return fail(400, { error: 'invalid year' });

		const entityId = `char_learner_${crypto.randomUUID().slice(0, 8)}`;
		await createEntity({
			id: entityId,
			learnerId: DEV_LEARNER,
			kind: 'character',
			source: 'learner',
			createdInLesson: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field: 'name',
			value: name,
			source: 'learner',
			lessonId: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field: 'nationality',
			value: nationality,
			source: 'learner',
			lessonId: LESSON
		});
		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field: 'year',
			value: year,
			source: 'learner',
			lessonId: LESSON
		});

		throw redirect(303, advance(url));
	},
	updateCommit: async ({ request, url }) => {
		const data = await request.formData();
		const entityId = String(data.get('entityId') ?? '');
		const field = String(data.get('field') ?? '');
		const value = String(data.get('value') ?? '').trim();

		if (!entityId) return fail(400, { error: 'missing entity' });
		if (field !== 'nationality' && field !== 'year') return fail(400, { error: 'bad field' });
		if (!isAllowedValue(field, value)) return fail(400, { error: 'invalid value' });

		await commitAttributeFact({
			learnerId: DEV_LEARNER,
			entityId,
			field,
			value,
			source: 'learner',
			lessonId: LESSON
		});

		throw redirect(303, advance(url));
	}
};

function advance(url: URL): string {
	const step = clampStep(url.searchParams.get('step'));
	const next = Math.min(step + 1, lesson1Seed.length - 1);
	return `/lessons/1/seed?step=${next}`;
}
