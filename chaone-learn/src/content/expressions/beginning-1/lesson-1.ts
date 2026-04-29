import type { ExpressionEntry } from "@/lib/types";

/**
 * Expressions introduced in Beginning 1, Lesson 1 — Greetings / 인사
 */

export const expressions: ExpressionEntry[] = [
  {
    slug: "annyeonghaseyo",
    title: "안녕하세요 (Hello)",
    description:
      "A greeting that asks about the other person's well-being. Appropriate at any time of day.",
  },
  {
    slug: "reference-to-self",
    title: "Reference to Self (Plain vs. Humble)",
    description:
      "Korean uses different pronouns depending on who you are talking to.",
    tables: [
      {
        id: "tbl-pronouns",
        type: "comparison",
        headers: ["Meaning", "Plain Form", "Humble Form"],
        rows: [
          ["I", "나", "저"],
          ["As for me (Topic)", "나는", "저는"],
          ["I also", "나도", "저도"],
        ],
      },
    ],
  },
  {
    slug: "sino-korean-numbers",
    title: "Sino-Korean Numbers (0–10)",
    description:
      "Used for telephone numbers, school years, etc. Zero is read as 영 or 공.",
    tables: [
      {
        id: "tbl-numbers-sino",
        type: "generic",
        headers: ["Number", "Korean"],
        rows: [
          ["0", "영/공"],
          ["1", "일"],
          ["2", "이"],
          ["3", "삼"],
          ["4", "사"],
          ["5", "오"],
          ["6", "육"],
          ["7", "칠"],
          ["8", "팔"],
          ["9", "구"],
          ["10", "십"],
        ],
      },
    ],
  },
  {
    slug: "countries-and-languages",
    title: "Countries and Languages",
    description:
      "Language is usually Country + 어. Nationality is Country + 사람.",
    tables: [
      {
        id: "tbl-nations",
        type: "generic",
        headers: ["Country", "Language", "Nationality"],
        rows: [
          ["한국 (Korea)", "한국어", "한국 사람"],
          ["미국 (U.S.)", "영어", "미국 사람"],
          ["영국 (U.K.)", "영어", "영국 사람"],
          ["일본 (Japan)", "일본어", "일본 사람"],
          ["중국 (China)", "중국어", "중국 사람"],
          ["프랑스 (France)", "프랑스어", "프랑스 사람"],
        ],
      },
    ],
  },
];
