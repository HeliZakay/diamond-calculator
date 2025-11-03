import { useEffect, useState } from "react";
import type { Cut, Color, Clarity } from "../types";
import styles from "./DiamondForm.module.css";

type Props = {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  onCaratChange: (v: number) => void;
  onCutChange: (v: Cut) => void;
  onColorChange: (v: Color) => void;
  onClarityChange: (v: Clarity) => void;
  CUT_FACTORS: Record<Cut, number>;
  COLOR_FACTORS: Record<Color, number>;
  CLARITY_FACTORS: Record<Clarity, number>;
};

export function DiamondForm({
  carat,
  cut,
  color,
  clarity,
  onCaratChange,
  onCutChange,
  onColorChange,
  onClarityChange,
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
}: Props) {
  const MAX_CHARS = 5; // limit input to 5 characters (including decimal point)
  // Local input state to avoid forced leading zeros (e.g., "02") and allow empty typing
  const [caratStr, setCaratStr] = useState<string>(String(carat));

  // Keep local string in sync when external carat changes (e.g., programmatic updates)
  useEffect(() => {
    setCaratStr(String(carat));
  }, [carat]);

  const normalize = (v: string) => {
    // Trim spaces
    let s = v.trim();
    // Allow empty during editing
    if (s === "") return s;
    // Remove leading zeros except when followed by a decimal point
    if (s.startsWith("0") && s.length > 1 && s[1] !== ".") {
      s = s.replace(/^0+/, "");
      if (s === "") s = "0"; // if it was all zeros
    }
    // Enforce character limit
    if (s.length > MAX_CHARS) s = s.slice(0, MAX_CHARS);
    return s;
  };

  const onCaratInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = normalize(raw);
    // Accept only digits and at most one decimal point (simple guard for type=text/number differences)
    if (!/^\d*(?:\.?\d*)?$/.test(next)) {
      // ignore invalid characters
      return;
    }
    setCaratStr(next);
    // If the field is empty, reflect price as 0 immediately
    if (next === "") {
      onCaratChange(0);
      return;
    }
    // Update parent only when we have a "solid" numeric value (not empty or just ".")
    if (next !== "" && next !== ".") {
      const num = Number(next);
      if (!Number.isNaN(num)) {
        onCaratChange(num);
      }
    }
  };

  const onCaratInputBlur = () => {
    if (caratStr === "") {
      // If left empty, default to 0 per UX requirement
      onCaratChange(0);
      setCaratStr("0");
      return;
    }
    // Ensure the parent gets the final parsed value (e.g., if user leaves a trailing dot)
    const parsed = Number(caratStr);
    if (!Number.isNaN(parsed)) {
      onCaratChange(parsed);
      setCaratStr(String(parsed).slice(0, MAX_CHARS));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Carat */}
      <label className={styles.field}>
        <span className={styles.label}>Carat</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={caratStr}
          onChange={onCaratInputChange}
          onBlur={onCaratInputBlur}
          className={styles.input}
        />
      </label>

      {/* Cut */}
      <label className={styles.field}>
        <span className={styles.label}>Cut</span>
        <select
          value={cut}
          onChange={(e) => onCutChange(e.target.value as Cut)}
          className={styles.input}
        >
          {(Object.keys(CUT_FACTORS) as Cut[]).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {/* Color */}
      <label className={styles.field}>
        <span className={styles.label}>Color</span>
        <select
          value={color}
          onChange={(e) => onColorChange(e.target.value as Color)}
          className={styles.input}
        >
          {(Object.keys(COLOR_FACTORS) as Color[]).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {/* Clarity */}
      <label className={styles.field}>
        <span className={styles.label}>Clarity</span>
        <select
          value={clarity}
          onChange={(e) => onClarityChange(e.target.value as Clarity)}
          className={styles.input}
        >
          {(Object.keys(CLARITY_FACTORS) as Clarity[]).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
