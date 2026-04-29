import AppFrame from "@/components/AppFrame";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import { getStageManifest, getAllLessonManifests } from "@/lib/content-loader";
import styles from "./page.module.css";

export default function StagePage() {
  const stage = getStageManifest();
  const lessons = getAllLessonManifests();

  const crumbs = [
    { label: "Lessons", href: "/lessons" },
    { label: stage.title.en },
  ];

  return (
    <AppFrame measure="default">
      <div className={styles.page}>
        <Breadcrumb crumbs={crumbs} />

        <PageHeader
          title={stage.title.en}
          subtitle={stage.title.kr}
          metadata={stage.description}
        />

        <section className={styles.lessonList}>
          <h2 className={styles.sectionHeading}>Lessons</h2>
          <ol className={styles.list}>
            {lessons.map((lesson, index) => (
              <li key={lesson.id} className={styles.lessonItem}>
                <a
                  href={`/lessons/beginning-1/${lesson.id.split(".").pop()}`}
                  className={styles.lessonLink}
                >
                  <span className={styles.lessonNumber}>{index + 1}</span>
                  <div className={styles.lessonInfo}>
                    <span className={styles.lessonTitle}>
                      {lesson.title.kr} — {lesson.title.en}
                    </span>
                    {lesson.summary && (
                      <span className={styles.lessonSummary}>
                        {lesson.summary}
                      </span>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <footer className={styles.footer}>
          <span className={styles.footerText}>
            Next stage: Intermediate 1 — coming soon.
          </span>
        </footer>
      </div>
    </AppFrame>
  );
}
