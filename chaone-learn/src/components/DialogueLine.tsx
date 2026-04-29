import styles from "./DialogueLine.module.css";

interface DialogueLineProps {
  speaker: string;
  korean: string;
  gloss?: string;
}

export default function DialogueLine({ speaker, korean, gloss }: DialogueLineProps) {
  return (
    <div className={styles.line}>
      <span className={styles.speaker}>{speaker}</span>
      <p className={styles.korean} lang="ko">
        {korean}
      </p>
      {gloss && <p className={styles.gloss}>{gloss}</p>}
    </div>
  );
}
