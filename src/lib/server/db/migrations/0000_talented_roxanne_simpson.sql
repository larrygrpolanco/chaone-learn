CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`learner_id` text NOT NULL,
	`is_learner` integer DEFAULT false NOT NULL,
	`name` text NOT NULL,
	`year` text,
	`nationality` text
);
--> statement-breakpoint
CREATE TABLE `phase_state` (
	`learner_id` text NOT NULL,
	`lesson_id` integer NOT NULL,
	`phase` text DEFAULT 'seed' NOT NULL,
	`completed_phases` text DEFAULT '[]' NOT NULL,
	PRIMARY KEY(`learner_id`, `lesson_id`)
);
