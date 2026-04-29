"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./AudioButton.module.css";

interface AudioButtonProps {
  src?: string;
  size?: "sm" | "md" | "lg";
}

export default function AudioButton({ src, size = "md" }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggle = useCallback(() => {
    if (!src) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(false);
      audio.play().catch(() => {
        setIsLoading(false);
        setError(true);
      });
    }
  }, [isPlaying, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  return (
    <button
      className={`${styles.button} ${styles[size]} ${isPlaying ? styles.playing : ""} ${!src || error ? styles.disabled : ""}`}
      onClick={toggle}
      disabled={!src || error}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : isPlaying ? (
        <PauseIcon />
      ) : (
        <PlayIcon />
      )}
      {src && <audio ref={audioRef} src={src} preload="none" />}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
