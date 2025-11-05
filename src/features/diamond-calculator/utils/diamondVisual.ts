import type { Cut, Color, Clarity } from "../types";

export function sizeFromCarat(carat: number) {
  const c = Math.max(0.1, Math.min(carat, 4));
  return Math.round(220 + Math.log2(1 + c) * 120);
}

export function contrastFromCut(cut: Cut) {
  switch (cut) {
    case "Excellent":
      return 1.25;
    case "Very Good":
      return 1.15;
    case "Good":
      return 1.05;
    case "Fair":
      return 0.98;
  }
}

export function tintFromColor(color: Color) {
  const idx = ["D", "E", "F", "G", "H", "I", "J"].indexOf(color);
  return { hue: 210 + idx * 6, sat: 4 + idx * 3, light: 0 };
}

export function sparkleFromClarity(clarity: Clarity) {
  const order = ["I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
  const i = order.indexOf(clarity);
  return {
    count: 3 + Math.round(i * 0.9),
    radius: 10 + i * 1.2,
    opacity: 0.15 + i * 0.02,
  };
}
