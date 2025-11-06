import styles from "./HomePage.module.css";
import { CalculatorHeroSection } from "../sections/CalculatorHeroSection";
import { SparkleCursor } from "@/ui/sparkleCursor/SparkleCursor";
type HomePageProps = {};

export function HomePage({}: HomePageProps) {
  return (
    <div className={styles.page}>
      <SparkleCursor />
      <CalculatorHeroSection />
    </div>
  );
}
