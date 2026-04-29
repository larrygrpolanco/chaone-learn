"use client";

import type { LessonManifest, ActivityConfig } from "@/lib/types";
import AppFrame from "@/components/AppFrame";
import ReaderFrame from "@/components/ReaderFrame";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import VocabCard from "@/components/VocabCard";
import Panel from "@/components/Panel";
import { getVocabById, getStoryById } from "@/lib/content-loader";
import styles from "./ActivityShell.module.css";

interface ActivityShellProps {
  manifest: LessonManifest;
  activityType: string;
  stageSlug: string;
}

function activityLabel(type: string): string {
  const labels: Record<string, string> = {
    "vocab-introduction": "Vocabulary Introduction",
    flashcards: "Flashcards",
    "listening-clip": "Listening Clip",
    "mixed-language-reader": "Mixed-language Reader",
    "cloze-quiz": "Cloze Quiz",
  };
  return labels[type] ?? type;
}

function activityDescription(type: string): string {
  switch (type) {
    case "vocab-introduction":
      return "New vocabulary with glosses and audio.";
    case "flashcards":
      return "Front/back cards for this lesson's vocabulary.";
    case "mixed-language-reader":
      return "A graded reader with mixed-language substitution.";
    case "listening-clip":
      return "Audio clip with transcript.";
    case "cloze-quiz":
      return "Fill-in-the-blank practice.";
    default:
      return "Activity.";
  }
}

export default function ActivityShell({
  manifest,
  activityType,
  stageSlug,
}: ActivityShellProps) {
  const lessonSlug = manifest.id.split(".").pop() ?? "";
  const activityConfig = manifest.activities.find(
    (a: ActivityConfig) => a.type === activityType
  );

  const crumbs = [
    { label: "Lessons", href: "/lessons" },
    { label: "Beginning 1", href: `/lessons/${stageSlug}` },
    {
      label: manifest.title.en,
      href: `/lessons/${stageSlug}/${lessonSlug}`,
    },
    { label: activityLabel(activityType) },
  ];

  const isReader = activityType === "mixed-language-reader";
  const Frame = isReader ? ReaderFrame : AppFrame;
  const measure = isReader ? ("wide" as const) : ("default" as const);

  return (
    <Frame measure={measure}>
      <div className={styles.page}>
        <Breadcrumb crumbs={crumbs} />

        <PageHeader
          title={activityLabel(activityType)}
          subtitle={activityDescription(activityType)}
        />

        <div className={styles.body}>
          {renderActivityBody(activityType, activityConfig, manifest)}
        </div>

        <footer className={styles.footer}>
          <a
            href={`/lessons/${stageSlug}/${lessonSlug}`}
            className={styles.backLink}
          >
            ← Back to lesson
          </a>
        </footer>
      </div>
    </Frame>
  );
}

function renderActivityBody(
  type: string,
  config: ActivityConfig | undefined,
  manifest: LessonManifest
) {
  if (!config) {
    return (
      <div className={styles.empty}>
        <p>Activity not found in this lesson.</p>
      </div>
    );
  }

  switch (type) {
    case "vocab-introduction": {
      const vocabIds =
        (config as { vocab?: string[] }).vocab ??
        manifest.introduces.vocabulary;
      const vocab = vocabIds
        .map((id: string) => getVocabById(id))
        .filter(Boolean);
      return (
        <div className={styles.vocabIntro}>
          {vocab.map((v) => (
            <div key={v!.slug} className={styles.vocabRow}>
              <span className={styles.vocabKorean} lang="ko">
                {v!.korean}
              </span>
              <span className={styles.vocabGloss}>
                {v!.english.join(", ")}
              </span>
              <span className={styles.vocabPos}>{v!.partOfSpeech}</span>
            </div>
          ))}
        </div>
      );
    }

    case "flashcards": {
      const vocabIds =
        (config as { vocab?: string[] }).vocab ??
        manifest.introduces.vocabulary;
      const vocab = vocabIds
        .map((id: string) => getVocabById(id))
        .filter(Boolean);
      const first = vocab[0];
      if (!first) {
        return (
          <div className={styles.empty}>
            <p>No vocabulary for flashcards.</p>
          </div>
        );
      }
      return (
        <div className={styles.flashcardArea}>
          <VocabCard
            korean={first.korean}
            english={first.english}
            partOfSpeech={first.partOfSpeech}
          />
          <p className={styles.flashcardHint}>
            Press space to flip · Arrow keys to navigate
          </p>
          <div className={styles.flashcardControls}>
            <span className={styles.flashcardCounter}>
              1 / {vocab.length}
            </span>
          </div>
        </div>
      );
    }

    case "mixed-language-reader": {
      const storyId = (config as { story: string }).story;
      const story = getStoryById(storyId);
      if (!story) {
        return (
          <div className={styles.empty}>
            <p>Story not found.</p>
          </div>
        );
      }
      return (
        <Panel>
          <div className={styles.readerHeader}>
            <h2 className={styles.readerTitle}>{story.title}</h2>
            {story.author && (
              <span className={styles.readerAuthor}>{story.author}</span>
            )}
          </div>
          <div className={styles.readerProse} lang="ko">
            {story.prose.split("\n\n").map((paragraph, i) => (
              <p key={i} className={styles.readerParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </Panel>
      );
    }

    case "listening-clip": {
      return (
        <div className={styles.empty}>
          <p>Listening clip — audio not yet available.</p>
        </div>
      );
    }

    case "cloze-quiz": {
      return (
        <div className={styles.empty}>
          <p>Cloze quiz — coming soon.</p>
        </div>
      );
    }

    default:
      return (
        <div className={styles.empty}>
          <p>Activity type not yet implemented: {type}</p>
        </div>
      );
  }
}
