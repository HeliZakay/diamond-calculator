import type { Cut, Color, Clarity } from "../types";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "@/features/diamond-calculator/constants/diamondFactors";
// Ordered from best to lower for color & clarity scales used in UI
function getNormalized<T extends string | number | symbol>(
  factors: Record<T, number>,
  value: T,
  reverse: boolean = false
) {
  const scaleKeys = Object.keys(factors) as T[];
  const idx = scaleKeys.indexOf(value);

  if (idx < 0) return 0;

  let normalized_value = idx / (scaleKeys.length - 1);
  if (reverse) {
    normalized_value = 1 - normalized_value;
  }

  return normalized_value;
}

export function normalizeColor(color: Color): number {
  return getNormalized(COLOR_FACTORS, color);
}

export function normalizeCut(cut: Cut): number {
  return getNormalized(CUT_FACTORS, cut, true);
}

export function normalizeClarity(clarity: Clarity): number {
  return getNormalized(CLARITY_FACTORS, clarity, true);
}
