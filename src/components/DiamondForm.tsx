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
  return (
    <form className={styles.form}>
      {/* Carat */}
      <label className={styles.field}>
        <span className={styles.label}>Carat</span>
        <input
          type="number"
          step="0.01"
          min="0.1"
          value={carat}
          onChange={(e) => onCaratChange(Number(e.target.value))}
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
