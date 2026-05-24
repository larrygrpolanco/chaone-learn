import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const characters = sqliteTable('characters', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	learner_id: text('learner_id').notNull(),
	is_learner: integer('is_learner', { mode: 'boolean' }).notNull().default(false),
	name: text('name').notNull(),
	year: text('year'),
	nationality: text('nationality')
});

export const phase_state = sqliteTable(
	'phase_state',
	{
		learner_id: text('learner_id').notNull(),
		lesson_id: integer('lesson_id').notNull(),
		phase: text('phase', { enum: ['seed', 'building', 'synthesis'] })
			.notNull()
			.default('seed'),
		completed_phases: text('completed_phases').notNull().default('[]')
	},
	(table) => [primaryKey({ columns: [table.learner_id, table.lesson_id] })]
);

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type PhaseStateRow = typeof phase_state.$inferSelect;
