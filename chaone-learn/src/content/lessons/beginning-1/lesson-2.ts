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
const LESSON = "lesson-2";

const lessonVocab = vocabIds(STAGE, LESSON, [
  "doseogwan",
  "sueop",
  "sukje",
  "sigdang",
  "achim",
  "chingu",
  "keopi",
  "hakgyo",
  "namja",
  "naeil",
  "siheom",
  "yeoksa",
  "oneul",
  "eumsik",
  "juseu",
  "tellebijyeon",
  "meokda",
  "anjda",
  "alda",
  "gongbu-hada",
  "mannada",
  "boda",
  "sseuda",
  "jinaeda",
  "hada",
  "gwaenchanta",
  "neolbda",
  "manta",
  "masitta",
  "eotteohda",
  "jaemiitta",
  "jota",
  "maseopda",
  "ssada",
  "jaemieopda",
  "keuda",
  "aju",
  "eotteoke",
  "yojeum",
  "jal",
  "jigeum",
  "deul",
  "eul-reul",
  "geurigo",
  "eo",
]);

const lessonGrammar = grammarIds(STAGE, LESSON, [
  "subject-particle-i-ga",
  "polite-ending-regular",
  "polite-ending-irregular",
  "object-particle-eul-reul",
]);

const lessonExpressions = expressionIds(STAGE, LESSON, [
  "eottaeyo",
  "plural-particle-deul",
  "verbs-with-hada",
  "sihem-eul-boda",
]);

const lessonStories = storyIds(STAGE, LESSON, ["korean-class-narration"]);

/**
 * Lesson manifest — Beginning 1, Lesson 2: Korean Language Class / 한국어 수업
 */

export const lessonManifest: LessonManifest = {
  id: makeLessonId(STAGE, LESSON),
  title: { en: "Korean Language Class", kr: "한국어 수업" },
  summary: "Talking about classes and well-being.",
  description:
    "Talking about classes and well-being. Polite verb endings, subject and object particles, and the first irregular conjugations.",
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
