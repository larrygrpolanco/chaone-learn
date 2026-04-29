import { ReactNode } from "react";
import styles from "./Panel.module.css";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export default function Panel({ children, className = "" }: PanelProps) {
  return <div className={`${styles.panel} ${className}`}>{children}</div>;
}
