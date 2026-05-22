import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const learners = sqliteTable('learners', {
	id: text('id').primaryKey(),
	currentLesson: integer('current_lesson').notNull().default(1),
	createdAt: integer('created_at').notNull()
});

export const entities = sqliteTable('entities', {
	id: text('id').primaryKey(),
	learnerId: text('learner_id')
		.notNull()
		.references(() => learners.id),
	kind: text('kind').notNull(),
	source: text('source', { enum: ['textbook', 'learner'] }).notNull(),
	createdInLesson: integer('created_in_lesson').notNull(),
	createdAt: integer('created_at').notNull()
});

export const attributeFacts = sqliteTable('attribute_facts', {
	id: text('id').primaryKey(),
	learnerId: text('learner_id')
		.notNull()
		.references(() => learners.id),
	entityId: text('entity_id')
		.notNull()
		.references(() => entities.id),
	field: text('field').notNull(),
	value: text('value').notNull(),
	source: text('source', { enum: ['textbook', 'learner', 'llm'] }).notNull(),
	setInLesson: integer('set_in_lesson').notNull(),
	setAt: integer('set_at').notNull(),
	supersededAt: integer('superseded_at')
});
