import type { LessonManifest, ActivityConfig } from "@/lib/types";
import AppFrame from "@/components/AppFrame";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";
import ActivityLauncher from "@/components/ActivityLauncher";
import GrammarBlock from "@/components/GrammarBlock";
import ExpressionBlock from "@/components/ExpressionBlock";
import AudioButton from "@/components/AudioButton";
import InlineTag from "@/components/InlineTag";
import {
  getVocabById,
  getGrammarById,
  getExpressionById,
} from "@/lib/content-loader";
import styles from "./LessonHubShell.module.css";

interface LessonHubShellProps {
  manifest: LessonManifest;
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

function activityDescription(type: string, manifest: LessonManifest): string {
  switch (type) {
    case "vocab-introduction":
      return `${manifest.introduces.vocabulary.length} vocabulary items with audio and glosses.`;
    case "flashcards":
      return `${manifest.introduces.vocabulary.length} cards covering this lesson's vocabulary.`;
    case "mixed-language-reader":
      return "A graded reader with known tokens in Korean and unknown tokens in English.";
    case "listening-clip":
      return "An audio clip with transcript and comprehension check.";
    case "cloze-quiz":
      return "Fill-in-the-blank practice with this lesson's vocabulary.";
    default:
      return "Practice activity.";
  }
}

export default function LessonHubShell({
  manifest,
  stageSlug,
}: LessonHubShellProps) {
  const lessonSlug = manifest.id.split(".").pop() ?? "";

  const crumbs = [
    { label: "Lessons", href: "/lessons" },
    { label: "Beginning 1", href: `/lessons/${stageSlug}` },
    { label: manifest.title.en },
  ];

  const metadata = `Introduces ${manifest.introduces.vocabulary.length} vocabulary, ${manifest.introduces.grammar.length} grammar points, ${manifest.introduces.expressions.length} expressions.`;

  const vocabPreview = manifest.introduces.vocabulary
    .map((id) => getVocabById(id))
    .filter(Boolean);

  const grammarPreview = manifest.introduces.grammar
    .map((id) => getGrammarById(id))
    .filter(Boolean);

  const expressionPreview = manifest.introduces.expressions
    .map((id) => getExpressionById(id))
    .filter(Boolean);

  const activities = manifest.activities.map((a: ActivityConfig, i: number) => ({
    name: activityLabel(a.type),
    description: activityDescription(a.type, manifest),
    status: "not started",
    order: i + 1,
    href: `/lessons/${stageSlug}/${lessonSlug}/${a.type}`,
  }));

  return (
    <AppFrame measure="default">
      <div className={styles.page}>
        <Breadcrumb crumbs={crumbs} />

        <PageHeader
          title={`${manifest.title.kr} — ${manifest.title.en}`}
          subtitle={manifest.summary}
          metadata={metadata}
        />

        {manifest.description && (
          <section className={styles.description}>
            <p>{manifest.description}</p>
          </section>
        )}

        {vocabPreview.length > 0 && (
          <section className={styles.previewSection}>
            <h2 className={styles.sectionHeading}>Vocabulary</h2>
            <ul className={styles.vocabList}>
              {vocabPreview.map((v) => (
                <li key={v!.slug} className={styles.vocabItem}>
                  <span className={styles.vocabKorean} lang="ko">
                    {v!.korean}
                  </span>
                  <span className={styles.vocabGloss}>
                    {v!.english.join(", ")}
                  </span>
                  <InlineTag>{v!.partOfSpeech}</InlineTag>
                  <AudioButton size="sm" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {grammarPreview.length > 0 && (
          <section className={styles.previewSection}>
            <h2 className={styles.sectionHeading}>Grammar</h2>
            <div className={styles.grammarList}>
              {grammarPreview.map((g) => (
                <GrammarBlock key={g!.slug} grammar={g!} />
              ))}
            </div>
          </section>
        )}

        {expressionPreview.length > 0 && (
          <section className={styles.previewSection}>
            <h2 className={styles.sectionHeading}>Expressions</h2>
            <div className={styles.expressionList}>
              {expressionPreview.map((e) => (
                <ExpressionBlock key={e!.slug} expression={e!} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.previewSection}>
          <h2 className={styles.sectionHeading}>Activities</h2>
          <ActivityLauncher activities={activities} />
        </section>

        <footer className={styles.footer}>
          <a
            href={`/lessons/${stageSlug}/${getNextLessonSlug(manifest.id)}`}
            className={styles.nextLink}
          >
            Next lesson →
          </a>
        </footer>
      </div>
    </AppFrame>
  );
}

function getNextLessonSlug(currentId: string): string {
  const order = ["lesson-1", "lesson-2", "lesson-3"];
  const current = currentId.split(".").pop() ?? "";
  const idx = order.indexOf(current);
  if (idx >= 0 && idx < order.length - 1) {
    return order[idx + 1];
  }
  return "";
}
