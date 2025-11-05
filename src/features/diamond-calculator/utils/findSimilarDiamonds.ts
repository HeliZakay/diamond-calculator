import type { DiamondInput, Diamond } from "../types";
import { MOCK_DIAMONDS } from "@/data/mockDiamonds";

// ----------------------------------------------------
// 🔍 Find Similar Diamonds
// ----------------------------------------------------
// This function returns up to 4 diamonds that are considered
// "similar" to the given one, based on carat, color, and cut.
//
// Similarity rules (for demo purposes):
// - Carat difference ≤ 0.1
// - Same color OR same cut
// ----------------------------------------------------

export function findSimilarDiamonds(current: DiamondInput): Diamond[] {
  return MOCK_DIAMONDS.filter(
    (d) =>
      Math.abs(d.carat - current.carat) <= 0.5 &&
      (d.color === current.color || d.cut === current.cut)
  ).slice(0, 4);
}
