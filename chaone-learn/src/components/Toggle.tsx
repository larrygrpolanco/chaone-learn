"use client";

import { useState } from "react";
import styles from "./Toggle.module.css";

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  disabled,
}: ToggleProps) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        className={`${styles.track} ${checked ? styles.checked : ""}`}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
