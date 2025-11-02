import { calculateDiamondPrice } from "../utils/calculateDiamondPrice";
import { MOCK_DIAMONDS } from "../data/mockDiamonds";
import { Button } from "./Button";
import type { Diamond } from "../types";

import styles from "./SimilarDiamondsModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  diamonds: Diamond[];
};

export function SimilarDiamondsModal({ open, onClose, diamonds }: Props) {
  if (!open) return null;

  const hasDiamonds = diamonds.length > 0;
  const fallbackRecommended = MOCK_DIAMONDS.slice(0, 4);
  const listToRender = hasDiamonds ? diamonds : fallbackRecommended;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {hasDiamonds ? "Similar diamonds" : "No similar diamonds found"}
        </h2>

        {!hasDiamonds && (
          <p className={styles.subtitle}>
            Showing some recommended diamonds instead:
          </p>
        )}

        <div className={styles.grid}>
          {listToRender.map((d) => (
            <div key={d.id} className={styles.card}>
              <img src={d.img} alt="diamond" className={styles.image} />
              <p className={styles.text}>
                {d.carat} ct • {d.cut}
              </p>
              <p className={styles.text}>
                Color {d.color} • Clarity {d.clarity}
              </p>
              <strong className={styles.price}>
                ${calculateDiamondPrice(d).toLocaleString()}
              </strong>
            </div>
          ))}
        </div>

        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
