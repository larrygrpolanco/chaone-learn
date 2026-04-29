/**
 * Content loader — resolves full IDs to entity objects.
 *
 * Server-side only. Builds lookup maps from all content files.
 */

import type {
  VocabularyEntry,
  GrammarPoint,
  ExpressionEntry,
  Story,
  LessonManifest,
} from "./types";
import { makeId } from "./id";

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------
import { vocabulary as vocabL1 } from "@/content/vocabulary/beginning-1/lesson-1";
import { vocabulary as vocabL2 } from "@/content/vocabulary/beginning-1/lesson-2";
import { vocabulary as vocabL3 } from "@/content/vocabulary/beginning-1/lesson-3";

// ---------------------------------------------------------------------------
// Grammar
// ---------------------------------------------------------------------------
import { grammar as grammarL1 } from "@/content/grammar/beginning-1/lesson-1";
import { grammar as grammarL2 } from "@/content/grammar/beginning-1/lesson-2";
import { grammar as grammarL3 } from "@/content/grammar/beginning-1/lesson-3";

// ---------------------------------------------------------------------------
// Expressions
// ---------------------------------------------------------------------------
import { expressions as exprL1 } from "@/content/expressions/beginning-1/lesson-1";
import { expressions as exprL2 } from "@/content/expressions/beginning-1/lesson-2";
import { expressions as exprL3 } from "@/content/expressions/beginning-1/lesson-3";

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------
import { story as storyL1 } from "@/content/stories/beginning-1/lesson-1/korean-class-narration";
import { story as storyL2 } from "@/content/stories/beginning-1/lesson-2/korean-class-narration";
import { story as storyL3 } from "@/content/stories/beginning-1/lesson-3/campus-narration";

// ---------------------------------------------------------------------------
// Lesson manifests
// ---------------------------------------------------------------------------
import { lessonManifest as lessonManifest1 } from "@/content/lessons/beginning-1/lesson-1";
import { lessonManifest as lessonManifest2 } from "@/content/lessons/beginning-1/lesson-2";
import { lessonManifest as lessonManifest3 } from "@/content/lessons/beginning-1/lesson-3";

// ---------------------------------------------------------------------------
// Stage manifest
// ---------------------------------------------------------------------------
import { stageManifest } from "@/content/stages/beginning-1";

// ---------------------------------------------------------------------------
// Build maps
// ---------------------------------------------------------------------------

const vocabMap = new Map<string, VocabularyEntry>();
const grammarMap = new Map<string, GrammarPoint>();
const expressionMap = new Map<string, ExpressionEntry>();
const storyMap = new Map<string, Story>();

function populate(
  stage: string,
  lesson: string,
  vocab: VocabularyEntry[],
  grammar: GrammarPoint[],
  expressions: ExpressionEntry[],
  story: Story
) {
  for (const v of vocab) {
    vocabMap.set(makeId("vocab", stage, lesson, v.slug), v);
  }
  for (const g of grammar) {
    grammarMap.set(makeId("grammar", stage, lesson, g.slug), g);
  }
  for (const e of expressions) {
    expressionMap.set(makeId("expression", stage, lesson, e.slug), e);
  }
  storyMap.set(makeId("story", stage, lesson, story.slug), story);
}

populate("beginning-1", "lesson-1", vocabL1, grammarL1, exprL1, storyL1);
populate("beginning-1", "lesson-2", vocabL2, grammarL2, exprL2, storyL2);
populate("beginning-1", "lesson-3", vocabL3, grammarL3, exprL3, storyL3);

// ---------------------------------------------------------------------------
// Lookup functions
// ---------------------------------------------------------------------------

export function getVocabById(id: string): VocabularyEntry | undefined {
  return vocabMap.get(id);
}

export function getGrammarById(id: string): GrammarPoint | undefined {
  return grammarMap.get(id);
}

export function getExpressionById(id: string): ExpressionEntry | undefined {
  return expressionMap.get(id);
}

export function getStoryById(id: string): Story | undefined {
  return storyMap.get(id);
}

export function getLessonManifest(id: string): LessonManifest | undefined {
  if (id === lessonManifest1.id) return lessonManifest1;
  if (id === lessonManifest2.id) return lessonManifest2;
  if (id === lessonManifest3.id) return lessonManifest3;
  return undefined;
}

export function getLessonManifestBySlug(
  stageSlug: string,
  lessonSlug: string
): LessonManifest | undefined {
  const fullId = `lesson.${stageSlug}.${lessonSlug}`;
  return getLessonManifest(fullId);
}

export function getAllLessonManifests(): LessonManifest[] {
  return [lessonManifest1, lessonManifest2, lessonManifest3];
}

export function getStageManifest() {
  return stageManifest;
}
