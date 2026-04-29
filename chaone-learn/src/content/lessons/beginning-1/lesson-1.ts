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
const LESSON = "lesson-1";

// Vocab IDs introduced in this lesson
const lessonVocab = vocabIds(STAGE, LESSON, [
  "1-haknyeon",
  "2-haknyeon",
  "3-haknyeon",
  "4-haknyeon",
  "daehaksaeng",
  "miguk",
  "saram",
  "insa",
  "haknyeon",
  "haksaeng",
  "hanguk",
  "seonsaengnim",
  "ssi",
  "yeongguk",
  "yeongeo",
  "ireum",
  "ilbon",
  "jungguk",
  "keulleseu",
  "hangugeo",
  "jeo",
  "mwo",
  "annyeonghada",
  "geureohda",
  "bangapda",
  "ida",
  "anida",
  "gwa",
  "do",
  "eun-neun",
  "i-ga",
  "a",
  "ne",
  "aniyo",
]);

const lessonGrammar = grammarIds(STAGE, LESSON, [
  "equational-expression",
  "omission-redundant",
  "particles-eun-neun-vs-do",
  "yes-no-questions",
  "negative-equational",
]);

const lessonExpressions = expressionIds(STAGE, LESSON, [
  "annyeonghaseyo",
  "reference-to-self",
  "sino-korean-numbers",
  "countries-and-languages",
]);

const lessonStories = storyIds(STAGE, LESSON, ["korean-class-narration"]);

/**
 * Lesson manifest — Beginning 1, Lesson 1: Greetings / 인사
 */

export const lessonManifest: LessonManifest = {
  id: makeLessonId(STAGE, LESSON),
  title: { en: "Greetings", kr: "인사" },
  description:
    "Introducing yourself and others. Basic equational sentences, topic and subject particles, and the first honorific distinction.",
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
      story: makeId("story", STAGE, LESSON, "korean-class-narration"),
    },
  ],
};
