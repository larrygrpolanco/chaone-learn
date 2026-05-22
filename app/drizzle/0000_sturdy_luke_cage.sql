CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`kind` text NOT NULL,
	`source` text NOT NULL,
	`created_in_lesson` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`learner_id`) REFERENCES `learners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `learners` (
	`id` text PRIMARY KEY NOT NULL,
	`current_lesson` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL
);
