"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = "md", label, error, className = "", ...props }, ref) => {
    const classes = [styles.input, styles[inputSize], error ? styles.error : "", className].join(" ");

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input ref={ref} className={classes} {...props} />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
