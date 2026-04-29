import styles from "./Empty.module.css";

interface EmptyProps {
  message: string;
  action?: { label: string; href: string };
}

export default function Empty({ message, action }: EmptyProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      {action && (
        <a href={action.href} className={styles.action}>
          {action.label}
        </a>
      )}
    </div>
  );
}
