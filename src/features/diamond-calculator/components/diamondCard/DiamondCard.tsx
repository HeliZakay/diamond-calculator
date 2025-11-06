import {
  DiamondForm,
  PriceBox,
  DiamondViewer,
} from "@/features/diamond-calculator/components";
import { Button } from "@/ui/button/Button";
import {
  normalizeColor,
  normalizeCut,
  normalizeClarity,
} from "@/features/diamond-calculator/utils/normalizeDiamondParams";
import { useDiamondCalcContext } from "@/features/diamond-calculator/contexts/DiamondCalcContext";

import styles from "./DiamondCard.module.css";

type DiamondCardProps = {
  final: number;
  onOpenSimilar: () => void;
  onOpenBreakdown: () => void;
};

const BUTTON_TEXT = "Show Similar Diamonds";

export function DiamondCard({
  final,
  onOpenSimilar,
  onOpenBreakdown,
}: DiamondCardProps) {
  const ctx = useDiamondCalcContext();
  const { cut, color, clarity } = ctx;

  const colorGrade = normalizeColor(color);
  const cutNorm = normalizeCut(cut);
  const clarityNorm = normalizeClarity(clarity);
  return (
    <div className={styles.card}>
      <DiamondForm />
      <div className={styles.viewer}>
        <DiamondViewer
          colorGrade={colorGrade}
          cut={cutNorm}
          clarity={clarityNorm}
          texturePath={"./diamond.png"}
        />
      </div>

      <PriceBox price={final} onClick={onOpenBreakdown} />
      <div className={styles.actions}>
        <Button onClick={onOpenSimilar}>{BUTTON_TEXT}</Button>
      </div>
    </div>
  );
}
