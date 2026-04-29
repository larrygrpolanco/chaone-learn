/**
 * ID construction utilities.
 *
 * Full IDs follow the pattern:
 *   {entity-type}.{stage}.{lesson}.{slug}
 *
 * Within content files, authors use short scoped slugs.
 * These functions assemble the full path at build/import time.
 */

export type EntityType =
  | "vocab"
  | "grammar"
  | "expression"
  | "story"
  | "lesson"
  | "stage";

export function makeId(
  type: EntityType,
  stage: string,
  lesson: string,
  slug: string
): string {
  return `${type}.${stage}.${lesson}.${slug}`;
}

export function makeLessonId(stage: string, lesson: string): string {
  return `lesson.${stage}.${lesson}`;
}

export function makeStageId(stage: string): string {
  return `stage.${stage}`;
}

/** Construct many full vocab IDs at once */
export function vocabIds(
  stage: string,
  lesson: string,
  slugs: string[]
): string[] {
  return slugs.map((s) => makeId("vocab", stage, lesson, s));
}

/** Construct many full grammar IDs at once */
export function grammarIds(
  stage: string,
  lesson: string,
  slugs: string[]
): string[] {
  return slugs.map((s) => makeId("grammar", stage, lesson, s));
}

/** Construct many full expression IDs at once */
export function expressionIds(
  stage: string,
  lesson: string,
  slugs: string[]
): string[] {
  return slugs.map((s) => makeId("expression", stage, lesson, s));
}

/** Construct many full story IDs at once */
export function storyIds(
  stage: string,
  lesson: string,
  slugs: string[]
): string[] {
  return slugs.map((s) => makeId("story", stage, lesson, s));
}
