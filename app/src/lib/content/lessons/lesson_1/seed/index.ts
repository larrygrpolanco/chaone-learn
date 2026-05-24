export type SeedStep =
	| {
			kind: 'narrative';
			speaker: string;
			bodyEn?: string;
			promptKr: string;
			subKr?: string;
			cta: string;
	  }
	| {
			kind: 'author_add_student';
			speaker: string;
			bodyEn?: string;
			promptKr: string;
	  }
	| {
			kind: 'recall_inline';
			speaker: string;
			bodyEn?: string;
			field: 'nationality' | 'year';
			setupKr: string;
	  }
	| {
			kind: 'update_inline';
			speaker: string;
			bodyEn?: string;
			field: 'nationality' | 'year';
	  }
	| { kind: 'wrap'; speaker: string; bodyEn?: string; promptKr: string; cta: string };

export const lesson1Seed: SeedStep[] = [
	{
		kind: 'narrative',
		speaker: '',
		bodyEn:
			"Welcome. In this lesson you'll use the Korean you've been learning to build a small world — a classroom, the students in it, where they're from, what year they're in. You decide who belongs in it. The platform asks you about that world, in Korean, as you go.\n\nSome questions let you decide how the world is. Others check what you've already decided. You're not being graded either way.\n\nYour first classmate is Gary. He'll walk through the first few questions with you.",
		promptKr: '안녕하세요. 저는 게리예요. 반가워요.',
		cta: '다음'
	},
	{
		kind: 'author_add_student',
		speaker: '게리',
		bodyEn:
			"There's an empty desk in the back. Who sits there? Pick a name, then where they're from, then what year they're in. This is an author question — there's no wrong answer. You're deciding who this person is.",
		promptKr: '이름이 뭐예요?'
	},
	{
		kind: 'recall_inline',
		speaker: '게리',
		bodyEn:
			"Quick check — where are they from? This is a recall question. Pick the wrong one and it greys out; try again. No consequences.",
		field: 'nationality',
		setupKr: '잠깐만요. 한 가지 물어볼게요.'
	},
	{
		kind: 'update_inline',
		speaker: '게리',
		bodyEn:
			"One more type. Gary's currently down as 일학년 (freshman). When he asks if that's right, you can keep it or change it — your call. This is how you update facts in the world.",
		field: 'year'
	},
	{
		kind: 'wrap',
		speaker: '게리',
		bodyEn:
			"That's all three question types — author, recall, and update. From here you'll land on a practice screen where you can keep filling out the class on your own terms.",
		promptKr: '좋아요. 우리 반을 더 만들어요.',
		cta: '연습으로'
	}
];
