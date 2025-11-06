import { calculateDiamondPrice } from "@/features/diamond-calculator/utils/calculateDiamondPrice";
import { formatCurrency } from "@/features/diamond-calculator/utils/formatCurrency";
import { MOCK_DIAMONDS } from "@/data/mockDiamonds";
import { Button, Modal } from "@/ui";
import type { Diamond } from "@/features/diamond-calculator/types";

import styles from "./SimilarDiamondsModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  diamonds: Diamond[];
};

export function SimilarDiamondsModal({ open, onClose, diamonds }: Props) {
  const hasDiamonds = diamonds.length > 0;
  const fallbackRecommended = MOCK_DIAMONDS.slice(0, 4);
  const listToRender = hasDiamonds ? diamonds : fallbackRecommended;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={hasDiamonds ? "Similar diamonds" : "No similar diamonds found"}
      titleId="similar-diamonds-title"
    >
      {!hasDiamonds && (
        <p className={styles.subtitle}>
          Showing some recommended diamonds instead:
        </p>
      )}

      <div className={styles.grid}>
        {listToRender.map((d) => (
          <div key={d.id} className={styles.card}>
            <img
              src={d.img}
              alt={`${d.carat} ct ${d.cut} diamond, color ${d.color}, clarity ${d.clarity}`}
              className={styles.image}
            />
            <p className={styles.text}>
              {d.carat} ct • {d.cut}
            </p>
            <p className={styles.text}>
              Color {d.color} • Clarity {d.clarity}
            </p>
            <strong className={styles.price}>
              {formatCurrency(calculateDiamondPrice(d).final)}
            </strong>
          </div>
        ))}
      </div>

      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
