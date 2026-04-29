import Button from "./Button";
import styles from "./Error.module.css";

interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function Error({ title = "Something went wrong", message, onRetry }: ErrorProps) {
  return (
    <div className={styles.error} role="alert">
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
