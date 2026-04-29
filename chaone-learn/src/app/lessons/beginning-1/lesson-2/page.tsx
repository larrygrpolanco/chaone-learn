import { lessonManifest } from "@/content/lessons/beginning-1/lesson-2";
import LessonHubShell from "@/components/LessonHubShell";

export default function Lesson2Hub() {
  return <LessonHubShell manifest={lessonManifest} stageSlug="beginning-1" />;
}
