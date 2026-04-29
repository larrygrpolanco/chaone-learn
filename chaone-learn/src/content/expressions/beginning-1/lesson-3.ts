import type { ExpressionEntry } from "@/lib/types";

/**
 * Expressions introduced in Beginning 1, Lesson 3 — The University Campus / 대학 캠퍼스
 */

export const expressions: ExpressionEntry[] = [
  {
    slug: "hesitation-marker-jeo",
    title: "The Hesitation Marker 저",
    description:
      "저 is used for hesitation before the speaker says something, drawing the attention of the listener.",
  },
  {
    slug: "be-verbs",
    title: "이에요/예요 vs. 있어요",
    description:
      "In Korean, 'to be' is split between equation (이다) and existence (있다).",
    tables: [
      {
        id: "tbl-be-diff",
        type: "comparison",
        headers: ["Function", "Korean Form", "Example"],
        rows: [
          [
            "Equation",
            "이다 (이에요/예요)",
            "저는 학생이에요. (I am a student.)",
          ],
          [
            "Existence",
            "있다 (있어요)",
            "식당이 빌딩에 있어요. (The cafeteria is in the building.)",
          ],
        ],
      },
    ],
  },
  {
    slug: "nugu-vs-nuga",
    title: "누구 vs 누가",
    description:
      "When 누구 (who) is combined with the subject particle 가, it becomes 누가.",
  },
];
