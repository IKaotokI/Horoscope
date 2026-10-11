// เลข 7 ตัว (ทำ 4 ฐาน) — ฐาน 5–9 [ยังไม่ยืนยัน ห้ามทำ] (CLAUDE.md §3.1)
import type { Convention } from '../core';

/** base(x) = ((x−1) % 7) + 1 */
export const base7 = (x: number): number => ((((x - 1) % 7) + 7) % 7) + 1;

/** row(b)[j] = ((b−1+j) % 7) + 1 */
export const row7 = (b: number): number[] => Array.from({ length: 7 }, (_, j) => ((b - 1 + j) % 7) + 1);

export const ROW_POSITIONS = {
  day: ['อัตตะ', 'หินะ', 'ธนัง', 'ปิตา', 'มาตา', 'โภคา', 'มัชฌิมา'],
  month: ['ตนุ', 'กดุมภะ', 'สหัชชะ', 'พันธุ', 'ปุตตะ', 'อริ', 'ปัตนิ'],
  year: ['มรณะ', 'สุภะ', 'กัมมะ', 'ลาภะ', 'พยายะ', 'ทาสา', 'ทาสี'],
};

export interface Lek7 {
  day: number[];
  month: number[];
  year: number[];
  sum: number[];
  convention: Convention;
}

/**
 * @param weekday 0 = อาทิตย์ (นับวันตามพระอาทิตย์ขึ้น)
 * @param lunarMonth เดือนจันทรคติ อ้าย = 1 (8/8 นับเป็น 8)
 * @param naksat นักษัตรไทย ชวด = 1
 */
export function lek7(weekday: number, lunarMonth: number, naksat: number, conventionLabel: string): Lek7 {
  const day = row7(base7(weekday + 1));
  const month = row7(base7(lunarMonth));
  const year = row7(base7(naksat));
  return {
    day,
    month,
    year,
    sum: day.map((v, j) => v + month[j] + year[j]),
    convention: { label: `ฐาน 1 วัน (อา = 1) · ฐาน 2 เดือนจันทรคติ (อ้าย = 1) · ฐาน 3 นักษัตร (ชวด = 1, ${conventionLabel}) · ฐาน 4 ผลรวม` },
  };
}
