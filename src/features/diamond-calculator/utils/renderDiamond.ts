// canvas/renderDiamond.ts
type Tint = { hue: number; sat: number; light: number };
type Sparkle = { count: number; radius: number; opacity: number };

const BG_GRAD_INNER = 0.1;
const BG_GRAD_OUTER = 0.55;
const PAD_RATIO = 0.06;
const GLARE_INNER = 0.01;
const GLARE_OUTER = 0.22;
const OUTLINE_INNER_ALPHA = 0.55;
const OUTLINE_OUTER_ALPHA = 0.08;

export function renderDiamond(
  canvas: HTMLCanvasElement,
  px: number,
  opts: {
    img: HTMLImageElement | null;
    contrast: number | undefined;
    tint: Tint;
    sparkle: Sparkle;
  }
) {
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) return;

  const dpr = globalThis.devicePixelRatio || 1;
  canvas.width = px * dpr;
  canvas.height = px * dpr;
  canvas.style.width = `${px}px`;
  canvas.style.height = `${px}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, px, px);

  drawBackground(ctx, px);
  drawBaseDiamond(ctx, px, opts.img);
  applyContrast(ctx, px, opts.contrast);
  applyTint(ctx, px, opts.tint);
  addGlare(ctx, px);
  addSparkles(ctx, px, opts.sparkle);
  drawOutlines(ctx, px);
}

function drawBackground(ctx: CanvasRenderingContext2D, px: number) {
  const g = ctx.createRadialGradient(
    px * 0.48,
    px * 0.45,
    px * BG_GRAD_INNER,
    px * 0.5,
    px * 0.5,
    px * BG_GRAD_OUTER
  );
  g.addColorStop(0, "rgba(255,255,255,0.0)");
  g.addColorStop(1, "rgba(0,0,0,0.12)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, px, px);
}

function drawBaseDiamond(
  ctx: CanvasRenderingContext2D,
  px: number,
  img: HTMLImageElement | null
) {
  const pad = Math.round(px * PAD_RATIO);
  if (img) {
    ctx.drawImage(img, pad, pad, px - pad * 2, px - pad * 2);
    return;
  }
  // Fallback shape
  ctx.fillStyle = "#e9edf1";
  roundedDiamond(ctx, px / 2, px / 2, px * 0.38);
  ctx.fill();
}

function applyContrast(
  ctx: CanvasRenderingContext2D,
  px: number,
  contrast?: number
) {
  if (!contrast) return;
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = `contrast(${contrast})`;
  ctx.drawImage(ctx.canvas, 0, 0, px, px, 0, 0, px, px);
  ctx.restore();
}

function applyTint(ctx: CanvasRenderingContext2D, px: number, tint: Tint) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = `hsl(${tint.hue} ${tint.sat}% 50%)`;
  ctx.globalAlpha = 0.12 + (tint.sat / 100) * 0.15;
  ctx.fillRect(0, 0, px, px);
  ctx.restore();
}

function addGlare(ctx: CanvasRenderingContext2D, px: number) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const g = ctx.createRadialGradient(
    px * 0.34,
    px * 0.3,
    px * GLARE_INNER,
    px * 0.34,
    px * 0.3,
    px * GLARE_OUTER
  );
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.55, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, px, px);
  ctx.restore();
}

function addSparkles(ctx: CanvasRenderingContext2D, px: number, s: Sparkle) {
  ctx.save();
  ctx.globalAlpha = s.opacity;
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < s.count; i++) {
    const angle = (i / s.count) * Math.PI * 2 + (i % 3) * 0.3;
    const r = px * 0.18 + (i % 4) * (px * 0.02);
    const x = px / 2 + Math.cos(angle) * r;
    const y = px / 2 + Math.sin(angle) * r * 0.75;
    drawSparkle(ctx, x, y, s.radius);
  }
  ctx.restore();
}

function drawOutlines(ctx: CanvasRenderingContext2D, px: number) {
  ctx.strokeStyle = `rgba(255,255,255,${OUTLINE_INNER_ALPHA})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(px / 2, px / 2, px * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(0,0,0,${OUTLINE_OUTER_ALPHA})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px / 2, px / 2, px * 0.44, 0, Math.PI * 2);
  ctx.stroke();
}

function roundedDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
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
  const g = ctx.createRadialGradient(x, y, 0, x, y, maxR);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, maxR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillRect(x - 0.7, y - maxR, 1.4, maxR * 2);
  ctx.fillRect(x - maxR, y - 0.7, maxR * 2, 1.4);
}
