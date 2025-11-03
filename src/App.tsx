import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { calculateDiamondPrice } from "./utils/calculateDiamondPrice";
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
import "./App.css";

function App() {
  const [carat, setCarat] = useState<number>(1);
  const [cut, setCut] = useState<Cut>("Excellent");
  const [color, setColor] = useState<Color>("D");
  const [clarity, setClarity] = useState<Clarity>("FL");
  const [showModal, setShowModal] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  // Keep the hero content visually centered on initial load, but anchored to the top afterwards
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [topOffset, setTopOffset] = useState<number>(0);

  useLayoutEffect(() => {
    const centerHero = () => {
      const el = contentRef.current;
      if (!el) return;
      const h = el.getBoundingClientRect().height;
      const vh = window.innerHeight;
      const offset = Math.max(0, Math.round((vh - h) / 2));
      setTopOffset(offset);
    };

    centerHero();
    window.addEventListener("resize", centerHero);
    return () => window.removeEventListener("resize", centerHero);
  }, []);

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
      <header className="hero">
        <div className="hero__overlay" />

        <div
          className="hero__content"
          ref={contentRef}
          style={{ marginTop: topOffset }}
        >
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
            <img
              src={`${import.meta.env.BASE_URL}diamond-demo.png`}
              alt="Diamond demo"
              className="card__image"
              loading="lazy"
              data-alt="0"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement & { dataset: DOMStringMap };
                const step = img.dataset.alt ?? "0";
                if (step === "0") {
                  img.src = `${import.meta.env.BASE_URL}diamond-demo.jpg`;
                  img.dataset.alt = "1";
                } else if (step === "1") {
                  img.src = `${import.meta.env.BASE_URL}diam5.png`;
                  img.dataset.alt = "2";
                }
              }}
            />

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
