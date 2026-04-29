import type { ExpressionEntry } from "@/lib/types";

/**
 * Expressions introduced in Beginning 1, Lesson 2 — Korean Language Class / 한국어 수업
 */

export const expressions: ExpressionEntry[] = [
  {
    slug: "eottaeyo",
    title: "어때요? (How is…?)",
    description:
      "An expression asking the other party's opinion. It is a contraction of [어떻 + 어요 = 어때요].",
    tables: [
      {
        id: "tbl-how-is",
        type: "generic",
        headers: ["Question", "Translation"],
        rows: [
          ["음식이 어때요?", "How's the food?"],
          ["학교가 어때요?", "How's school?"],
        ],
      },
    ],
  },
  {
    slug: "plural-particle-deul",
    title: "Plural Particle 들",
    description:
      "Attached to nouns to indicate plurality (e.g., 학생들, 선생님들). In Korean, plurality is not mandatorily marked.",
  },
  {
    slug: "verbs-with-hada",
    title: "Verbs with 하다",
    description:
      "Verbs like 공부하다 (to study) are [Noun + 하다]. They can be split into 'Noun + Object Particle + 하다' (e.g., 공부를 하다).",
  },
  {
    slug: "sihem-eul-boda",
    title: "시험을 보다",
    description:
      "Literally 'to see a test', this phrase means 'to take a test'.",
  },
];
