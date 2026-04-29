/**
 * Corpus type definitions — Korean Language Learning Platform
 *
 * All entities use short scoped slugs within their own files.
 * Full IDs are constructed at import/build time via id.ts utilities.
 */

// ---------------------------------------------------------------------------
// 1. Vocabulary
// ---------------------------------------------------------------------------

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "particle"
  | "pronoun"
  | "copula"
  | "suffix"
  | "counter"
  | "conjunction"
  | "interjection"
  | "number";

export interface VocabularyEntry {
  /** Scoped slug, e.g. 'annyeonghada' */
  slug: string;
  /** Korean dictionary form */
  korean: string;
  /** English glosses. First is primary; subsequent are variants. */
  english: string[];
  partOfSpeech: PartOfSpeech;
  /** Optional tags: 'honorific', 'humble', etc. */
  tags?: string[];
  /** True if this verb/adjective has irregular conjugation patterns */
  irregular?: boolean;
  /**
   * Notes for the lemmatizer / validator.
   * E.g. attested inflected forms that may not be caught automatically,
   * or exceptions to standard morphology.
   */
  inflectionNotes?: string;
  /** Optional relative paths to audio files */
  audio?: string[];
}

// ---------------------------------------------------------------------------
// 2. Grammar — Machine-Readable Tags
// ---------------------------------------------------------------------------

export type GrammarRegister =
  | "polite-formal"
  | "polite-informal"
  | "plain"
  | "honorific";

export type GrammarStructuralType =
  | "particle"
  | "verb-ending"
  | "sentence-pattern"
  | "expression"
  | "copula"
  | "nominalizer"
  | "conjunction";

export type GrammarAppliesTo =
  | "noun-following"
  | "pronoun-following"
  | "verb-stem-following"
  | "adjective-stem-following"
  | "copula-following"
  | "sentence-initial"
  | "sentence-final"
  | "context-dependent";

export interface GrammarExample {
  korean: string;
  english: string;
}

export interface GrammarTable {
  id: string;
  type: "conjugation" | "comparison" | "generic";
  headers: string[];
  rows: string[][];
}

export interface GrammarPoint {
  /** Scoped slug, e.g. 'equational-expression' */
  slug: string;
  title: string;
  /** The structural pattern, e.g. 'N1은/는 N2이에요/예요' */
  pattern: string;
  description: string;
  examples: GrammarExample[];
  tables?: GrammarTable[];

  // Machine-readable tags for validation and generation
  register: GrammarRegister;
  structuralType: GrammarStructuralType;
  /** What this grammar attaches to or operates on */
  appliesTo: GrammarAppliesTo[];
  /** Full grammar IDs that must be introduced before this one */
  prerequisites?: string[];
}

// ---------------------------------------------------------------------------
// 3. Expressions
// ---------------------------------------------------------------------------

export interface ExpressionTable {
  id: string;
  type: "generic" | "comparison";
  headers: string[];
  rows: string[][];
}

export interface ExpressionEntry {
  /** Scoped slug, e.g. 'annyeonghaseyo' */
  slug: string;
  title: string;
  description: string;
  tables?: ExpressionTable[];
}

// ---------------------------------------------------------------------------
// 4. Stories / Readers
// ---------------------------------------------------------------------------

export interface Story {
  /** Scoped slug, e.g. 'korean-class' */
  slug: string;
  title: string;
  /** Author name, if known */
  author?: string;
  /** Korean prose. Plain text; annotation markers may be added later. */
  prose: string;
  /** Optional translation for testing / debugging */
  translation?: string;
  /** Optional relative path to audio file */
  audio?: string;
}

// ---------------------------------------------------------------------------
// 5. Activities
// ---------------------------------------------------------------------------

export type ActivityType =
  | "vocab-introduction"
  | "flashcards"
  | "listening-clip"
  | "mixed-language-reader"
  | "cloze-quiz";

export interface BaseActivityConfig {
  type: ActivityType;
}

export interface VocabIntroductionConfig extends BaseActivityConfig {
  type: "vocab-introduction";
  /** Full vocab IDs. If omitted, defaults to lesson introduces.vocabulary */
  vocab?: string[];
}

export interface FlashcardsConfig extends BaseActivityConfig {
  type: "flashcards";
  /** Full vocab IDs */
  vocab: string[];
}

export interface ListeningClipConfig extends BaseActivityConfig {
  type: "listening-clip";
  /** Full story ID */
  story: string;
}

export interface MixedLanguageReaderConfig extends BaseActivityConfig {
  type: "mixed-language-reader";
  /** Full story ID */
  story: string;
}

export interface ClozeQuizConfig extends BaseActivityConfig {
  type: "cloze-quiz";
  /** Array of { sentence, answer, distractors } */
  items: Array<{
    sentence: string;
    answer: string;
    distractors: string[];
  }>;
}

export type ActivityConfig =
  | VocabIntroductionConfig
  | FlashcardsConfig
  | ListeningClipConfig
  | MixedLanguageReaderConfig
  | ClozeQuizConfig;

// ---------------------------------------------------------------------------
// 6. Lesson Manifest
// ---------------------------------------------------------------------------

export interface LessonTitle {
  en: string;
  kr: string;
}

export interface EntitySet {
  vocabulary: string[]; // full IDs
  grammar: string[]; // full IDs
  expressions: string[]; // full IDs
  stories: string[]; // full IDs
}

export interface LessonManifest {
  /** Full ID, e.g. 'lesson.beginning-1.lesson-1' */
  id: string;
  title: LessonTitle;
  /** Entities first introduced in this lesson */
  introduces: EntitySet;
  /**
   * Entities from earlier lessons that this lesson explicitly reactivates.
   * Natural reuse in stories does not count; this is for pedagogical reactivation.
   */
  reinforces: EntitySet;
  /** Ordered list of activities for this lesson */
  activities: ActivityConfig[];
  /** Optional prose description of the lesson's purpose */
  description?: string;
  /** One-line summary for stage listings */
  summary?: string;
}

// ---------------------------------------------------------------------------
// 7. Stage Manifest
// ---------------------------------------------------------------------------

export interface LessonRef {
  /** Full lesson ID */
  id: string;
  title: LessonTitle;
  /** One-line description */
  summary?: string;
}

export interface StageManifest {
  /** Full ID, e.g. 'stage.beginning-1' */
  id: string;
  title: LessonTitle;
  description?: string;
  /** Ordered list of lessons in this stage */
  lessons: LessonRef[];
}

// ---------------------------------------------------------------------------
// 8. Constraint Set
// ---------------------------------------------------------------------------

export interface ConstraintSet {
  vocabulary: string[];
  grammar: string[];
  expressions: string[];
  stories: string[];
}
