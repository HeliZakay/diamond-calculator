import styles from "./PriceBox.module.css";

type PriceBoxProps = {
  price: number;
};

export function PriceBox({ price }: PriceBoxProps) {
  return (
    <div className={styles.priceBox}>
      <span className={styles.label}>Final Price</span>
      <span className={styles.value}>${price.toLocaleString()}</span>
    </div>
  );
}
