import styles from "./PriceBox.module.css";
import { FaInfoCircle } from "react-icons/fa";
import { formatCurrency } from "../utils/formatCurrency";

type PriceBoxProps = {
  price: number;
  clickable?: boolean;
  onClick?: () => void;
};

export function PriceBox({ price, clickable, onClick }: PriceBoxProps) {
  return (
    <div className={styles.priceBox}>
      <span className={styles.label}>
        {clickable ? (
          <button
            type="button"
            className={styles.infoButton}
            aria-label="Show price breakdown"
            onClick={onClick}
          >
            <FaInfoCircle size={20} color="rgba(14, 164, 233, 1)" />
          </button>
        ) : (
          <span className={styles.infoIcon} aria-hidden>
            <FaInfoCircle size={20} color="rgba(14, 164, 233, 1)" />
          </span>
        )}
        Final Price
      </span>
      <span className={styles.value} aria-live="polite">
        {formatCurrency(price)}
      </span>
    </div>
  );
}
