"use client";

import styles from "./SegmentedControl.module.css";

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps) {
  return (
    <div className={styles.wrapper} role="group" aria-label={label}>
      <div className={styles.control}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`${styles.segment} ${isSelected ? styles.selected : ""}`}
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
