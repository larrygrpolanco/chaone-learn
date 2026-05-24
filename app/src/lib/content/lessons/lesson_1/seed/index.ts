export type SeedStep =
	| { kind: 'narrative'; speaker: string; promptKr: string; subKr?: string; cta: string }
	| { kind: 'author_add_student'; speaker: string; promptKr: string }
	| { kind: 'recall_inline'; speaker: string; field: 'nationality' | 'year'; setupKr: string }
	| { kind: 'update_inline'; speaker: string; field: 'nationality' | 'year' }
	| { kind: 'wrap'; speaker: string; promptKr: string; cta: string };

export const lesson1Seed: SeedStep[] = [
	{
		kind: 'narrative',
		speaker: '게리',
		promptKr: '안녕하세요. 저는 게리예요.',
		subKr: '반가워요.',
		cta: '다음'
	},
	{
		kind: 'author_add_student',
		speaker: '게리',
		promptKr: '우리 반에 다른 학생도 있어요. 누구예요?'
	},
	{
		kind: 'recall_inline',
		speaker: '게리',
		field: 'nationality',
		setupKr: '잠깐만요. 한 가지 물어볼게요.'
	},
	{
		kind: 'update_inline',
		speaker: '게리',
		field: 'nationality'
	},
	{
		kind: 'wrap',
		speaker: '게리',
		promptKr: '좋아요. 우리 반을 더 만들어요.',
		cta: '연습으로'
	}
];
