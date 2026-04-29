import AppFrame from "@/components/AppFrame";
import styles from "./page.module.css";

export default function Home() {
  return (
    <AppFrame measure="wide">
      <div className={styles.page}>
        {/* 1. Title block */}
        <section className={styles.titleBlock}>
          <h1 className={styles.productName}>Chaone</h1>
          <p className={styles.description}>
            A resource for learners who want Korean to mean something.
          </p>
        </section>

        {/* 2. Tracks */}
        <section className={styles.tracks}>
          <h2 className={styles.sectionHeading}>Tracks</h2>
          <div className={styles.trackList}>
            <a href="/lessons" className={styles.trackCard}>
              <h3 className={styles.trackTitle}>Lessons</h3>
              <p className={styles.trackDescription}>
                Structured introduction to vocabulary, grammar, and expressions,
                with activities for every lesson.
              </p>
              <span className={styles.trackLink}>Go →</span>
            </a>

            <div className={styles.trackCard}>
              <h3 className={styles.trackTitle}>Graded Readers</h3>
              <p className={styles.trackDescription}>
                Long-form stories calibrated to your stage. Coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Footer note */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            All Korean content is reviewed by a native speaker before shipping.
            This is a prototype — the corpus is growing lesson by lesson.
          </p>
        </footer>
      </div>
    </AppFrame>
  );
}
