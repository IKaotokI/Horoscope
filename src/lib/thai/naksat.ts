// นักษัตรไทย พร้อมธรรมเนียมขอบปี 3 แบบ
import { type CivilDate, compareDate, type Convention, formatThaiDate, mod } from '../core';
import { waxing1Month5 } from './lunar';

export type ThaiYearBoundary = 'lunar5' | 'songkran' | 'jan1';

export const NAKSAT_NAMES = [
  'ชวด', 'ฉลู', 'ขาล', 'เถาะ', 'มะโรง', 'มะเส็ง', 'มะเมีย', 'มะแม', 'วอก', 'ระกา', 'จอ', 'กุน',
];
export const NAKSAT_ANIMALS = [
  'หนู', 'วัว', 'เสือ', 'กระต่าย', 'งูใหญ่ (นาค)', 'งูเล็ก', 'ม้า', 'แพะ', 'ลิง', 'ไก่', 'สุนัข', 'หมู',
];

/** ((Y−4) mod 12) + 1, ชวด = 1 */
export const naksatOfYear = (y: number): number => mod(y - 4, 12) + 1;

export const BOUNDARY_LABEL: Record<ThaiYearBoundary, string> = {
  lunar5: 'ขึ้น 1 ค่ำ เดือน 5',
  songkran: 'สงกรานต์ 13 เม.ย.',
  jan1: '1 มกราคม',
};

export interface NaksatResult {
  /** ชวด = 1 */
  index: number;
  /** ปี ค.ศ. ของปีนักษัตร */
  year: number;
  boundaryDate: CivilDate | null;
  convention: Convention;
  /** ค่าของธรรมเนียมอื่น เพื่อแสดงเทียบ */
  alternatives: { boundary: ThaiYearBoundary; index: number }[];
  warning?: string;
}

function boundaryDate(y: number, b: ThaiYearBoundary): CivilDate | null {
  if (b === 'jan1') return { y, m: 1, d: 1 };
  if (b === 'songkran') return { y, m: 4, d: 13 };
  return waxing1Month5(y);
}

function yearFor(date: CivilDate, b: ThaiYearBoundary): { year: number; boundary: CivilDate | null } {
  const bd = boundaryDate(date.y, b);
  if (!bd) return { year: date.y, boundary: null };
  return { year: compareDate(date, bd) >= 0 ? date.y : date.y - 1, boundary: bd };
}

/** @param thaiDate วันตามธรรมเนียมไทย (นับตอนพระอาทิตย์ขึ้น) */
export function thaiNaksat(thaiDate: CivilDate, boundary: ThaiYearBoundary = 'lunar5'): NaksatResult {
  const { year, boundary: bd } = yearFor(thaiDate, boundary);
  const all: ThaiYearBoundary[] = ['lunar5', 'songkran', 'jan1'];
  const alternatives = all
    .filter((b) => b !== boundary)
    .map((b) => ({ boundary: b, index: naksatOfYear(yearFor(thaiDate, b).year) }));
  const inWindow = thaiDate.m < 4 || (thaiDate.m === 4 && thaiDate.d <= 20);
  let warning: string | undefined;
  if (!bd) warning = 'วันเกิดอยู่นอกช่วงตารางจันทรคติ (ค.ศ. 1900–2100) ใช้ปี ค.ศ. แทน';
  else if (inWindow)
    warning = 'เกิดระหว่าง 1 ม.ค. ถึงกลางเมษายน ปีนักษัตรขึ้นกับว่านับเปลี่ยนปีวันไหน ดูค่าของธรรมเนียมอื่นด้านล่าง';
  return {
    index: naksatOfYear(year),
    year,
    boundaryDate: bd,
    convention: {
      label: `เปลี่ยนปีนักษัตรที่ ${BOUNDARY_LABEL[boundary]}${bd ? ` (ปี ${thaiDate.y}: ${formatThaiDate(bd)})` : ''}`,
    },
    alternatives,
    warning,
  };
}
