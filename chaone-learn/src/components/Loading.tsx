import styles from "./Loading.module.css";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className={styles.loading} aria-live="polite" aria-busy="true">
      <div className={styles.skeleton} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
