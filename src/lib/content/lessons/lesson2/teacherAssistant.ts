export const teacherAssistant = {
	seed: {
		intro: "Welcome back! Your class from Lesson 1 is still here — let's build on what you know. In Lesson 2, we'll explore family connections. Every classmate has a story beyond the roster.",
		expansion: (characterName: string) =>
			`Let's learn more about ${characterName}. Does ${characterName} 씨 have any family members you know? Let's add them to the picture.`
	}
} as const;
