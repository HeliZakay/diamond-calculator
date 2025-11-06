import { useEffect, useState } from "react";
import type { Cut, Color, Clarity } from "../..//types";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "@/features/diamond-calculator/constants/diamondFactors";
import styles from "./DiamondForm.module.css";
import { useDiamondCalcContext } from "@/features/diamond-calculator/contexts/DiamondCalcContext";

export function DiamondForm({}) {
  const ctx = useDiamondCalcContext();

  const { carat, cut, color, clarity, setCarat, setClarity, setColor, setCut } =
    ctx;
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
      setCarat(0);
      return;
    }
    // Update parent only when we have a "solid" numeric value (not empty or just ".")
    if (next !== "" && next !== ".") {
      const num = Number(next);
      if (!Number.isNaN(num)) {
        setCarat(num);
      }
    }
  };

  const onCaratInputBlur = () => {
    if (caratStr === "") {
      // If left empty, default to 0 per UX requirement
      setCarat(0);
      setCaratStr("0");
      return;
    }
    // Ensure the parent gets the final parsed value (e.g., if user leaves a trailing dot)
    const parsed = Number(caratStr);
    if (!Number.isNaN(parsed)) {
      setCarat(parsed);
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
          onChange={(e) => setCut(e.target.value as Cut)}
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
          onChange={(e) => setColor(e.target.value as Color)}
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
          onChange={(e) => setClarity(e.target.value as Clarity)}
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
