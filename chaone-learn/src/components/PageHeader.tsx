import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  metadata?: string;
}

export default function PageHeader({ title, subtitle, metadata }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {metadata && <p className={styles.metadata}>{metadata}</p>}
    </header>
  );
}
