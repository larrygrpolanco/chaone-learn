import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  visible?: boolean;
}

export default function Toast({ message, visible = true }: ToastProps) {
  if (!visible) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.message}>{message}</span>
    </div>
  );
}
