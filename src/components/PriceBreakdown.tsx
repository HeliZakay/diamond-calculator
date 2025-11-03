import styles from "./PriceBreakdown.module.css";
import type { PriceParts } from "../utils/calculatePriceWithBreakdown";

type Props = {
  parts: PriceParts;
  final: number;
  onOpen: () => void;
  expanded?: boolean;
};

export function PriceBreakdown(props: Props) {
  const { onOpen, expanded } = props;
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={expanded ?? false}
      >
        Show breakdown
      </button>
    </div>
  );
}
