// กาแล็กซีกังหันหมุนช้าๆ (canvas 2D) + ประกายดาวแทนแต่ละศาสตร์ที่สว่างตามข้อมูลที่กรอก
// จำกัดอนุภาค ≤ 5k, DPR ≤ 1.5, หยุดวาดเมื่อมองไม่เห็น, ภาพนิ่งเมื่อ reduced motion / ปิดเอฟเฟกต์ (CLAUDE.md §7)
import type { Science, ScienceFamily, ScienceLevel } from '../lib/sciences';
import { FIELD_LABEL, scienceLabel } from '../lib/sciences';
import { esc } from './components';

const PARTICLES = 3600;
const TEX = 900; // ความละเอียดภาพกาแล็กซีแบบหน้าตรงที่วาดล่วงหน้า
const TILT = 0.7; // มุมเอียง (แกนรอง/แกนหลัก) คงที่ทุกขนาดจอ — ขนาดถูกจำกัดด้วยความสูงแทน จอยาวจึงไม่แบน
const INCLINE = -0.32; // แกนหลักเอียงบนจอ (เรเดียน)
const SPIN = -0.012; // เรเดียน/วินาที ≈ หมุนครบรอบใน ~9 นาที, ติดลบ = หมุนทวนเข็ม แขนกังหันลากตามหลัง

/** เงาสัญลักษณ์ของแต่ละศาสตร์ ที่ปรากฏพร้อมแสงเมื่อข้อมูลครบเงื่อนไข ('card' = วาดรูปไพ่) */
const SYMBOL: Record<string, string> = {
  taksa: '☸',
  lek7: '๗',
  lagna: 'ลั',
  rerk: '☾',
  naksat: '肖',
  bazi: '八字',
  kua: '☰',
  zodiac: '♈\uFE0E',
  numerology: '№',
  tarot: 'card',
  cycles: '∿',
};

export const FAMILY_COLOR: Record<ScienceFamily, [number, number, number]> = {
  thai: [255, 206, 92],
  chinese: [255, 112, 92],
  western: [150, 188, 255],
};

interface Placed {
  sci: Science;
  r: number; // 0..1 ของรัศมีกาแล็กซี
  a: number; // มุมบนระนาบกาแล็กซี
  level: ScienceLevel;
  shown: number; // 0..1 ความสว่างที่แสดงอยู่ (ค่อยๆ ไล่ไปหา 1 เมื่อข้อมูลครบ)
  el: HTMLButtonElement;
}

export interface Galaxy {
  setAnimated(on: boolean): void;
  setLevels(levels: Record<string, ScienceLevel>): void;
}

const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** ภาพกาแล็กซีมองจากด้านบน วาดครั้งเดียวแล้วนำไปหมุน/เอียงตอนแสดงผล */
function paintGalaxyTexture(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = TEX;
  const g = c.getContext('2d')!;
  const R = TEX / 2;
  g.translate(R, R);
  g.globalCompositeOperation = 'lighter';

  // หมอกตามแขนกังหัน
  for (let i = 0; i < 260; i++) {
    const arm = i % 2;
    const r = 0.12 + Math.random() * 0.8;
    const th = arm * Math.PI + r * 4.4 + gauss() * 0.18;
    const x = Math.cos(th) * r * R;
    const y = Math.sin(th) * r * R;
    const rad = (0.05 + Math.random() * 0.07) * R;
    const pink = Math.random() < 0.25;
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, pink ? 'rgba(255,110,190,0.07)' : 'rgba(110,130,255,0.07)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  // ดาวจำนวนมากบนแขนกังหัน 2 แขนหลัก + ดาวกระจาย
  for (let i = 0; i < PARTICLES; i++) {
    const disk = Math.random() < 0.18;
    const r = disk ? Math.random() ** 0.7 : 0.04 + Math.random() ** 0.85 * 0.96;
    const arm = i % 2;
    const spread = disk ? Math.PI : 0.38 * (1 - r) + 0.12;
    const th = arm * Math.PI + r * 4.4 + gauss() * spread;
    const jitter = gauss() * 0.02 * R;
    const x = Math.cos(th) * r * R + jitter;
    const y = Math.sin(th) * r * R + jitter;
    const warm = Math.max(0, 1 - r / 0.35);
    const hii = !disk && Math.random() < 0.04;
    const [cr, cg, cb] = hii ? [255, 120, 200] : [150 + 105 * warm, 175 + 45 * warm, 255 - 85 * warm];
    const a = 0.25 + Math.random() * 0.6;
    const s = Math.random() < 0.05 ? 2.2 : 0.6 + Math.random() * 1.1;
    g.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`;
    g.beginPath();
    g.arc(x, y, s, 0, Math.PI * 2);
    g.fill();
  }

  // แกนกลางเรืองแสง
  const core = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.32);
  core.addColorStop(0, 'rgba(255,246,220,0.95)');
  core.addColorStop(0.15, 'rgba(255,214,150,0.55)');
  core.addColorStop(0.5, 'rgba(200,150,255,0.12)');
  core.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = core;
  g.fillRect(-R, -R, TEX, TEX);
  return c;
}

/** ตำแหน่งประกายดาว: กระจายมุมเท่าๆ กันรอบกาแล็กซี สลับรัศมีใน/นอก เพื่อไม่ให้ป้ายชื่อซ้อนกัน (คงที่ ไม่สุ่ม) */
function placeSciences(sciences: Science[]): { r: number; a: number }[] {
  const n = sciences.length;
  const radii = [0.5, 0.82, 0.66];
  return sciences.map((_, i) => ({ r: radii[i % 3], a: (i * 2 * Math.PI) / n + 0.2 }));
}

export function createGalaxy(host: HTMLElement, sciences: Science[], onPick: (s: Science) => void): Galaxy {
  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const layer = document.createElement('div');
  layer.className = 'galaxy-labels';
  host.append(canvas, layer);
  const ctx = canvas.getContext('2d')!;
  const tex = paintGalaxyTexture();

  const bg = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() ** 3 * 1.3 + 0.3,
    p: Math.random() * Math.PI * 2,
    s: 0.3 + Math.random(),
  }));

  const placed: Placed[] = placeSciences(sciences).map((pos, i) => {
    const sci = sciences[i];
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `sci-star fam-${sci.family}`;
    el.innerHTML = `<span class="sci-dot" aria-hidden="true"></span><span class="sci-name">${esc(scienceLabel(sci))}</span>`;
    // ชื่อแสดงเฉพาะตอนชี้เมาส์ (CSS :hover) — บนจอสัมผัสแตะครั้งแรกเพื่อดูชื่อ แตะซ้ำเพื่อไปที่ผล
    let touch = false;
    el.addEventListener('pointerdown', (e) => {
      touch = e.pointerType !== 'mouse';
    });
    el.addEventListener('click', () => {
      if (touch && !el.classList.contains('is-active')) {
        layer.querySelectorAll('.is-active').forEach((x) => x.classList.remove('is-active'));
        el.classList.add('is-active');
        return;
      }
      el.classList.remove('is-active');
      onPick(sci);
    });
    layer.append(el);
    return { sci, ...pos, level: 0, shown: 0, el };
  });

  let w = 0;
  let h = 0;
  let animated = false;
  let visible = true;
  let raf = 0;
  let angle = 0.6;
  let last = performance.now();

  const geometry = () => {
    // วงรีหลังเอียงต้องพอดีทั้งกว้างและสูง (คิดรวม INCLINE แบบประมาณ) — ไม่ยืดตามสัดส่วนจอ
    const R = Math.min(w * 0.44, (h * 0.42) / (TILT + 0.14), 620);
    return { cx: w * 0.5, cy: h * 0.5, R, tilt: TILT, scale: Math.max(0.5, Math.min(1, R / 380)) };
  };

  const toScreen = (r: number, a: number, rot: number) => {
    const { cx, cy, R, tilt } = geometry();
    const x0 = Math.cos(a + rot) * r * R;
    const y0 = Math.sin(a + rot) * r * R * tilt;
    return {
      x: cx + x0 * Math.cos(INCLINE) - y0 * Math.sin(INCLINE),
      y: cy + x0 * Math.sin(INCLINE) + y0 * Math.cos(INCLINE),
    };
  };

  /** เงาสัญลักษณ์โปร่งแสงเรืองตามสีตระกูล วาดหลังดาว */
  const drawSymbol = (sym: string, x: number, y: number, size: number, rgb: string, alpha: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.strokeStyle = `rgb(${rgb})`;
    ctx.shadowColor = `rgb(${rgb})`;
    ctx.shadowBlur = size * 0.45;
    if (sym === 'card') {
      const cw = size * 0.62;
      const ch = size;
      ctx.lineWidth = Math.max(1.5, size / 18);
      ctx.beginPath();
      ctx.roundRect(x - cw / 2, y - ch / 2, cw, ch, size / 10);
      ctx.stroke();
      ctx.font = `${size * 0.42}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', x, y);
    } else {
      ctx.font = `${sym.length > 1 && !/\uFE0E/.test(sym) ? size * 0.7 : size}px 'Noto Serif CJK SC', 'Mitr', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sym, x, y);
    }
    ctx.restore();
  };

  const draw = (t: number) => {
    const { cx, cy, R, tilt, scale } = geometry();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);

    for (const s of bg) {
      const tw = animated ? 0.55 + 0.45 * Math.sin(s.p + (t / 1000) * s.s) : 0.8;
      ctx.fillStyle = `rgba(220,228,255,${0.7 * tw})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(cx, cy);
    ctx.rotate(INCLINE);
    ctx.scale(1, tilt);
    ctx.rotate(angle);
    ctx.drawImage(tex, -R, -R, R * 2, R * 2);
    ctx.restore();

    // ประกายดาวของแต่ละศาสตร์: ก่อนครบเงื่อนไขเป็นจุดหรี่ เมื่อครบจึงเปล่งแสง + เงาสัญลักษณ์
    for (const p of placed) {
      const target = p.level === 2 ? 1 : 0;
      p.shown += (target - p.shown) * (animated ? 0.05 : 1);
      const k = p.shown;
      const { x, y } = toScreen(p.r, p.a, angle);
      const [cr, cg, cb] = FAMILY_COLOR[p.sci.family];
      const pulse = animated && k > 0.5 ? 1 + 0.1 * Math.sin(t / 480 + p.r * 9) : 1;

      if (k > 0.01) drawSymbol(SYMBOL[p.sci.id], x, y, 72 * scale * pulse, `${cr},${cg},${cb}`, 0.4 * k);

      ctx.globalCompositeOperation = 'lighter';
      const dim = `rgba(${cr},${cg},${cb},0.5)`;
      ctx.fillStyle = dim;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      if (k > 0.01) {
        const glow = (8 + 26 * k) * pulse * scale;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glow);
        grad.addColorStop(0, `rgba(255,255,255,${k})`);
        grad.addColorStop(0.25, `rgba(${cr},${cg},${cb},${0.8 * k})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x - glow, y - glow, glow * 2, glow * 2);
        const len = glow * 2;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.6 * k})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - len, y);
        ctx.lineTo(x + len, y);
        ctx.moveTo(x, y - len);
        ctx.lineTo(x, y + len);
        ctx.stroke();
      }
      p.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      p.el.classList.toggle('flip', x > w * 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const loop = (t: number) => {
    const dt = Math.min(0.1, (t - last) / 1000);
    last = t;
    angle += SPIN * dt;
    draw(t);
    if (animated && visible) raf = requestAnimationFrame(loop);
  };

  const restart = () => {
    cancelAnimationFrame(raf);
    last = performance.now();
    if (animated && visible) raf = requestAnimationFrame(loop);
    else draw(last);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = host.clientWidth;
    h = host.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  };

  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    restart();
  }).observe(host);
  resize();

  return {
    setAnimated(on) {
      animated = on;
      restart();
    },
    setLevels(levels) {
      for (const p of placed) {
        p.level = levels[p.sci.id] ?? 0;
        const need = p.sci.full.map((f) => FIELD_LABEL[f]).join(' + ');
        const state = p.level === 2 ? 'ข้อมูลครบ' : 'ยังไม่ครบเงื่อนไข';
        p.el.dataset.level = String(p.level);
        p.el.setAttribute('aria-label', `${scienceLabel(p.sci)}: ${state} (ต้องการ ${need})`);
      }
      if (!animated || !visible) draw(performance.now());
    },
  };
}
