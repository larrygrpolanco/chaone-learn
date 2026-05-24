export const LESSON1_NATIONALITIES = [
	'미국 사람',
	'한국 사람',
	'중국 사람',
	'일본 사람',
	'베트남 사람',
	'영국 사람',
	'프랑스 사람',
	'캐나다 사람',
	'호주 사람'
] as const;

export const LESSON1_YEARS = ['1학년', '2학년', '3학년', '4학년'] as const;

export type Nationality = (typeof LESSON1_NATIONALITIES)[number];
export type Year = (typeof LESSON1_YEARS)[number];

export function isValidNationality(value: string): value is Nationality {
	return (LESSON1_NATIONALITIES as readonly string[]).includes(value);
}

export function isValidYear(value: string): value is Year {
	return (LESSON1_YEARS as readonly string[]).includes(value);
}
