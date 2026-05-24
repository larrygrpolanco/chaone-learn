import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { and, eq, isNull } from 'drizzle-orm';
import * as schema from '../src/lib/server/db/schema.ts';
import { learners, entities, attributeFacts } from '../src/lib/server/db/schema.ts';

const url = process.env.DATABASE_URL ?? 'file:local.db';
const client = createClient({ url });
const db = drizzle(client, { schema });

const DEV_LEARNER = 'dev_learner';
const LESSON = 1;
const now = Date.now();

const textbookCharacters: { id: string; facts: Record<string, string> }[] = [
	{
		id: 'char_prof_lee',
		facts: { name: '이 선생님', nationality: '한국' }
	},
	{
		id: 'char_steve',
		facts: { name: '스티브', nationality: '미국', year: '삼학년' }
	},
	{
		id: 'char_youngmee',
		facts: { name: '영미', nationality: '한국', year: '일학년' }
	},
	{
		id: 'char_michael',
		facts: { name: '마이클', nationality: '한국', year: '일학년' }
	},
	{
		// Sandy's `year` is intentionally omitted — natural author opportunity.
		id: 'char_sandy',
		facts: { name: '샌디', nationality: '중국' }
	}
];

async function upsertTextbookFact(
	entityId: string,
	field: string,
	value: string
) {
	const existing = await db
		.select({ id: attributeFacts.id, value: attributeFacts.value })
		.from(attributeFacts)
		.where(
			and(
				eq(attributeFacts.learnerId, DEV_LEARNER),
				eq(attributeFacts.entityId, entityId),
				eq(attributeFacts.field, field),
				isNull(attributeFacts.supersededAt)
			)
		);
	if (existing.length > 0) return;

	await db.insert(attributeFacts).values({
		id: crypto.randomUUID(),
		learnerId: DEV_LEARNER,
		entityId,
		field,
		value,
		source: 'textbook',
		setInLesson: LESSON,
		setAt: now,
		supersededAt: null
	});
}

async function main() {
	const withTextbook =
		process.argv.includes('--with-textbook') || process.env.WITH_TEXTBOOK === 'true';

	await db
		.insert(learners)
		.values({ id: DEV_LEARNER, currentLesson: LESSON, createdAt: now })
		.onConflictDoNothing();

	if (!withTextbook) {
		console.log(
			`Seeded learner ${DEV_LEARNER} with an empty class. ` +
				`Pass --with-textbook to also load the textbook characters.`
		);
		return;
	}

	for (const c of textbookCharacters) {
		await db
			.insert(entities)
			.values({
				id: c.id,
				learnerId: DEV_LEARNER,
				kind: 'character',
				source: 'textbook',
				createdInLesson: LESSON,
				createdAt: now
			})
			.onConflictDoNothing();

		for (const [field, value] of Object.entries(c.facts)) {
			await upsertTextbookFact(c.id, field, value);
		}
	}

	const factCount = await db.$count(attributeFacts);
	console.log(
		`Seeded ${textbookCharacters.length} textbook entities and ${factCount} total facts for ${DEV_LEARNER}.`
	);
}

main().then(
	() => process.exit(0),
	(err) => {
		console.error(err);
		process.exit(1);
	}
);
