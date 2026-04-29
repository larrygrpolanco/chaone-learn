import AppFrame from "@/components/AppFrame";
import styles from "./page.module.css";

export default function KitchenSink() {
  return (
    <AppFrame measure="wide">
      <div className={styles.page}>
        <h1 className={styles.heading}>Kitchen Sink</h1>
        <p className={styles.description}>
          Living documentation of every component in every state.
          Will be populated in Phase 3.
        </p>
      </div>
    </AppFrame>
  );
}
