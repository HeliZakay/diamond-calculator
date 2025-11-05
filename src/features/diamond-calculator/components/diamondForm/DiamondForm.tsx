import { useEffect, useState } from "react";
import type { Cut, Color, Clarity } from "@/features/diamond-calculator/types";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "@/features/diamond-calculator/constants/diamondFactors";
import styles from "./DiamondForm.module.css";
import { useDiamondCalcContext } from "@/features/diamond-calculator/contexts/DiamondCalcContext";

export function DiamondForm() {
  const { carat, cut, color, clarity, setCarat, setClarity, setColor, setCut } =
    useDiamondCalcContext();

  // Input constraints
  const MAX_CHARS = 6;
  const MIN_VALUE = 0;
  const MAX_VALUE = 999999;
  const DECIMALS = 2;

  // Local text state to support smooth typing (e.g. temporary empty input)
  const [caratStr, setCaratStr] = useState(String(carat));

  useEffect(() => {
    setCaratStr(String(carat));
  }, [carat]);

  const onCaratChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.currentTarget.value;

    // Limit input length at the UI level
    if (v.length > MAX_CHARS) return;

    // Allow temporary empty state
    if (v === "") {
      setCaratStr("");
      setCarat(0);
      return;
    }

    // Disallow negative values
    if (v.includes("-")) return;

    const n = Number(v);
    if (Number.isNaN(n)) return;

    // Reject values outside allowed range
    if (n < MIN_VALUE || n > MAX_VALUE) return;

    setCaratStr(v);
    setCarat(n);
  };

  const onCaratBlur = () => {
    // Normalize empty input on blur
    if (caratStr === "") {
      setCarat(0);
      setCaratStr("0");
      return;
    }

    const n = Number(caratStr);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(Math.max(n, MIN_VALUE), MAX_VALUE);
      const factor = Math.pow(10, DECIMALS);
      const normalized = Math.round(clamped * factor) / factor;
      setCarat(normalized);
      setCaratStr(String(normalized));
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <label className={styles.field}>
        <span className={styles.label}>Carat</span>
        <input
          type="number"
          inputMode="decimal"
          step={0.01}
          min={MIN_VALUE}
          max={MAX_VALUE}
          value={caratStr}
          onChange={onCaratChange}
          onBlur={onCaratBlur}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          className={styles.input}
        />
      </label>

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
