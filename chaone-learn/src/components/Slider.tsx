"use client";

import { useCallback } from "react";
import styles from "./Slider.module.css";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  disabled,
}: SliderProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.trackArea} style={{ "--thumb-left": `${percent}%` } as React.CSSProperties}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${percent}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.input}
          aria-label={label}
        />
      </div>
    </div>
  );
}
