import type { LessonManifest } from "@/lib/types";
import {
  makeLessonId,
  makeId,
  vocabIds,
  grammarIds,
  expressionIds,
  storyIds,
} from "@/lib/id";

const STAGE = "beginning-1";
const LESSON = "lesson-3";

const lessonVocab = vocabIds(STAGE, LESSON, [
  "gabang",
  "gisuksa",
  "daehakgyo",
  "dwi",
  "mit",
  "bakk",
  "bilding",
  "seojeom",
  "sigye",
  "an",
  "ap",
  "eodi",
  "yeop",
  "ucheguk",
  "uija",
  "wi",
  "chaeksang",
  "chaek",
  "haksaenghoegwan",
  "kaempeoseu",
  "cheung",
  "gyeongjehak",
  "gyogwaseo",
  "gyosil",
  "ban",
  "sajeon",
  "sigan",
  "yeoja",
  "usan",
  "jilmun",
  "jip",
  "keompyuteo",
  "hol",
  "gada",
  "insahada",
  "ilgda",
  "itda",
  "eopda",
  "maeil",
  "yeolsimhi",
  "geuraeseo",
  "geureonde",
  "e",
  "nugu",
  "jeo-hesitation",
]);

const lessonGrammar = grammarIds(STAGE, LESSON, [
  "expressing-location",
  "topic-particle",
  "expressing-possession",
  "honorific-ending",
]);

const lessonExpressions = expressionIds(STAGE, LESSON, [
  "hesitation-marker-jeo",
  "be-verbs",
  "nugu-vs-nuga",
]);

const lessonStories = storyIds(STAGE, LESSON, ["campus-narration"]);

/**
 * Lesson manifest — Beginning 1, Lesson 3: The University Campus / 대학 캠퍼스
 */

export const lessonManifest: LessonManifest = {
  id: makeLessonId(STAGE, LESSON),
  title: { en: "The University Campus", kr: "대학 캠퍼스" },
  summary: "Asking about and describing locations.",
  description:
    "Asking about and describing locations. Existence verb 있다, location particle 에, and the honorific ending ~(으)세요.",
  introduces: {
    vocabulary: lessonVocab,
    grammar: lessonGrammar,
    expressions: lessonExpressions,
    stories: lessonStories,
  },
  reinforces: {
    vocabulary: [],
    grammar: [],
    expressions: [],
    stories: [],
  },
  activities: [
    { type: "vocab-introduction", vocab: lessonVocab },
    { type: "flashcards", vocab: lessonVocab },
    {
      type: "mixed-language-reader",
      story: makeId("story", STAGE, LESSON, "campus-narration"),
    },
  ],
};
