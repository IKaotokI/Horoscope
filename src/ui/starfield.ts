// ทุ่งดาว canvas 2D — จุดอลังการหนึ่งจุดของหน้า
// จำกัดจำนวนดาว, DPR ≤ 1.5, เริ่มหลัง first paint, ภาพนิ่งเมื่อ reduced motion หรือปิดเอฟเฟกต์ (CLAUDE.md §7)

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  hue: number;
}

export interface Starfield {
  setAnimated(on: boolean): void;
  /** 0..1 — ดาว "จุดติด" มากขึ้นเมื่อกรอกข้อมูลครบขึ้น */
  setIgnite(level: number): void;
}

export function createStarfield(canvas: HTMLCanvasElement, count = 420): Starfield {
  const ctx = canvas.getContext('2d');
  let stars: Star[] = [];
  let animated = false;
  let ignite = 0.35;
  let shown = 0.35;
  let raf = 0;
  let w = 0;
  let h = 0;

  const seed = () => {
    stars = Array.from({ length: count }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() ** 3 * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      hue: i % 9 === 0 ? 45 : 220,
    }));
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  };

  const draw = (t: number) => {
    if (!ctx) return;
    shown += (ignite - shown) * (animated ? 0.04 : 1);
    ctx.clearRect(0, 0, w, h);
    const lit = Math.floor(stars.length * (0.25 + 0.75 * shown));
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const on = i < lit;
      const tw = animated ? 0.55 + 0.45 * Math.sin(s.phase + (t / 1000) * s.speed) : 0.8;
      const a = (on ? 0.9 : 0.12) * tw;
      ctx.fillStyle = s.hue === 45 ? `rgba(233,200,110,${a})` : `rgba(214,224,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * (on ? 1 : 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = (t: number) => {
    draw(t);
    if (animated) raf = requestAnimationFrame(loop);
  };

  seed();
  resize();
  new ResizeObserver(resize).observe(canvas);

  return {
    setAnimated(on) {
      animated = on;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(loop);
      else draw(performance.now());
    },
    setIgnite(level) {
      ignite = Math.max(0, Math.min(1, level));
      if (!animated) draw(performance.now());
    },
  };
}
