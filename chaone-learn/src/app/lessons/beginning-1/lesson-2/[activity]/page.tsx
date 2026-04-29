import { lessonManifest } from "@/content/lessons/beginning-1/lesson-2";
import ActivityShell from "@/components/ActivityShell";

export function generateStaticParams() {
  return lessonManifest.activities.map((a) => ({ activity: a.type }));
}

export default async function Lesson2ActivityPage(props: PageProps<'/lessons/beginning-1/lesson-2/[activity]'>) {
  const params = await props.params;
  const activityType = params.activity;

  return (
    <ActivityShell
      manifest={lessonManifest}
      activityType={activityType}
      stageSlug="beginning-1"
    />
  );
}
