import { db } from '$lib/server/db';
import { entities } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export type EntityKind = 'character' | 'location' | 'object';
export type EntitySource = 'textbook' | 'learner';

export async function listEntitiesByKind(learnerId: string, kind: EntityKind) {
	return db
		.select()
		.from(entities)
		.where(and(eq(entities.learnerId, learnerId), eq(entities.kind, kind)));
}

export async function createEntity(input: {
	id: string;
	learnerId: string;
	kind: EntityKind;
	source: EntitySource;
	createdInLesson: number;
}) {
	await db.insert(entities).values({
		id: input.id,
		learnerId: input.learnerId,
		kind: input.kind,
		source: input.source,
		createdInLesson: input.createdInLesson,
		createdAt: Date.now()
	});
	return input.id;
}
