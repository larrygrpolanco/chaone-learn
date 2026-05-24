export const teacherAssistant = {
	seed: {
		// Per-step messages live in SEED_STEPS in exercises.ts.
		// This entry is kept as a fallback reference.
		intro:
			"Welcome to Lesson 1! Every world starts with you — let's add you to the class roster."
	},
	building: {
		start:
			'Your world is taking shape! Add more classmates — give them a name and nationality. This is your world, so use anyone you like: a real friend, a fictional character, whoever.'
	},
	synthesis: {
		intro:
			"Time to put your Korean to the test. You built this roster — now let's see if you can recall what you know. Answer in Korean!"
	}
} as const;
