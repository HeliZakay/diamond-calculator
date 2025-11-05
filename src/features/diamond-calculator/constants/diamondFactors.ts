import type { Cut, Color, Clarity, Factors } from "../types";

// ----------------------------------------------------
// 💎 Diamond factor tables
// ----------------------------------------------------
// These multipliers represent how each characteristic
// (cut, color, clarity) affects the base price.
// Values are approximate and used for demonstration only.

export const CUT_FACTORS: Record<Cut, number> = {
  Excellent: 1.3,
  "Very Good": 1.15,
  Good: 1,
  Fair: 0.9,
};

export const COLOR_FACTORS: Record<Color, number> = {
  D: 1.25,
  E: 1.2,
  F: 1.15,
  G: 1.1,
  H: 1.05,
  I: 1,
  J: 0.95,
};

export const CLARITY_FACTORS: Record<Clarity, number> = {
  FL: 1.25,
  IF: 1.2,
  VVS1: 1.15,
  VVS2: 1.1,
  VS1: 1.05,
  VS2: 1,
  SI1: 0.95,
  SI2: 0.9,
  I1: 0.85,
};

// ----------------------------------------------------
// 🧮 Combined export (optional)
// ----------------------------------------------------

export const DIAMOND_FACTORS: Factors = {
  cut: CUT_FACTORS,
  color: COLOR_FACTORS,
  clarity: CLARITY_FACTORS,
};
