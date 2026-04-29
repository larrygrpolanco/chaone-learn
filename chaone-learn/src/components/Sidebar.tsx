"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./Sidebar.module.css";
import { navTree } from "@/lib/nav-data";

interface SidebarProps {
  /** When true, sidebar defaults collapsed (for reader frame) */
  readerMode?: boolean;
  /** Current story title to display in reader mode header */
  storyTitle?: string;
}

export default function Sidebar({ readerMode = false, storyTitle }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "track-lessons": true,
    [navTree[0]?.stages[0]?.id ?? "beginning-1"]: true,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  // Body scroll lock when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Determine current page label for mobile header
  const currentLabel = storyTitle ?? navTree[0]?.label ?? "Lessons";

  return (
    <>
      {/* Desktop sidebar + Mobile drawer */}
      <aside
        className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ""} ${readerMode ? styles.readerMode : ""}`}
        aria-label="Primary navigation"
      >
        {/* Header — hamburger + logo on mobile; just logo on desktop */}
        <div className={styles.header}>
          <button
            className={styles.hamburger}
            onClick={drawerOpen ? closeDrawer : openDrawer}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="sidebar-nav"
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <a href="/" className={styles.logo}>
            Chaone
          </a>
          {readerMode && storyTitle && (
            <span className={styles.readerTitle}>{storyTitle}</span>
          )}
        </div>

        {/* Nav tree */}
        <nav
          id="sidebar-nav"
          className={styles.nav}
          aria-label="Primary"
        >
          {navTree.map((track) => (
            <div key={track.id} className={styles.track}>
              <button
                className={styles.trackLabel}
                onClick={() => toggle(track.id)}
                aria-expanded={expanded[track.id]}
              >
                {track.label}
              </button>

              {expanded[track.id] && (
                <div className={styles.stageList}>
                  {track.stages.map((stage) => (
                    <div key={stage.id} className={styles.stage}>
                      <button
                        className={styles.stageLabel}
                        onClick={() => toggle(stage.id)}
                        aria-expanded={expanded[stage.id]}
                      >
                        {stage.title.en}
                      </button>

                      {expanded[stage.id] && (
                        <div className={styles.lessonList}>
                          {stage.lessons.map((lesson) => (
                            <div key={lesson.id}>
                              <a
                                href={`/lessons/${stage.id.split(".").pop()}/${lesson.id.split(".").pop()}`}
                                className={styles.lessonLink}
                                title={lesson.summary}
                                onClick={closeDrawer}
                              >
                                {lesson.id.split(".").pop()?.replace("lesson-", "Lesson ")} — {lesson.title.en}
                              </a>

                              {lesson.activities.length > 0 && (
                                <div className={styles.activityList}>
                                  {lesson.activities.map((activity) => (
                                    <a
                                      key={activity.id}
                                      href={`/lessons/${stage.id.split(".").pop()}/${lesson.id.split(".").pop()}/${activity.type}`}
                                      className={styles.activityLink}
                                      onClick={closeDrawer}
                                    >
                                      {activity.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <span className={styles.footerText}>Prototype</span>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
