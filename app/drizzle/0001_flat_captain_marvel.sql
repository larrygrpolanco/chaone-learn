CREATE TABLE `attribute_facts` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`field` text NOT NULL,
	`value` text NOT NULL,
	`source` text NOT NULL,
	`set_in_lesson` integer NOT NULL,
	`set_at` integer NOT NULL,
	`superseded_at` integer,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE no action
);
