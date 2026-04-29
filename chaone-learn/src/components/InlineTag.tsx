import styles from "./InlineTag.module.css";

interface InlineTagProps {
  children: React.ReactNode;
  className?: string;
}

export default function InlineTag({ children, className = "" }: InlineTagProps) {
  return <span className={`${styles.tag} ${className}`}>{children}</span>;
}
