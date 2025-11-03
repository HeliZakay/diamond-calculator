import { useMemo, useState, lazy, Suspense } from "react";
import { findSimilarDiamonds } from "./utils/findSimilarDiamonds";
import {
  CUT_FACTORS,
  COLOR_FACTORS,
  CLARITY_FACTORS,
} from "./constants/diamondFactors";
import type { Cut, Color, Clarity, Diamond } from "./types";
import { DiamondForm } from "./components/DiamondForm";
import { PriceBox } from "./components/PriceBox";
// Lazy load heavy/secondary UI to reduce initial bundle
const SimilarDiamondsModalLazy = lazy(() =>
  import("./components/SimilarDiamondsModal").then((m) => ({
    default: m.SimilarDiamondsModal,
  }))
);
import { Button } from "./components/Button";
import { calculatePriceWithBreakdown } from "./utils/calculatePriceWithBreakdown";
import { PriceBreakdown } from "./components/PriceBreakdown";
const PriceBreakdownModalLazy = lazy(() =>
  import("./components/PriceBreakdownModal").then((m) => ({
    default: m.PriceBreakdownModal,
  }))
);
import DiamondViewer from "./components/DiamondViewer";
import { SparkleCursor } from "./components/SparkleCursor";
import { useIsDesktop } from "./hooks/useIsDesktop";
import {
  normalizeColor,
  normalizeCut,
  normalizeClarity,
} from "./utils/normalizeDiamondParams";
import "./App.css";

function App() {
  const [carat, setCarat] = useState<number>(1);
  const [cut, setCut] = useState<Cut>("Excellent");
  const [color, setColor] = useState<Color>("D");
  const [clarity, setClarity] = useState<Clarity>("FL");
  const [showModal, setShowModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isDesktop = useIsDesktop();

  // Compute derived values with memoization to avoid unnecessary recalcs
  const { final, parts } = useMemo(() => {
    return calculatePriceWithBreakdown({ carat, cut, color, clarity });
  }, [carat, cut, color, clarity]);
  const similar: Diamond[] = useMemo(() => {
    return findSimilarDiamonds({ carat, cut, color, clarity });
  }, [carat, cut, color, clarity]);

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
              const colorGrade = normalizeColor(color);
              const cutNorm = normalizeCut(cut);
              const clarityNorm = normalizeClarity(clarity);

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
              clickable={true}
              onClick={() => setShowBreakdown(true)}
            />
            {isDesktop && (
              <PriceBreakdown
                parts={parts}
                final={final}
                onOpen={() => setShowBreakdown(true)}
                expanded={showBreakdown}
              />
            )}
            <div className="card__actions">
              <Button onClick={() => setShowModal(true)}>
                Show Similar Diamonds
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <SimilarDiamondsModalLazy
          open={showModal}
          onClose={() => setShowModal(false)}
          diamonds={similar}
        />
      </Suspense>

      <Suspense fallback={null}>
        <PriceBreakdownModalLazy
          open={showBreakdown}
          onClose={() => setShowBreakdown(false)}
          parts={parts}
          final={final}
        />
      </Suspense>
    </div>
  );
}

export default App;
