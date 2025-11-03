import { useEffect, useState } from "react";
import { findSimilarDiamonds } from "./utils/findSimilarDiamonds";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "./constants/diamondFactors";
import type { Cut, Color, Clarity, Diamond } from "./types";
import { DiamondForm } from "./components/DiamondForm";
import { PriceBox } from "./components/PriceBox";
import { SimilarDiamondsModal } from "./components/SimilarDiamondsModal";
import { Button } from "./components/Button";
import { calculatePriceWithBreakdown } from "./utils/calculatePriceWithBreakdown";
import { PriceBreakdown } from "./components/PriceBreakdown";
import { PriceBreakdownModal } from "./components/PriceBreakdownModal";
import { DiamondViewer } from "./components/DiamondViewer";
import { SparkleCursor } from "./components/SparkleCursor";
import "./App.css";

function App() {
  const [carat, setCarat] = useState<number>(1);
  const [cut, setCut] = useState<Cut>("Excellent");
  const [color, setColor] = useState<Color>("D");
  const [clarity, setClarity] = useState<Clarity>("FL");
  const [showModal, setShowModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  // Centering is handled purely with CSS to avoid layout shifts and overflow

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 880);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  //const price = calculateDiamondPrice({ carat, cut, color, clarity });
  const { final, parts } = calculatePriceWithBreakdown({
    carat,
    cut,
    color,
    clarity,
  });
  const similar: Diamond[] = findSimilarDiamonds({
    carat,
    cut,
    color,
    clarity,
  });

  return (
    <div className="page">
      <SparkleCursor />
      <header className="hero">
        <div className="hero__overlay" />

        <div className="hero__content">
          {/* Left text section */}
          <div className="hero__text">
            <p className="eyebrow">Worthy Pricing Engine</p>
            <h1 className="title">Instant Diamond Valuation</h1>
            <p className="subtitle">
              Enter the carat, cut, color, and clarity to preview the
              automatically generated market price and browse similar inventory.
            </p>
          </div>

          {/* Right card with form */}
          <div className="card">
            <DiamondForm
              carat={carat}
              cut={cut}
              color={color}
              clarity={clarity}
              onCaratChange={setCarat}
              onCutChange={setCut}
              onColorChange={setColor}
              onClarityChange={setClarity}
              CUT_FACTORS={CUT_FACTORS}
              COLOR_FACTORS={COLOR_FACTORS}
              CLARITY_FACTORS={CLARITY_FACTORS}
            />

            {/* Diamond viewer (shader-based), mapped from current selections */}
            {(() => {
              const colorScale: Color[] = ["D", "E", "F", "G", "H", "I", "J"]; // 7 steps
              const colorIdx = Math.max(0, colorScale.indexOf(color));
              const colorGrade = colorIdx / (colorScale.length - 1); // 0..1

              const cutMap: Record<Cut, number> = {
                Fair: 0.25,
                Good: 0.5,
                "Very Good": 0.75,
                Excellent: 1,
              };
              const cutNorm = cutMap[cut];

              const clarityScale: Clarity[] = [
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
              const clIdx = Math.max(0, clarityScale.indexOf(clarity));
              const clarityNorm = clIdx / (clarityScale.length - 1); // 0..1 (I1->FL)

              return (
                <div
                  style={{
                    margin: "0.5rem 0 0.75rem",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                  }}
                >
                  <DiamondViewer
                    key={`${color}-${cut}-${clarity}`}
                    colorGrade={colorGrade}
                    cut={cutNorm}
                    clarity={clarityNorm}
                    texturePath={`${import.meta.env.BASE_URL}diamond.png`}
                    style={{ width: "100%", height: 260 }}
                  />
                </div>
              );
            })()}

            <PriceBox
              price={final}
              clickable={isDesktop}
              onClick={isDesktop ? () => setShowBreakdown(true) : undefined}
            />
            <PriceBreakdown
              parts={parts}
              final={final}
              onOpen={() => setShowBreakdown(true)}
            />
            <div className="card__actions">
              <Button onClick={() => setShowModal(true)}>
                Show Similar Diamonds
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SimilarDiamondsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        diamonds={similar}
      />

      <PriceBreakdownModal
        open={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        parts={parts}
        final={final}
      />
    </div>
  );
}

export default App;
