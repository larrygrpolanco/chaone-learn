import type { GrammarPoint } from "@/lib/types";

/**
 * Grammar introduced in Beginning 1, Lesson 3 — The University Campus / 대학 캠퍼스
 */

export const grammar: GrammarPoint[] = [
  {
    slug: "expressing-location",
    title: "Expressing location: [Place]에 있어요",
    pattern: "[Place] + 에 있어요",
    description:
      "Indicates where an entity exists. Requires a location, the particle 에, and the adjective 있다.",
    examples: [
      { korean: "서점이 어디 있어요?", english: "Where is the bookstore?" },
      { korean: "우체국 옆에 있어요.", english: "It is beside the post office." },
    ],
    tables: [
      {
        id: "tbl-pos-nouns",
        type: "generic",
        headers: ["Position", "Korean"],
        rows: [
          ["Front", "앞"],
          ["Back/Behind", "뒤"],
          ["Side/Beside", "옆"],
          ["Inside", "안"],
          ["Outside", "밖"],
          ["Above/Top", "위"],
          ["Below/Under", "밑 / 아래"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["noun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-2.polite-ending-regular",
      "grammar.beginning-1.lesson-2.subject-particle-i-ga",
    ],
  },
  {
    slug: "topic-particle",
    title: "Changing the topic: particle 은/는",
    pattern: "N + 은/는",
    description:
      "Used to shift the topic from one item to another in a conversation.",
    examples: [
      { korean: "기숙사는 어디 있어요?", english: "As for the dormitory, where is it?" },
      { korean: "서점은요?", english: "How about the bookstore?" },
    ],
    register: "polite-informal",
    structuralType: "particle",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-1.particles-eun-neun-vs-do",
    ],
  },
  {
    slug: "expressing-possession",
    title: "Expressing possession: N이/가 있어요/없어요",
    pattern: "N이/가 있어요/없어요",
    description:
      "Used to express having or not having an object or person.",
    examples: [
      { korean: "한국어 사전 있어요?", english: "Do you have a Korean dictionary?" },
      { korean: "질문 있어요?", english: "Do you have any questions?" },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-2.subject-particle-i-ga",
      "grammar.beginning-1.lesson-2.polite-ending-regular",
    ],
  },
  {
    slug: "honorific-ending",
    title: "The honorific ending ~(으)세요",
    pattern: "Vst + (으)세요",
    description:
      "A combination of honorific marker ~(으)시 and polite ending ~어요. Used to show respect to the person being talked about or addressed.",
    examples: [
      { korean: "선생님, 우산 있으세요?", english: "Teacher, do you have an umbrella?" },
      { korean: "스티브 씨, 앉으세요.", english: "Steve, please have a seat." },
    ],
    tables: [
      {
        id: "tbl-honorific-conj",
        type: "conjugation",
        headers: ["Stem Ending", "Ending", "Example"],
        rows: [
          ["Consonant", "으세요", "앉으세요"],
          ["Vowel", "세요", "가세요"],
        ],
      },
    ],
    register: "honorific",
    structuralType: "verb-ending",
    appliesTo: ["verb-stem-following", "adjective-stem-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-2.polite-ending-regular",
    ],
  },
];
