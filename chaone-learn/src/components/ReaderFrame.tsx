"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import styles from "./ReaderFrame.module.css";

interface ReaderFrameProps {
  children: ReactNode;
  storyTitle?: string;
}

export default function ReaderFrame({ children, storyTitle }: ReaderFrameProps) {
  return (
    <div className={styles.frame}>
      <Sidebar readerMode storyTitle={storyTitle} />
      <main className={styles.content} data-mode="reading">
        {children}
      </main>
    </div>
  );
}
