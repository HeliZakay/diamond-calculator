import { createContext, useState, useContext, useMemo } from "react";
import type { Cut, Color, Clarity } from "@/features/diamond-calculator/types";

type DiamondCalcContextValue = {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  setCarat: (v: number) => void;
  setCut: (v: Cut) => void;
  setColor: (v: Color) => void;
  setClarity: (v: Clarity) => void;
};

export const DiamondCalcContext = createContext<DiamondCalcContextValue | null>(
  null
);

export function DiamondCalcProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [carat, setCarat] = useState(1);
  const [cut, setCut] = useState<Cut>("Excellent");
  const [color, setColor] = useState<Color>("D");
  const [clarity, setClarity] = useState<Clarity>("FL");

  const value = useMemo(
    () => ({
      carat,
      cut,
      color,
      clarity,
      setCarat,
      setCut,
      setColor,
      setClarity,
    }),
    [carat, cut, color, clarity]
  );

  return (
    <DiamondCalcContext.Provider value={value}>
      {children}
    </DiamondCalcContext.Provider>
  );
}
export function useDiamondCalcContext() {
  const ctx = useContext(DiamondCalcContext);
  if (!ctx) {
    throw new Error("useDiamondCalc must be used inside <DiamondCalcProvider>");
  }
  return ctx;
}
