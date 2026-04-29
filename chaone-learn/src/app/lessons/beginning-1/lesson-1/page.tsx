import { lessonManifest } from "@/content/lessons/beginning-1/lesson-1";
import LessonHubShell from "@/components/LessonHubShell";

export default function Lesson1Hub() {
  return <LessonHubShell manifest={lessonManifest} stageSlug="beginning-1" />;
}
