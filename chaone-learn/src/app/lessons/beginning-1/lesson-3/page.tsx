import { lessonManifest } from "@/content/lessons/beginning-1/lesson-3";
import LessonHubShell from "@/components/LessonHubShell";

export default function Lesson3Hub() {
  return <LessonHubShell manifest={lessonManifest} stageSlug="beginning-1" />;
}
