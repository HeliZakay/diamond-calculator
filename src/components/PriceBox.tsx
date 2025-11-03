import styles from "./PriceBox.module.css";

type PriceBoxProps = {
  price: number;
  clickable?: boolean;
  onClick?: () => void;
};

export function PriceBox({ price, clickable, onClick }: PriceBoxProps) {
  const handleKey = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (!clickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };
  return (
    <div className={styles.priceBox}>
      <span className={styles.label}>Final Price</span>
      <span
        className={`${styles.value} ${clickable ? styles.clickable : ""}`}
        onClick={clickable ? onClick : undefined}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={clickable ? "Show price breakdown" : undefined}
        onKeyDown={handleKey}
      >
        ${price.toLocaleString()}
      </span>
    </div>
  );
}
