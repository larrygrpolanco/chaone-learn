/**
 * Constraint set computation.
 *
 * For any given lesson, the constraint set is the union of all
 * vocabulary, grammar, expressions, and stories from that lesson
 * and every earlier lesson in its stage.
 */

import type { ConstraintSet } from "@/lib/types";
import { stageManifest } from "@/content/stages/beginning-1";
import { lessonManifest as lesson1 } from "@/content/lessons/beginning-1/lesson-1";
import { lessonManifest as lesson2 } from "@/content/lessons/beginning-1/lesson-2";
import { lessonManifest as lesson3 } from "@/content/lessons/beginning-1/lesson-3";

// Map stage IDs to their ordered lesson manifests.
// In a multi-stage future, this would be generated or discovered.
const stageLessons: Record<string, Array<{ id: string; manifest: { introduces: ConstraintSet; reinforces: ConstraintSet } }>> = {
  [stageManifest.id]: [
    { id: lesson1.id, manifest: lesson1 },
    { id: lesson2.id, manifest: lesson2 },
    { id: lesson3.id, manifest: lesson3 },
  ],
};

function unionSets(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

function mergeConstraintSets(a: ConstraintSet, b: ConstraintSet): ConstraintSet {
  return {
    vocabulary: unionSets(a.vocabulary, b.vocabulary),
    grammar: unionSets(a.grammar, b.grammar),
    expressions: unionSets(a.expressions, b.expressions),
    stories: unionSets(a.stories, b.stories),
  };
}

/**
 * Compute the constraint set for a given lesson.
 *
 * Returns the union of `introduces` and `reinforces` from every lesson
 * up to and including the target lesson, in stage order.
 *
 * @param stageId e.g. "stage.beginning-1"
 * @param lessonId e.g. "lesson.beginning-1.lesson-2"
 * @throws if the stage or lesson is not found
 */
export function getConstraintSet(stageId: string, lessonId: string): ConstraintSet {
  const lessons = stageLessons[stageId];
  if (!lessons) {
    throw new Error(`Stage not found: ${stageId}`);
  }

  let accumulated: ConstraintSet = {
    vocabulary: [],
    grammar: [],
    expressions: [],
    stories: [],
  };

  for (const entry of lessons) {
    // Each lesson's scope = what it introduces + what it reinforces
    const lessonScope = mergeConstraintSets(entry.manifest.introduces, entry.manifest.reinforces);
    accumulated = mergeConstraintSets(accumulated, lessonScope);

    if (entry.id === lessonId) {
      return accumulated;
    }
  }

  throw new Error(`Lesson not found in stage ${stageId}: ${lessonId}`);
}

/**
 * Shorthand for the beginning-1 stage.
 */
export function getBeginning1ConstraintSet(lessonId: string): ConstraintSet {
  return getConstraintSet("stage.beginning-1", lessonId);
}
