import { useEffect, useRef, useState } from "react";
import styles from "./DiamondCanvasPreview.module.css";
import type { Cut, Color, Clarity } from "../types";

// ---- Visual mappings (פשוטים אך נראים טוב) ----
function sizeFromCarat(carat: number) {
  const c = Math.max(0.1, Math.min(carat, 4));
  // 260px≈1ct, גדילה עדינה
  return Math.round(220 + Math.log2(1 + c) * 120);
}
function contrastFromCut(cut: Cut) {
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
function tintFromColor(color: Color) {
  const idx = ["D", "E", "F", "G", "H", "I", "J"].indexOf(color); // 0..6
  // Hue בין כחול-קר לניואנס חמים; Saturation עדין
  const hue = 210 + idx * 6; // 210..246
  const sat = 4 + idx * 3; // 4%..22%
  const light = 0; // נשאיר ניטרלי, נטפל בהבהרה בשכבת glare
  return { hue, sat, light };
}
function sparkleFromClarity(clarity: Clarity) {
  const order = ["I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
  const i = order.indexOf(clarity);
  return {
    count: 3 + Math.round(i * 0.9), // 3..11
    radius: 10 + i * 1.2, // גודל ניצוץ מקסימלי
    opacity: 0.15 + i * 0.02, // 0.15..0.33
  };
}

type Props = {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  /** תמונת בסיס של יהלום (PNG עם רקע שקוף או כהה). שימי קובץ טוב ב-public, למשל "/diamond-base.png" */
  src?: string;
};

export default function DiamondCanvasPreview({
  carat,
  cut,
  color,
  clarity,
  src = "/diamond-base.png",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const px = sizeFromCarat(carat);
  const contrast = contrastFromCut(cut);
  const tint = tintFromColor(color);
  const sparkle = sparkleFromClarity(clarity);

  // טען תמונה
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    let cancelled = false;
    // Try the requested src first, then common variants and known bundled images
    const fallbacks = [
      src,
      "/diamond.base.png",
      "/diamond-base.png",
      "/diam5.png",
      "/diam1.png",
    ];
    let i = 0;

    const tryLoad = () => {
      image.onload = () => {
        if (!cancelled) setImg(image);
      };
      image.onerror = () => {
        i += 1;
        if (i < fallbacks.length) {
          image.src = fallbacks[i];
        } else if (!cancelled) {
          setImg(null);
        }
      };
      image.src = fallbacks[i];
    };

    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [src]);

  // ציור
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = globalThis.devicePixelRatio || 1;
    canvas.width = px * dpr;
    canvas.height = px * dpr;
    canvas.style.width = `${px}px`;
    canvas.style.height = `${px}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // רקע עדין (כדי שהטינט והglare “ישבו” יפה)
    ctx.clearRect(0, 0, px, px);
    const bgGrad = ctx.createRadialGradient(
      px * 0.48,
      px * 0.45,
      px * 0.1,
      px * 0.5,
      px * 0.5,
      px * 0.55
    );
    bgGrad.addColorStop(0, "rgba(255,255,255,0.0)");
    bgGrad.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, px, px);

    // צייר תמונת בסיס (אם נטענה), אחרת השאר placeholder חלק
    const pad = Math.round(px * 0.06);
    if (img) {
      ctx.drawImage(img, pad, pad, px - pad * 2, px - pad * 2);
    } else {
      // Placeholder – פוליגון פשוט כדי שלא יראה ריק בזמן טעינה
      ctx.fillStyle = "#e9edf1";
      roundedDiamond(ctx, px / 2, px / 2, px * 0.38);
      ctx.fill();
    }

    // קונטרסט (לפי CUT) — “curves” פשוט בעזרת globalComposite+filter
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    // filter contrast: requires re-draw; ניצור שכבת אפליקציה מלאה
    ctx.filter = `contrast(${contrast})`;
    if (img) {
      ctx.drawImage(canvas, 0, 0); // טריק: הכפל קונטרסט על הבופר הקיים
    }
    ctx.restore();
    ctx.filter = "none";

    // Tint לפי COLOR (Multiply עדין)
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = `hsl(${tint.hue} ${tint.sat}% 50%)`;
    ctx.globalAlpha = 0.12 + (tint.sat / 100) * 0.15; // עוצמה עדינה
    ctx.fillRect(0, 0, px, px);
    ctx.restore();

    // Glare highlight עדין (Screen)
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const glare = ctx.createRadialGradient(
      px * 0.34,
      px * 0.3,
      px * 0.01,
      px * 0.34,
      px * 0.3,
      px * 0.22
    );
    glare.addColorStop(0, "rgba(255,255,255,0.9)");
    glare.addColorStop(0.55, "rgba(255,255,255,0.25)");
    glare.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glare;
    ctx.fillRect(0, 0, px, px);
    ctx.restore();

    // Sparkles לפי CLARITY
    ctx.save();
    ctx.globalAlpha = sparkle.opacity;
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < sparkle.count; i++) {
      const angle = (i / sparkle.count) * Math.PI * 2 + (i % 3) * 0.3;
      const r = px * 0.18 + (i % 4) * (px * 0.02);
      const x = px / 2 + Math.cos(angle) * r;
      const y = px / 2 + Math.sin(angle) * r * 0.75;
      drawSparkle(ctx, x, y, sparkle.radius);
    }
    ctx.restore();

    // מסגרת עדינה
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px / 2, px / 2, px * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px / 2, px / 2, px * 0.44, 0, Math.PI * 2);
    ctx.stroke();
  }, [px, img, contrast, tint.hue, tint.sat, clarity, sparkle]);

  return (
    <div className={styles.wrapper} aria-label="Diamond canvas preview">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

// ---- helpers ----
function roundedDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  // אוקטגון מעוגל — נראה “יהלומי” קליל
  const k = 0.38;
  const pts = [
    [cx, cy - r],
    [cx + r * k, cy - r * k],
    [cx + r, cy],
    [cx + r * k, cy + r * k],
    [cx, cy + r],
    [cx - r * k, cy + r * k],
    [cx - r, cy],
    [cx - r * k, cy - r * k],
  ];
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxR: number
) {
  // core
  const g = ctx.createRadialGradient(x, y, 0, x, y, maxR);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, maxR, 0, Math.PI * 2);
  ctx.fill();

  // cross
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(x - 0.7, y - maxR, 1.4, maxR * 2);
  ctx.fillRect(x - maxR, y - 0.7, maxR * 2, 1.4);
}
