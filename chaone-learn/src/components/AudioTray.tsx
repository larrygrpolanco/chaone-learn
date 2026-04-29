"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./AudioTray.module.css";
import AudioButton from "./AudioButton";
import Button from "./Button";

interface AudioTrayProps {
  src?: string;
  title?: string;
  onClose?: () => void;
}

export default function AudioTray({ src, title, onClose }: AudioTrayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const time = (Number(e.target.value) / 100) * duration;
      audio.currentTime = time;
      setProgress(Number(e.target.value));
    },
    [duration]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, [src]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.tray}>
      <div className={styles.controls}>
        <AudioButton src={src} />

        <div className={styles.trackArea}>
          {title && <span className={styles.title}>{title}</span>}
          <div className={styles.scrubber}>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className={styles.input}
              aria-label="Audio progress"
            />
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className={styles.time}>
            {formatTime(duration * (progress / 100))} / {formatTime(duration)}
          </span>
        </div>

        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close audio tray">
            ×
          </Button>
        )}
      </div>
      {src && <audio ref={audioRef} src={src} preload="metadata" />}
    </div>
  );
}
