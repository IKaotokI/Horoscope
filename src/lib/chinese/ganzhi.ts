// ก้าน/กิ่ง, 12 นักษัตรจีน, ปีชงแบบไทย, คู่สัมพันธ์
import { mod } from '../core';

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const BRANCH_ANIMAL_TH = ['ชวด (หนู)', 'ฉลู (วัว)', 'ขาล (เสือ)', 'เถาะ (กระต่าย)', 'มะโรง (มังกร)', 'มะเส็ง (งู)', 'มะเมีย (ม้า)', 'มะแม (แพะ)', 'วอก (ลิง)', 'ระกา (ไก่)', 'จอ (สุนัข)', 'กุน (หมู)'];
export const BRANCH_EMOJI = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export const ELEMENT_TH: Record<Element, string> = { wood: 'ไม้', fire: 'ไฟ', earth: 'ดิน', metal: 'ทอง', water: 'น้ำ' };
export const ELEMENT_ZH: Record<Element, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

/** 甲乙 ไม้, 丙丁 ไฟ, 戊己 ดิน, 庚辛 ทอง, 壬癸 น้ำ */
export const stemElement = (s: number): Element => (['wood', 'fire', 'earth', 'metal', 'water'] as Element[])[Math.floor(mod(s, 10) / 2)];

/** ธาตุหลักของกิ่ง (ไม่รวม 藏干) */
export const branchElement = (b: number): Element =>
  (['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'] as Element[])[mod(b, 12)];

export const isYang = (stem: number) => mod(stem, 2) === 0;

/** stem = (Y−4) mod 10 (甲 = 0), branch = (Y−4) mod 12 (子 = 0) */
export const yearStem = (y: number) => mod(y - 4, 10);
export const yearBranch = (y: number) => mod(y - 4, 12);

export const ganzhiOfIndex = (i: number) => ({ stem: mod(i, 10), branch: mod(i, 12) });
export const ganzhiIndex = (stem: number, branch: number): number => {
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === branch) return i;
  throw new Error('invalid ganzhi');
};
export const ganzhiText = (stem: number, branch: number) => STEMS[stem] + BRANCHES[branch];

export interface ChongResult {
  direct: number;
  self: number;
  /** ชงร่วม = สมาชิกที่เหลือในกลุ่ม b % 3 (ไม่รวมตัวเองและชงตรง) */
  shared: number[];
}

/**
 * ปีชงแบบไทย [อนุมาน] — b = กิ่งของปีที่ดู
 * ตรวจกับปี 2569: ชวด = ชงตรง, มะเมีย/เถาะ/ระกา = ชงร่วม (มะเมียบางสื่อเรียกชงตัวเอง)
 */
export function chongOfYear(b: number): ChongResult {
  const direct = mod(b + 6, 12);
  const shared = [0, 1, 2, 3].map((k) => mod(b + 3 * k, 12)).filter((x) => x !== b && x !== direct);
  return { direct, self: b, shared };
}

export type ChongKind = 'direct' | 'self' | 'shared' | null;

export function chongKindFor(personBranch: number, yearBranchIdx: number): ChongKind {
  const c = chongOfYear(yearBranchIdx);
  if (personBranch === c.direct) return 'direct';
  if (personBranch === c.self) return 'self';
  if (c.shared.includes(personBranch)) return 'shared';
  return null;
}

/** 三合 (b±4), 六合 (13−b), 六害 (19−b) */
export const sanhe = (b: number) => [mod(b + 4, 12), mod(b - 4, 12)];
export const liuhe = (b: number) => mod(13 - b, 12);
export const liuhai = (b: number) => mod(19 - b, 12);

/** ธาตุของปีจากเลขท้าย ค.ศ.: 0–1 ทอง, 2–3 น้ำ, 4–5 ไม้, 6–7 ไฟ, 8–9 ดิน */
export const yearElementByLastDigit = (y: number): Element =>
  (['metal', 'water', 'wood', 'fire', 'earth'] as Element[])[Math.floor(mod(y, 10) / 2)];
