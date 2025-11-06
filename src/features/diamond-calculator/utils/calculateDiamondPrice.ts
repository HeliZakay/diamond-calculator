import type { DiamondInput } from "../types";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
  BASE_PRICE_PER_CARAT,
} from "../constants/diamondFactors";

export type PriceParts = {
  basePerCarat: number;
  base: number;
  cutFactor: number;
  colorFactor: number;
  clarityFactor: number;
};

export type PriceResult = {
  final: number;
  parts: PriceParts;
};

export function calculateDiamondPrice(input: DiamondInput): PriceResult {
  const { carat, cut, color, clarity } = input;

  const basePerCarat = BASE_PRICE_PER_CARAT;
  const base = carat * basePerCarat;

  const cutFactor = CUT_FACTORS[cut];
  const colorFactor = COLOR_FACTORS[color];
  const clarityFactor = CLARITY_FACTORS[clarity];

  const final = Math.round(base * cutFactor * colorFactor * clarityFactor);

  return {
    final,
    parts: { basePerCarat, base, cutFactor, colorFactor, clarityFactor },
  };
}
