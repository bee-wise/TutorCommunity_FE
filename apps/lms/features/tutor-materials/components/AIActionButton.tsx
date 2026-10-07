"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./AIActionButton.module.css";

type AIActionButtonProps = ComponentPropsWithoutRef<"button">;

export function AIActionButton({
  children,
  className = "",
  type = "button",
  ...props
}: AIActionButtonProps) {
  return (
    <button {...props} type={type} className={`${styles.button} ${className}`}>
      <span className={styles.content}>
        <span className={styles.label}>{children}</span>
      </span>
    </button>
  );
}
