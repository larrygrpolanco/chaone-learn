export const teacherAssistant = {
	seed: {
		// Per-step messages live in SEED_STEPS in exercises.ts.
		// This entry is kept as a fallback reference.
		intro:
			"Welcome to Lesson 1! Every world starts with you — let's add you to the class roster."
	},
	building: {
		start:
			"Your world is taking shape! Add more classmates — give them a name, year, and nationality. You can also correct any classmate's details after adding them. When you're done, head to Synthesis!",
		update:
			"Need to make a correction? Select a classmate below and update their nationality or year."
	},
	synthesis: {
		intro:
			"Time to put your Korean to the test. You built this roster — now let's see if you can recall what you know. Answer in Korean!"
	}
} as const;
