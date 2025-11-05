import styles from "./PriceBox.module.css";
import { FaInfoCircle } from "react-icons/fa";
import { formatCurrency } from "@/features/diamond-calculator/utils/formatCurrency";

type PriceBoxProps = {
  price: number;
  onClick: () => void;
};

export function PriceBox({ price, onClick }: PriceBoxProps) {
  return (
    <div className={styles.priceBox}>
      <span className={styles.label}>
        <button
          type="button"
          className={styles.infoButton}
          aria-label="Show price breakdown"
          onClick={onClick}
        >
          <FaInfoCircle size={20} color="rgba(14, 164, 233, 1)" />
        </button>
        Final Price
      </span>
      <span className={styles.value} aria-live="polite">
        {formatCurrency(price)}
      </span>
    </div>
  );
}
