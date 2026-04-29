import type { VocabularyEntry } from "@/lib/types";

/**
 * Vocabulary introduced in Beginning 1, Lesson 1 — Greetings / 인사
 */

export const vocabulary: VocabularyEntry[] = [
  // Nouns
  { slug: "1-haknyeon", korean: "1학년", english: ["freshman"], partOfSpeech: "noun" },
  { slug: "2-haknyeon", korean: "2학년", english: ["sophomore"], partOfSpeech: "noun" },
  { slug: "3-haknyeon", korean: "3학년", english: ["junior"], partOfSpeech: "noun" },
  { slug: "4-haknyeon", korean: "4학년", english: ["senior"], partOfSpeech: "noun" },
  { slug: "daehaksaeng", korean: "대학생", english: ["college student"], partOfSpeech: "noun" },
  { slug: "miguk", korean: "미국", english: ["the United States"], partOfSpeech: "noun" },
  { slug: "saram", korean: "사람", english: ["person", "people"], partOfSpeech: "noun" },
  { slug: "insa", korean: "인사", english: ["greeting"], partOfSpeech: "noun" },
  { slug: "haknyeon", korean: "학년", english: ["school year"], partOfSpeech: "noun" },
  { slug: "haksaeng", korean: "학생", english: ["student"], partOfSpeech: "noun" },
  { slug: "hanguk", korean: "한국", english: ["Korea"], partOfSpeech: "noun" },
  { slug: "seonsaengnim", korean: "선생님", english: ["teacher"], partOfSpeech: "noun", tags: ["honorific-noun"] },
  { slug: "ssi", korean: "씨", english: ["Mr.", "Ms."], partOfSpeech: "suffix" },
  { slug: "yeongguk", korean: "영국", english: ["United Kingdom"], partOfSpeech: "noun" },
  { slug: "yeongeo", korean: "영어", english: ["English language"], partOfSpeech: "noun" },
  { slug: "ireum", korean: "이름", english: ["name"], partOfSpeech: "noun" },
  { slug: "ilbon", korean: "일본", english: ["Japan"], partOfSpeech: "noun" },
  { slug: "jungguk", korean: "중국", english: ["China"], partOfSpeech: "noun" },
  { slug: "keulleseu", korean: "클래스", english: ["class"], partOfSpeech: "noun" },
  { slug: "hangugeo", korean: "한국어", english: ["Korean language"], partOfSpeech: "noun" },

  // Pronouns
  { slug: "jeo", korean: "저", english: ["I"], partOfSpeech: "pronoun", tags: ["humble"] },
  { slug: "mwo", korean: "뭐", english: ["what"], partOfSpeech: "pronoun" },

  // Adjectives
  { slug: "annyeonghada", korean: "안녕하다", english: ["to be well"], partOfSpeech: "adjective", inflectionNotes: "하다 adjective: 안녕하 + 여요 → 안녕해요 (but formal greeting stays 안녕하세요)" },
  { slug: "geureohda", korean: "그렇다", english: ["to be so"], partOfSpeech: "adjective", inflectionNotes: "그렇 + 어요 → 그래요 (vowel contraction: ㅓ + ㅓ → ㅐ)" },
  { slug: "bangapda", korean: "반갑다", english: ["to be glad", "to be pleased to meet"], partOfSpeech: "adjective", inflectionNotes: "반갑 + 어요 → 반가워요 (ㅂ irregular: ㅂ + 어 → 워)" },

  // Copula
  { slug: "ida", korean: "이다", english: ["to be (equation)"], partOfSpeech: "copula", inflectionNotes: "이다 → 이에요/예요 after vowel/consonant" },
  { slug: "anida", korean: "아니다", english: ["to not be (negative equation)"], partOfSpeech: "copula", inflectionNotes: "아니 + 에요 → 아니에요" },

  // Particles
  { slug: "gwa", korean: "과", english: ["lesson", "chapter"], partOfSpeech: "counter" },
  { slug: "do", korean: "도", english: ["also", "too"], partOfSpeech: "particle" },
  { slug: "eun-neun", korean: "은/는", english: ["topic particle"], partOfSpeech: "particle", inflectionNotes: "은 after consonant, 는 after vowel" },
  { slug: "i-ga", korean: "이/가", english: ["subject particle"], partOfSpeech: "particle", inflectionNotes: "이 after consonant, 가 after vowel" },

  // Interjections / Adverbs
  { slug: "a", korean: "아", english: ["oh"], partOfSpeech: "interjection" },
  { slug: "ne", korean: "네", english: ["yes", "I see"], partOfSpeech: "adverb" },
  { slug: "aniyo", korean: "아니요", english: ["no"], partOfSpeech: "adverb" },
];
