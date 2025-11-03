import type { Cut, Color, Clarity } from "../types";

// Ordered from best to lower for color & clarity scales used in UI
const COLOR_SCALE: Color[] = ["D", "E", "F", "G", "H", "I", "J"]; // 7 steps
const CLARITY_SCALE: Clarity[] = [
  "I1",
  "SI2",
  "SI1",
  "VS2",
  "VS1",
  "VVS2",
  "VVS1",
  "IF",
  "FL",
];

const CUT_MAP: Record<Cut, number> = {
  Fair: 0.25,
  Good: 0.5,
  "Very Good": 0.75,
  Excellent: 1,
};

export function normalizeColor(color: Color): number {
  const idx = COLOR_SCALE.indexOf(color);
  if (idx < 0) return 0;
  return idx / (COLOR_SCALE.length - 1);
}

export function normalizeCut(cut: Cut): number {
  return CUT_MAP[cut] ?? 0.5;
}

export function normalizeClarity(clarity: Clarity): number {
  const idx = CLARITY_SCALE.indexOf(clarity);
  if (idx < 0) return 0;
  return idx / (CLARITY_SCALE.length - 1);
}

export const NORMALIZATION = {
  normalizeColor,
  normalizeCut,
  normalizeClarity,
};
