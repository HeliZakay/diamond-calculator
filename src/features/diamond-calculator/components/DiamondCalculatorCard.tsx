import { DiamondForm } from "./DiamondForm";
import { PriceBox } from "./PriceBox";
import { Button } from "@/ui/Button";
import DiamondViewer from "./DiamondViewer";
import {
  normalizeColor,
  normalizeCut,
  normalizeClarity,
} from "../utils/normalizeDiamondParams";
import { useDiamondCalcContext } from "../ contexts/DiamondCalcContext";

import styles from "./DiamondCalculatorCard.module.css";

type DiamondCalculatorCardProps = {
  final: any;
  onOpenSimilar: any;
  onOpenBreakdown: any;
};
export function DiamondCalculatorCard({
  final,
  onOpenSimilar,
  onOpenBreakdown,
}: DiamondCalculatorCardProps) {
  const ctx = useDiamondCalcContext();
  const { cut, color, clarity } = ctx;
  return (
    <div className={styles.card}>
      <DiamondForm />
      {/* Diamond viewer (shader-based), mapped from current selections */}
      {(() => {
        const colorGrade = normalizeColor(color);
        const cutNorm = normalizeCut(cut);
        const clarityNorm = normalizeClarity(clarity);

        return (
          <div
            style={{
              margin: "0.5rem 0 0.75rem",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            }}
          >
            <DiamondViewer
              colorGrade={colorGrade}
              cut={cutNorm}
              clarity={clarityNorm}
              texturePath={`${import.meta.env.BASE_URL}diamond.png`}
              style={{ width: "100%", height: 260 }}
            />
          </div>
        );
      })()}
      <PriceBox price={final} clickable={true} onClick={onOpenBreakdown} />
      <div className={styles["card__actions"]}>
        <Button onClick={onOpenSimilar}>Show Similar Diamonds</Button>
      </div>
    </div>
  );
}
