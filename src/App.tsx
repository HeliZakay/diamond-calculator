import { useState } from "react";
import { calculateDiamondPrice } from "./utils/calculateDiamondPrice";
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
import "./App.css";

function App() {
  const [carat, setCarat] = useState<number>(1);
  const [cut, setCut] = useState<Cut>("Excellent");
  const [color, setColor] = useState<Color>("D");
  const [clarity, setClarity] = useState<Clarity>("FL");
  const [showModal, setShowModal] = useState(false);

  const price = calculateDiamondPrice({ carat, cut, color, clarity });

  const similar: Diamond[] = findSimilarDiamonds({
    carat,
    cut,
    color,
    clarity,
  });

  return (
    <div className="page">
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

            <PriceBox price={price} />
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
    </div>
  );
}

export default App;
