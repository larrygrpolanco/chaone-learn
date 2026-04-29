import type { StageManifest } from "@/lib/types";
import { makeStageId } from "@/lib/id";
import { lessonManifest as lesson1 } from "../lessons/beginning-1/lesson-1";
import { lessonManifest as lesson2 } from "../lessons/beginning-1/lesson-2";
import { lessonManifest as lesson3 } from "../lessons/beginning-1/lesson-3";

const STAGE = "beginning-1";

/**
 * Stage manifest — Beginning 1
 *
 * The first stage. Covers greetings, self-introduction, school life,
 * and campus locations using equational sentences and polite endings.
 */

export const stageManifest: StageManifest = {
  id: makeStageId(STAGE),
  title: { en: "Beginning 1", kr: "초급 1" },
  description:
    "Foundational vocabulary and grammar for everyday interactions. Greetings, introductions, school life, and basic location expressions.",
  lessons: [
    {
      id: lesson1.id,
      title: lesson1.title,
      summary: "Introducing yourself and others.",
    },
    {
      id: lesson2.id,
      title: lesson2.title,
      summary: "Talking about classes and well-being.",
    },
    {
      id: lesson3.id,
      title: lesson3.title,
      summary: "Asking about and describing locations.",
    },
  ],
};
