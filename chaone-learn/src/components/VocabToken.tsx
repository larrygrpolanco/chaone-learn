"use client";

import { useState } from "react";
import styles from "./VocabToken.module.css";

type TokenState = "known" | "unknown" | "highlighted";

interface VocabTokenProps {
  korean: string;
  gloss?: string;
  state?: TokenState;
  onClick?: () => void;
}

export default function VocabToken({
  korean,
  gloss,
  state = "known",
  onClick,
}: VocabTokenProps) {
  const [showGloss, setShowGloss] = useState(false);

  const isUnknown = state === "unknown";
  const isHighlighted = state === "highlighted";

  return (
    <span
      className={`${styles.token} ${isUnknown ? styles.unknown : ""} ${isHighlighted ? styles.highlighted : ""}`}
      lang="ko"
      onClick={onClick}
      onMouseEnter={() => setShowGloss(true)}
      onMouseLeave={() => setShowGloss(false)}
      role={gloss ? "button" : undefined}
      tabIndex={gloss ? 0 : undefined}
      aria-label={gloss ? `${korean} — ${gloss}` : korean}
    >
      {isUnknown && gloss ? (
        <span className={styles.gloss}>{gloss}</span>
      ) : (
        <span className={styles.korean}>{korean}</span>
      )}

      {gloss && showGloss && !isUnknown && (
        <span className={styles.tooltip}>{gloss}</span>
      )}
    </span>
  );
}
