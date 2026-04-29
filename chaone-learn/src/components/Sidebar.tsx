"use client";

import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    lessons: true,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>Chaone</span>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        {/* Track: Lessons */}
        <div className={styles.track}>
          <button
            className={styles.trackLabel}
            onClick={() => toggle("lessons")}
            aria-expanded={expanded.lessons}
          >
            Lessons
          </button>

          {expanded.lessons && (
            <div className={styles.stageList}>
              {/* Stage: Beginning 1 */}
              <div className={styles.stage}>
                <button
                  className={styles.stageLabel}
                  onClick={() => toggle("beginning-1")}
                  aria-expanded={expanded["beginning-1"]}
                >
                  Beginning 1
                </button>

                {expanded["beginning-1"] && (
                  <div className={styles.lessonList}>
                    <a href="/lessons/beginning-1/lesson-1" className={styles.lessonLink}>
                      Lesson 1 — Greetings
                    </a>
                    <a href="/lessons/beginning-1/lesson-2" className={styles.lessonLink}>
                      Lesson 2 — Introductions
                    </a>
                    <a href="/lessons/beginning-1/lesson-3" className={styles.lessonLink}>
                      Lesson 3 — Classroom
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className={styles.footer}>
        <span className={styles.footerText}>Prototype</span>
      </div>
    </aside>
  );
}
