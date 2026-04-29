import type { GrammarPoint } from "@/lib/types";

/**
 * Grammar introduced in Beginning 1, Lesson 2 — Korean Language Class / 한국어 수업
 */

export const grammar: GrammarPoint[] = [
  {
    slug: "subject-particle-i-ga",
    title: "The subject particle 이/가",
    pattern: "N이/가",
    description:
      "Indicates the subject of the sentence. 이 follows a consonant, 가 follows a vowel. Note that first-person pronouns change form when combined with 가.",
    examples: [
      { korean: "커피가 맛있어요.", english: "The coffee is delicious." },
      { korean: "한국어 수업이 재미있어요.", english: "Korean class is fun." },
    ],
    tables: [
      {
        id: "tbl-subj-particle",
        type: "conjugation",
        headers: ["Noun Ending", "Particle"],
        rows: [
          ["Consonant", "이"],
          ["Vowel", "가"],
        ],
      },
      {
        id: "tbl-pronouns-subj",
        type: "comparison",
        headers: ["Type", "Plain", "Humble", "Plain + Subj", "Humble + Subj"],
        rows: [
          ["Base Form", "나", "저", "내가", "제가"],
          ["Topic (은/는)", "나는", "저는", "-", "-"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "particle",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-1.equational-expression",
    ],
  },
  {
    slug: "polite-ending-regular",
    title: "The polite ending ~어요/아요 I (Regular)",
    pattern: "Vst + 어요/아요",
    description:
      "The most frequently used form in conversation. ~아요 is used if the last vowel of the stem is '오' or '아'. Otherwise, ~어요 is used.",
    examples: [
      { korean: "숙제가 많아요.", english: "There is a lot of homework." },
      { korean: "커피가 맛있어요.", english: "The coffee is delicious." },
    ],
    tables: [
      {
        id: "tbl-conj-basic",
        type: "conjugation",
        headers: ["Stem", "Ending", "Polite Form"],
        rows: [
          ["괜찮", "다", "괜찮아요"],
          ["재미있", "다", "재미있어요"],
          ["먹", "다", "먹어요"],
          ["앉", "다", "앉아요"],
          ["좋", "다", "좋아요"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "verb-ending",
    appliesTo: ["verb-stem-following", "adjective-stem-following"],
    prerequisites: [],
  },
  {
    slug: "polite-ending-irregular",
    title: "The polite ending ~어요/아요 II (Irregular)",
    pattern: "Vst + 어요/아요",
    description:
      "Applies to '하다' verbs, vowel contractions, and '으' deletion.",
    examples: [
      { korean: "한국어를 공부해요.", english: "I study Korean." },
      { korean: "학교가 커요.", english: "The school is big." },
    ],
    tables: [
      {
        id: "tbl-conj-irr",
        type: "conjugation",
        headers: ["Type", "Stem", "Polite Form"],
        rows: [
          ["하다 Verb", "공부하다", "공부해요"],
          ["하다 Verb", "숙제하다", "숙제해요"],
          ["Vowel Contraction", "가다", "가요"],
          ["Vowel Contraction", "싸다", "싸요"],
          ["Vowel Contraction", "보다", "봐요"],
          ["'으' Deletion", "크다", "커요"],
          ["'으' Deletion", "쓰다", "써요"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "verb-ending",
    appliesTo: ["verb-stem-following", "adjective-stem-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-2.polite-ending-regular",
    ],
  },
  {
    slug: "object-particle-eul-reul",
    title: "The object particle 을/를",
    pattern: "N을/를",
    description: "Marks the object of the verb. 을 follows a consonant, 를 follows a vowel.",
    examples: [
      { korean: "리사가 아침을 먹어요.", english: "Lisa eats breakfast." },
      { korean: "유미가 텔레비전을 봐요.", english: "Yumi watches television." },
    ],
    tables: [
      {
        id: "tbl-obj-particle",
        type: "conjugation",
        headers: ["Noun Ending", "Particle"],
        rows: [
          ["Consonant", "을"],
          ["Vowel", "를"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "particle",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-2.polite-ending-regular",
    ],
  },
];
