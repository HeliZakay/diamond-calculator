import { Modal } from "./Modal";
import breakdownStyles from "./PriceBreakdownModal.module.css";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "@/ui/Button";
import type { PriceParts } from "../utils/calculatePriceWithBreakdown";

type Props = {
  open: boolean;
  onClose: () => void;
  parts: PriceParts;
  final: number;
};

export default function PriceBreakdownModal({
  open,
  onClose,
  parts,
  final,
}: Props) {
  const { basePerCarat, base, cutFactor, colorFactor, clarityFactor } = parts;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Price breakdown"
      titleId="price-breakdown-title"
    >
      <div className={breakdownStyles.content}>
        <div className={breakdownStyles.row}>
          <span>Base per carat</span>
          <strong>{formatCurrency(basePerCarat)}</strong>
        </div>
        <div className={breakdownStyles.row}>
          <span>Base (carat × $/ct)</span>
          <strong>{formatCurrency(base)}</strong>
        </div>
        <div className={breakdownStyles.row}>
          <span>Cut factor</span>
          <strong>× {cutFactor.toFixed(2)}</strong>
        </div>
        <div className={breakdownStyles.row}>
          <span>Color factor</span>
          <strong>× {colorFactor.toFixed(2)}</strong>
        </div>
        <div className={breakdownStyles.row}>
          <span>Clarity factor</span>
          <strong>× {clarityFactor.toFixed(2)}</strong>
        </div>

        <hr className={breakdownStyles.hr} />

        <div className={breakdownStyles.rowTotal}>
          <span>Final</span>
          <strong>{formatCurrency(final)}</strong>
        </div>
      </div>

      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
