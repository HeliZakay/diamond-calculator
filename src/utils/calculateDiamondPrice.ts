import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "../constants/diamondFactors";
import type { DiamondInput } from "../types";

export function calculateDiamondPrice({
  carat,
  cut,
  color,
  clarity,
}: DiamondInput): number {
  const basePrice = carat * 4000;
  return Math.round(
    basePrice *
      CUT_FACTORS[cut] *
      COLOR_FACTORS[color] *
      CLARITY_FACTORS[clarity]
  );
}
