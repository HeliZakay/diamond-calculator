import { Suspense, lazy } from "react";
import { DiamondCalcProvider } from "./ contexts/DiamondCalcContext";
const SimilarDiamondsModalLazy = lazy(
  () => import("./components/SimilarDiamondsModal")
);
const PriceBreakdownModalLazy = lazy(
  () => import("./components/PriceBreakdownModal")
);
import { DiamondCalculatorCard } from "./components/DiamondCalculatorCard";
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
      <DiamondCalculatorCard
        final={final}
        onOpenSimilar={() => open("similar")}
        onOpenBreakdown={() => open("breakdown")}
      />

      <Suspense fallback={"Loading..."}>
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
