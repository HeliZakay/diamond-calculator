import { Suspense, lazy } from "react";
import { DiamondCalcProvider } from "./contexts/DiamondCalcContext";
const SimilarDiamondsModalLazy = lazy(() =>
  import("@/features/diamond-calculator/components").then((m) => ({
    default: m.SimilarDiamondsModal,
  }))
);

const PriceBreakdownModalLazy = lazy(() =>
  import("@/features/diamond-calculator/components").then((m) => ({
    default: m.PriceBreakdownModal,
  }))
);

import { DiamondCard } from "@/features/diamond-calculator/components";
import { useModal } from "./hooks/useModal";
import { useDiamondComputed } from "./hooks/useDiamondComputed";

export function DiamondCalculator() {
  return (
    <DiamondCalcProvider>
      <DiamondCalculatorInner />
    </DiamondCalcProvider>
  );
}

export function DiamondCalculatorInner() {
  const { active: activeModal, open, close } = useModal();
  const { final, parts, similar } = useDiamondComputed();

  return (
    <>
      <DiamondCard
        final={final}
        onOpenSimilar={() => open("similar")}
        onOpenBreakdown={() => open("breakdown")}
      />

      <Suspense fallback={null}>
        {activeModal === "similar" && (
          <SimilarDiamondsModalLazy open onClose={close} diamonds={similar} />
        )}
        {activeModal === "breakdown" && (
          <PriceBreakdownModalLazy
            open
            onClose={close}
            parts={parts}
            final={final}
          />
        )}
      </Suspense>
    </>
  );
}
