import type { GrammarPoint } from "@/lib/types";

/**
 * Grammar introduced in Beginning 1, Lesson 1 — Greetings / 인사
 */

export const grammar: GrammarPoint[] = [
  {
    slug: "equational-expression",
    title: "Equational expression: N1은/는 N2이에요/예요",
    pattern: "N1은/는 N2이에요/예요",
    description:
      "Topic-comment structure. 은/는 marks the topic. 이에요/예요 is the copula 'to be'.",
    examples: [
      { korean: "마이클은 대학생이에요.", english: "Michael is a college student." },
      { korean: "저는 김유미예요.", english: "I am Yumi Kim." },
    ],
    tables: [
      {
        id: "tbl-copula-aff",
        type: "conjugation",
        headers: ["Noun Ending", "Topic Particle", "Copula"],
        rows: [
          ["Consonant", "은", "이에요"],
          ["Vowel", "는", "예요"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [],
  },
  {
    slug: "omission-redundant",
    title: "Omission of redundant elements",
    pattern: "Context dependent",
    description: "Subjects and topics are often omitted when they are obvious from context.",
    examples: [
      { korean: "(저는) 3학년이에요.", english: "[I] am a junior." },
      { korean: "(이름이) 뭐예요?", english: "What is [your name]?" },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["context-dependent"],
    prerequisites: [],
  },
  {
    slug: "particles-eun-neun-vs-do",
    title: "Comparing items: 은/는 vs. 도",
    pattern: "N도",
    description: "The particles 은/는 and 도 are used to compare two or more items.",
    examples: [
      { korean: "김유미는 한국 사람이에요.", english: "Yumi Kim is Korean." },
      { korean: "저도 1학년이에요.", english: "I am also a freshman." },
    ],
    tables: [
      {
        id: "tbl-particles-comp",
        type: "comparison",
        headers: ["Particle", "Function"],
        rows: [
          ["은/는", "The items are different or contrastive."],
          ["도", "The items are parallel (also/too)."],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "particle",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [],
  },
  {
    slug: "yes-no-questions",
    title: "Yes/no questions",
    pattern: "N이에요/예요? (rising intonation)",
    description:
      "In Korean, the word order remains the same for questions; only the intonation rises.",
    examples: [
      { korean: "한국 사람이에요?", english: "Are you Korean?" },
      { korean: "네, 한국 사람이에요.", english: "Yes, I am Korean." },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["sentence-final"],
    prerequisites: ["grammar.beginning-1.lesson-1.equational-expression"],
  },
  {
    slug: "negative-equational",
    title: "Negative equational expression",
    pattern: "N1은/는 N2이/가 아니에요",
    description:
      "To say 'N1 is not N2', use the pattern with the subject particle 이/가 followed by 아니에요.",
    examples: [
      { korean: "소피아 왕은 한국 사람이 아니에요.", english: "Sophia Wang is not Korean." },
      { korean: "저는 1학년이 아니에요.", english: "I am not a freshman." },
    ],
    tables: [
      {
        id: "tbl-copula-neg",
        type: "conjugation",
        headers: ["Noun Ending", "Subject Particle", "Negative Copula"],
        rows: [
          ["Consonant", "이", "아니에요"],
          ["Vowel", "가", "아니에요"],
        ],
      },
    ],
    register: "polite-informal",
    structuralType: "sentence-pattern",
    appliesTo: ["noun-following", "pronoun-following"],
    prerequisites: [
      "grammar.beginning-1.lesson-1.equational-expression",
    ],
  },
];
