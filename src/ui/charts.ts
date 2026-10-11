// กราฟิก SVG: ผังทักษา 3×3, วงล้อดวงชะตา, กราฟไบโอริทึม, ผังแปดทิศ Kua
import { mod, toThaiDigits } from '../lib/core';
import { KUA_TRIGRAM } from '../lib/chinese/kua';
import { BIORHYTHM_CYCLES } from '../lib/western/cycles';
import { NAKSHATRA_NAMES, SIGN_GLYPHS, SIGNS_TH, type Chart } from '../lib/western/zodiac';
import { PLANET_COLOR, PLANET_DIRECTION, PLANET_VEHICLE, type taksa } from '../lib/thai/taksa';
import { PLANET_NAME } from '../lib/thai/thaiDay';
import { esc } from './components';

/** ผังทักษา 3×3 ให้เกตุอยู่กลาง (CLAUDE.md §7) */
export function taksaGrid(t: ReturnType<typeof taksa>): string {
  const cells: string[] = Array(9).fill('');
  for (const { bhumi, planet } of t) {
    const dir = PLANET_DIRECTION[planet];
    const c = PLANET_COLOR[planet];
    const cls = bhumi === 'บริวาร' ? 'is-self' : bhumi === 'กาลกิณี' ? 'is-kala' : '';
    cells[dir.row * 3 + dir.col] = `<div class="taksa-cell ${cls}" style="--c:${c.hex}">
      <span class="taksa-dir">${esc(dir.name)}</span>
      <span class="taksa-num">${toThaiDigits(planet)}</span>
      <span class="taksa-planet">${esc(PLANET_NAME[planet])}</span>
      <span class="taksa-bhumi">${esc(bhumi)}</span>
    </div>`;
  }
  cells[4] = `<div class="taksa-cell taksa-center"><span class="taksa-num">๙</span><span class="taksa-planet">เกตุ</span><span class="taksa-bhumi">${esc(PLANET_VEHICLE[9])}</span></div>`;
  return `<div class="taksa-grid" role="img" aria-label="ผังทักษา 8 ทิศ">${cells.join('')}</div>`;
}

const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
};

function sectorPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = pt(cx, cy, r1, a0);
  const [x1, y1] = pt(cx, cy, r1, a1);
  const [x2, y2] = pt(cx, cy, r0, a1);
  const [x3, y3] = pt(cx, cy, r0, a0);
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r1},${r1} 0 0 0 ${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)} A${r0},${r0} 0 0 1 ${x3.toFixed(2)},${y3.toFixed(2)} Z`;
}

/**
 * วงล้อดวงชะตา: ลองจิจูดเพิ่มทวนเข็ม ลัคนา (หรือเมษ) อยู่ซ้าย
 * style 'thai' = เลขไทย + วงนอก 27 ฤกษ์, 'western' = glyph
 */
export function chartWheel(chart: Chart, style: 'thai' | 'western'): string {
  const S = 340;
  const c = S / 2;
  const ref = chart.ascendant ? chart.ascendant.lon - mod(chart.ascendant.lon, 30) : 0;
  const ang = (lon: number) => 180 + (lon - ref);
  const rOuter = 164;
  const rSign = style === 'thai' ? 152 : 164;
  const rInner = 84;
  const parts: string[] = [];

  if (style === 'thai') {
    for (let i = 0; i < 27; i++) {
      const a0 = ang((i * 360) / 27);
      const [x0, y0] = pt(c, c, rSign, a0);
      const [x1, y1] = pt(c, c, rOuter, a0);
      parts.push(`<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" class="wheel-tick"><title>${esc(NAKSHATRA_NAMES[i])}</title></line>`);
    }
    parts.push(`<circle cx="${c}" cy="${c}" r="${rOuter}" class="wheel-ring"/>`);
  }

  for (let s = 0; s < 12; s++) {
    const a0 = ang(s * 30);
    const a1 = ang(s * 30 + 30);
    const isAsc = chart.ascendant?.sign === s;
    parts.push(`<path d="${sectorPath(c, c, rInner, rSign, a0, a1)}" class="wheel-sector${isAsc ? ' is-asc' : ''}${s % 2 ? ' alt' : ''}"/>`);
    const [lx, ly] = pt(c, c, rSign - 13, ang(s * 30 + 15));
    const label = style === 'thai' ? SIGNS_TH[s] : SIGN_GLYPHS[s];
    parts.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="wheel-sign ${style}">${esc(label)}</text>`);
  }

  // ดาว: ในแต่ละราศีวางเป็นตาราง 3 คอลัมน์ × หลายแถว เรียงตามลองจิจูด
  const bySign = new Map<number, typeof chart.planets>();
  for (const p of chart.planets) bySign.set(p.sign, [...(bySign.get(p.sign) ?? []), p]);
  for (const [sign, ps] of bySign) {
    ps.sort((a, b) => a.lon - b.lon);
    ps.forEach((p, i) => {
      const inRow = Math.min(3, ps.length - Math.floor(i / 3) * 3);
      const along = sign * 30 + 15 + ((i % 3) - (inRow - 1) / 2) * 8.5;
      const r = rInner + 15 + Math.floor(i / 3) * 17;
      const [x, y] = pt(c, c, r, ang(along));
      const glyph = style === 'thai' ? p.num : p.glyph;
      parts.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="wheel-planet ${style}"><title>${esc(p.name)} ${mod(p.lon, 30).toFixed(1)}° ${esc(SIGNS_TH[p.sign])}</title>${esc(glyph)}</text>`);
    });
  }
  parts.push(`<circle cx="${c}" cy="${c}" r="${rInner}" class="wheel-core"/>`);
  if (chart.ascendant) {
    const [x, y] = pt(c, c, rInner - 14, ang(chart.ascendant.lon));
    parts.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="wheel-asc">${style === 'thai' ? 'ลั' : 'ASC'}</text>`);
  }
  parts.push(`<text x="${c}" y="${c - 4}" class="wheel-center">${style === 'thai' ? 'ดวงชะตา' : 'Natal'}</text>`);
  parts.push(`<text x="${c}" y="${c + 16}" class="wheel-center-sub">${style === 'thai' ? 'นิรายนะ ลาหิรี' : 'Tropical'}</text>`);
  return `<svg viewBox="0 0 ${S} ${S}" class="wheel" role="img" aria-label="วงล้อดวงชะตา">${parts.join('')}</svg>`;
}

/** กราฟคลื่นไบโอริทึม ±15 วันจากวันนี้ */
export function biorhythmChart(t: number): string {
  const W = 340;
  const H = 150;
  const span = 15;
  const x = (d: number) => ((d + span) / (2 * span)) * (W - 20) + 10;
  const y = (v: number) => H / 2 - v * (H / 2 - 14);
  const lines = BIORHYTHM_CYCLES.map((cy) => {
    const pts: string[] = [];
    for (let d = -span; d <= span; d += 0.5) pts.push(`${x(d).toFixed(1)},${y(Math.sin((2 * Math.PI * (t + d)) / cy.days)).toFixed(1)}`);
    return `<polyline points="${pts.join(' ')}" class="bio-line bio-${cy.key}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="bio" role="img" aria-label="กราฟไบโอริทึม">
    <line x1="10" x2="${W - 10}" y1="${H / 2}" y2="${H / 2}" class="bio-axis"/>
    <line x1="${x(0)}" x2="${x(0)}" y1="6" y2="${H - 6}" class="bio-today"/>
    ${lines.join('')}
    <text x="${x(0)}" y="${H - 1}" class="bio-label">วันนี้</text>
  </svg>`;
}

/** ผังแปดทิศ 後天 (ใต้อยู่บนตามธรรมเนียมจีน) เน้นทิศของ Kua */
export function baguaSvg(k: number): string {
  const S = 220;
  const c = S / 2;
  // มุมของแต่ละ Kua บนจอ: ใต้ (9) อยู่บน
  const pos: Record<number, number> = { 9: 90, 2: 45, 7: 0, 6: -45, 1: -90, 8: -135, 3: 180, 4: 135 };
  const parts = Object.entries(pos).map(([kk, a]) => {
    const n = +kk;
    const [x, y] = pt(c, c, 80, a);
    const t = KUA_TRIGRAM[n];
    return `<g class="bagua-item${n === k ? ' is-me' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22"/><text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" class="bagua-sym">${t.symbol}</text><text x="${x.toFixed(1)}" y="${(y + 14).toFixed(1)}" class="bagua-zh">${t.zh}${n}</text></g>`;
  });
  const oct = Array.from({ length: 8 }, (_, i) => pt(c, c, 52, 22.5 + i * 45).map((v) => v.toFixed(1)).join(',')).join(' ');
  return `<svg viewBox="0 0 ${S} ${S}" class="bagua" role="img" aria-label="ผังแปดทิศ Kua ${k}"><polygon points="${oct}" class="bagua-oct"/><text x="${c}" y="${c + 8}" class="bagua-center">${k}</text>${parts.join('')}</svg>`;
}
