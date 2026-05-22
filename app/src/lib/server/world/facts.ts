import { db } from '$lib/server/db';
import { attributeFacts } from '$lib/server/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export type FactSource = 'textbook' | 'learner' | 'llm';

export async function commitAttributeFact(input: {
	learnerId: string;
	entityId: string;
	field: string;
	value: string;
	source: FactSource;
	lessonId: number;
}) {
	const now = Date.now();

	await db
		.update(attributeFacts)
		.set({ supersededAt: now })
		.where(
			and(
				eq(attributeFacts.learnerId, input.learnerId),
				eq(attributeFacts.entityId, input.entityId),
				eq(attributeFacts.field, input.field),
				isNull(attributeFacts.supersededAt)
			)
		);

	const id = crypto.randomUUID();
	await db.insert(attributeFacts).values({
		id,
		learnerId: input.learnerId,
		entityId: input.entityId,
		field: input.field,
		value: input.value,
		source: input.source,
		setInLesson: input.lessonId,
		setAt: now,
		supersededAt: null
	});
	return id;
}

export async function listAttributesForEntity(
	learnerId: string,
	entityId: string
): Promise<Record<string, string>> {
	const rows = await db
		.select({ field: attributeFacts.field, value: attributeFacts.value })
		.from(attributeFacts)
		.where(
			and(
				eq(attributeFacts.learnerId, learnerId),
				eq(attributeFacts.entityId, entityId),
				isNull(attributeFacts.supersededAt)
			)
		);
	const out: Record<string, string> = {};
	for (const r of rows) out[r.field] = r.value;
	return out;
}
