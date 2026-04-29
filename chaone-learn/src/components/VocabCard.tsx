"use client";

import { useState } from "react";
import styles from "./VocabCard.module.css";
import AudioButton from "./AudioButton";
import InlineTag from "./InlineTag";

interface VocabCardProps {
  korean: string;
  english: string[];
  partOfSpeech?: string;
  audioSrc?: string;
  flipped?: boolean;
  onFlip?: () => void;
}

export default function VocabCard({
  korean,
  english,
  partOfSpeech,
  audioSrc,
  flipped = false,
  onFlip,
}: VocabCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(flipped);
  const isFlipped = onFlip ? flipped : internalFlipped;

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped((f) => !f);
    }
  };

  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? `Show front` : `Show back`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleFlip();
        }
      }}
    >
      <div className={styles.inner}>
        {/* Front */}
        <div className={styles.face}>
          <span className={styles.korean} lang="ko">
            {korean}
          </span>
          {partOfSpeech && (
            <span className={styles.tag}>
              <InlineTag>{partOfSpeech}</InlineTag>
            </span>
          )}
        </div>

        {/* Back */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.glossList}>
            {english.map((g, i) => (
              <span key={i} className={styles.gloss}>
                {g}
              </span>
            ))}
          </div>
          {audioSrc && (
            <div className={styles.audio}>
              <AudioButton src={audioSrc} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
