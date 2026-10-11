// จันทรคติไทย จากตารางที่สร้างล่วงหน้าด้วย pythaidate (scripts/gen_thai_lunar.py)
// CLAUDE.md: ห้ามคำนวณจันทรคติเอง
import table from '../../data/thai-lunar-months.json';
import { type CivilDate, fromJdn, jdn, toThaiDigits } from '../core';

export interface ThaiLunarDate {
  /** 1 = อ้าย, 2 = ยี่, … 12; เดือน 8 หลัง (อธิกมาส) = 88 */
  month: number;
  /** 1..15 = ขึ้น, 16..30 = แรม 1..15 */
  day: number;
}

const FIRST = table.firstJdn;
const STARTS = table.months.map(([off, month]) => ({ jdn: FIRST + off, month }));
const LAST_JDN = STARTS[STARTS.length - 1].jdn + 29;

export const LUNAR_RANGE = { from: fromJdn(STARTS[0].jdn), to: fromJdn(LAST_JDN) };

export function thaiLunarDate(date: CivilDate): ThaiLunarDate | null {
  const j = jdn(date);
  if (j < STARTS[0].jdn || j > LAST_JDN) return null;
  let lo = 0;
  let hi = STARTS.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (STARTS[mid].jdn <= j) lo = mid;
    else hi = mid - 1;
  }
  return { month: STARTS[lo].month, day: j - STARTS[lo].jdn + 1 };
}

/** วันขึ้น 1 ค่ำ เดือน 5 ในปี ค.ศ. ที่กำหนด */
export function waxing1Month5(year: number): CivilDate | null {
  for (const s of STARTS) {
    if (s.month !== 5) continue;
    const d = fromJdn(s.jdn);
    if (d.y === year) return d;
  }
  return null;
}

/** เลขเดือนสำหรับเลข 7 ตัว: 8/8 นับเป็น 8 */
export const monthNumber = (m: number): number => (m === 88 ? 8 : m);

const MONTH_NAME: Record<number, string> = { 1: 'อ้าย', 2: 'ยี่', 88: '๘๘' };

export function formatThaiLunar(l: ThaiLunarDate): string {
  const phase = l.day <= 15 ? 'ขึ้น' : 'แรม';
  const n = l.day <= 15 ? l.day : l.day - 15;
  const month = MONTH_NAME[l.month] ?? toThaiDigits(l.month);
  return `${phase} ${toThaiDigits(n)} ค่ำ เดือน ${month}`;
}
