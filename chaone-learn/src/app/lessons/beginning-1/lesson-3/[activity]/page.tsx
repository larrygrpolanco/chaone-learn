import { lessonManifest } from "@/content/lessons/beginning-1/lesson-3";
import ActivityShell from "@/components/ActivityShell";

export function generateStaticParams() {
  return lessonManifest.activities.map((a) => ({ activity: a.type }));
}

export default async function Lesson3ActivityPage(props: PageProps<'/lessons/beginning-1/lesson-3/[activity]'>) {
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
