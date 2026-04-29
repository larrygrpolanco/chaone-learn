import AppFrame from "@/components/AppFrame";
import styles from "./page.module.css";

export default function LessonsTrack() {
  return (
    <AppFrame measure="default">
      <div className={styles.page}>
        <h1 className={styles.heading}>Lessons</h1>
        <p className={styles.description}>
          Structured stages from beginner to intermediate.
        </p>

        <div className={styles.stageList}>
          <a href="/lessons/beginning-1" className={styles.stageCard}>
            <h2 className={styles.stageTitle}>Beginning 1</h2>
            <p className={styles.stageDescription}>
              Greetings, introductions, numbers, and everyday objects.
            </p>
          </a>
        </div>
      </div>
    </AppFrame>
  );
}
