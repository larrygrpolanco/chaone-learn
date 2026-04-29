/**
 * Lightweight navigation tree extracted from corpus manifests.
 * Used by the Sidebar to avoid bundling full lesson content into the client.
 */

import { stageManifest } from "@/content/stages/beginning-1";
import { lessonManifest as lesson1 } from "@/content/lessons/beginning-1/lesson-1";
import { lessonManifest as lesson2 } from "@/content/lessons/beginning-1/lesson-2";
import { lessonManifest as lesson3 } from "@/content/lessons/beginning-1/lesson-3";

export interface NavActivity {
  id: string;
  type: string;
  label: string;
}

export interface NavLesson {
  id: string;
  title: { en: string; kr: string };
  summary?: string;
  activities: NavActivity[];
}

export interface NavStage {
  id: string;
  title: { en: string; kr: string };
  lessons: NavLesson[];
}

export interface NavTrack {
  id: string;
  label: string;
  stages: NavStage[];
}

function activityLabel(type: string): string {
  const labels: Record<string, string> = {
    "vocab-introduction": "Vocabulary Introduction",
    flashcards: "Flashcards",
    "listening-clip": "Listening Clip",
    "mixed-language-reader": "Mixed-language Reader",
    "cloze-quiz": "Cloze Quiz",
  };
  return labels[type] ?? type;
}

function extractLessonActivities(lessonId: string): NavActivity[] {
  let manifest;
  if (lessonId.endsWith("lesson-1")) manifest = lesson1;
  else if (lessonId.endsWith("lesson-2")) manifest = lesson2;
  else if (lessonId.endsWith("lesson-3")) manifest = lesson3;
  else return [];

  return manifest.activities.map((a, i) => ({
    id: `${lessonId}/${a.type}-${i}`,
    type: a.type,
    label: activityLabel(a.type),
  }));
}

export const navTree: NavTrack[] = [
  {
    id: "track-lessons",
    label: "Lessons",
    stages: [
      {
        id: stageManifest.id,
        title: stageManifest.title,
        lessons: stageManifest.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          summary: l.summary,
          activities: extractLessonActivities(l.id),
        })),
      },
    ],
  },
];
