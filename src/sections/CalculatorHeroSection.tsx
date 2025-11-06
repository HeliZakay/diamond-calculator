import styles from "./CalculatorHeroSection.module.css";
import { DiamondCalculator } from "@/features/diamond-calculator";

export function CalculatorHeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles["hero__overlay"]} />

      <div className={styles["hero__content"]}>
        {/* Left text section */}
        <div className={styles["hero__text"]}>
          <p className={styles["eyebrow"]}>Worthy Pricing Engine</p>
          <h1 className={styles["title"]}>Instant Diamond Valuation</h1>
          <p className={styles["subtitle"]}>
            Enter the carat, cut , color, and clarity to preview the
            automatically generated market price and browse similar inventory.
          </p>
        </div>
        <DiamondCalculator />
      </div>
    </header>
  );
}
