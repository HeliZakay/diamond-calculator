import styles from "./PriceBreakdown.module.css";
import type { PriceParts } from "../utils/calculatePriceWithBreakdown";

type Props = { parts: PriceParts; final: number; onOpen: () => void };

export function PriceBreakdown(props: Props) {
  const { onOpen } = props;
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={false}
      >
        Show breakdown
      </button>
    </div>
  );
}
