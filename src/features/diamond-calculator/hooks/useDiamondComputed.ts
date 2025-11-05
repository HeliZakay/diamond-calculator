// hooks/useDiamondComputed.ts
import { useMemo } from "react";
import { calculatePriceWithBreakdown } from "../utils/calculatePriceWithBreakdown";
import { findSimilarDiamonds } from "../utils/findSimilarDiamonds";
import type { Diamond, PriceParts } from "../types";
import { useDiamondCalcContext } from "../contexts/DiamondCalcContext";

export function useDiamondComputed(): {
  final: number;
  parts: PriceParts;
  similar: Diamond[];
} {
  const ctx = useDiamondCalcContext();
  const { carat, cut, color, clarity } = ctx;

  const { final, parts } = useMemo(
    () => calculatePriceWithBreakdown({ carat, cut, color, clarity }),
    [carat, cut, color, clarity]
  );

  const similar = useMemo(
    () => findSimilarDiamonds({ carat, cut, color, clarity }),
    [carat, cut, color, clarity]
  );

  return { final, parts, similar };
}
