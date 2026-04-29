"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import styles from "./AppFrame.module.css";

interface AppFrameProps {
  children: ReactNode;
  measure?: "narrow" | "default" | "wide";
}

export default function AppFrame({ children, measure = "default" }: AppFrameProps) {
  return (
    <div className={styles.frame}>
      <Sidebar />
      <main className={styles.content} data-measure={measure}>
        {children}
      </main>
    </div>
  );
}
