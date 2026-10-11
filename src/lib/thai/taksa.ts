// ทักษา 8 ภูมิ, สีประจำวัน, สีมงคล/กาลกิณี, มหาทักษา (ดาวเสวยอายุ)
import type { Convention } from '../core';
import type { ThaiPlanet } from './thaiDay';

/** วงแหวนทักษา: อา จ อ พ ส พฤ รา ศ (CLAUDE.md §3.1) */
export const RING: ThaiPlanet[] = [1, 2, 3, 4, 7, 5, 8, 6];

export const BHUMI_NAMES = ['บริวาร', 'อายุ', 'เดช', 'ศรี', 'มูละ', 'อุตสาหะ', 'มนตรี', 'กาลกิณี'] as const;
export type BhumiName = (typeof BHUMI_NAMES)[number];

export const BHUMI_MEANING: Record<BhumiName, string> = {
  บริวาร: 'คนรอบตัว ครอบครัว ลูกน้อง เพื่อนร่วมทาง',
  อายุ: 'สุขภาพ ความเป็นอยู่ พลังชีวิต',
  เดช: 'อำนาจ ชื่อเสียง ความกล้าตัดสินใจ',
  ศรี: 'โชคลาภ เสน่ห์ ความรุ่งเรือง',
  มูละ: 'รากฐาน ทรัพย์สินที่สะสม ที่ดินบ้านช่อง',
  อุตสาหะ: 'ความขยัน ความพากเพียรในการงาน',
  มนตรี: 'ผู้ใหญ่อุปถัมภ์ ผู้ให้คำปรึกษา',
  กาลกิณี: 'สิ่งที่ควรระวัง สิ่งที่มักเป็นอุปสรรค',
};

/** bhumi[k] = RING[(RING.indexOf(p)+k) % 8] */
export function taksa(p: ThaiPlanet): { bhumi: BhumiName; planet: ThaiPlanet }[] {
  const start = RING.indexOf(p);
  return BHUMI_NAMES.map((bhumi, k) => ({ bhumi, planet: RING[(start + k) % 8] }));
}

export interface DayColor {
  name: string;
  hex: string;
  /** ใช้เป็นตัวอักษรบนพื้นขาวไม่ได้ (WCAG) — CLAUDE.md §7 */
  lowContrast?: boolean;
}

/**
 * สีประจำวัน (ของดาวประจำวัน) — CLAUDE.md §3.1
 * hex เป็นค่าออกแบบที่เสนอเอง (§7) ไม่มีแหล่งอ้างอิง
 * ราหู (พุธกลางคืน) ใช้เขียวอ่อนตาม CLAUDE.md
 */
export const PLANET_COLOR: Record<ThaiPlanet, DayColor> = {
  1: { name: 'แดง', hex: '#D7262E' },
  2: { name: 'เหลือง', hex: '#F2C230', lowContrast: true },
  3: { name: 'ชมพู', hex: '#F27FB0', lowContrast: true },
  4: { name: 'เขียว', hex: '#2E9E5B' },
  5: { name: 'ส้ม', hex: '#F28C28' },
  6: { name: 'ฟ้า', hex: '#3A8FD9' },
  7: { name: 'ม่วง', hex: '#7B4FB3' },
  8: { name: 'เขียวอ่อน', hex: '#8BCB8F', lowContrast: true },
};

export const DAY_COLOR_CONVENTION: Convention = {
  label: 'สีประจำวันแบบที่ใช้ทั่วไป (วันจันทร์มีหลายแหล่งให้สีต่างกัน: เหลือง / เหลืองอ่อน / ขาว)',
};

export interface LuckyColors {
  /** ภูมิที่ใช้เป็นสีมงคลแต่ละด้าน */
  good: { bhumi: BhumiName; planet: ThaiPlanet; color: DayColor }[];
  kalakini: { planet: ThaiPlanet; color: DayColor };
  convention: Convention;
}

const LUCKY_BHUMI: BhumiName[] = ['เดช', 'ศรี', 'มนตรี', 'อายุ'];

/** สีของภูมิ = สีของดาวที่ครองภูมินั้น [ยังไม่ยืนยัน: แต่ละเว็บใช้ต่างกัน] */
export function luckyColors(p: ThaiPlanet): LuckyColors {
  const t = taksa(p);
  const good = LUCKY_BHUMI.map((b) => {
    const planet = t.find((x) => x.bhumi === b)!.planet;
    return { bhumi: b, planet, color: PLANET_COLOR[planet] };
  });
  const k = t[7].planet;
  return {
    good,
    kalakini: { planet: k, color: PLANET_COLOR[k] },
    convention: { label: 'สีของภูมิ = สีประจำวันของดาวที่ครองภูมินั้น (แต่ละสำนักใช้ต่างกัน)', unverified: true },
  };
}

/** ปีที่ดาวเสวยอายุ รวม 108 (CLAUDE.md §3.1) */
export const MAHATAKSA_YEARS: Record<ThaiPlanet, number> = { 1: 6, 2: 15, 3: 8, 4: 17, 7: 10, 5: 19, 8: 12, 6: 21 };

export interface MahataksaPeriod {
  planet: ThaiPlanet;
  fromAge: number;
  toAge: number;
}

/** ช่วงดาวเสวยอายุรอบแรก 108 ปี เดินตามวงแหวนจากดาววันเกิด */
export function mahataksaPeriods(p: ThaiPlanet): MahataksaPeriod[] {
  const start = RING.indexOf(p);
  let acc = 0;
  return RING.map((_, i) => {
    const planet = RING[(start + i) % 8];
    const from = acc;
    acc += MAHATAKSA_YEARS[planet];
    return { planet, fromAge: from, toAge: acc };
  });
}

/**
 * ดาวที่ครองคือดาวที่ผลสะสมเกิน age mod 108 เป็นดวงแรก
 * ธรรมเนียม: ช่วงแรกนับเต็มช่วงตั้งแต่เกิด [ยังไม่ยืนยันทีละขั้นจากตำรา]
 */
export function mahataksaAt(p: ThaiPlanet, age: number): MahataksaPeriod & { cycleAge: number } {
  const a = ((age % 108) + 108) % 108;
  const period = mahataksaPeriods(p).find((x) => x.toAge > a)!;
  return { ...period, cycleAge: a };
}

export const MAHATAKSA_CONVENTION: Convention = {
  label: 'มหาทักษา: เดินวงแหวนทักษาจากดาววันเกิด ช่วงแรกนับเต็มช่วงตั้งแต่เกิด (จันทร์ 15 ปี)',
  unverified: true,
};

/** พาหนะเทวดานพเคราะห์ (Thairath อ้างใน CLAUDE.md §6–7) */
export const PLANET_VEHICLE: Record<ThaiPlanet | 9, string> = {
  1: 'ราชสีห์', 2: 'ม้า', 3: 'กระบือ', 4: 'ช้าง', 5: 'กวาง', 6: 'โค', 7: 'เสือ', 8: 'ครุฑ', 9: 'นาค',
};

/**
 * ทิศของดาวบนผัง 3×3 ตามวงแหวนทักษา (เกตุอยู่กลาง)
 * ยืนยันแล้วเฉพาะอาทิตย์ = อีสาน, อังคาร = อาคเนย์ ที่เหลือ [ยังไม่ยืนยัน] (CLAUDE.md §8)
 */
export const PLANET_DIRECTION: Record<ThaiPlanet, { name: string; row: number; col: number }> = {
  1: { name: 'อีสาน', row: 0, col: 2 },
  2: { name: 'บูรพา', row: 1, col: 2 },
  3: { name: 'อาคเนย์', row: 2, col: 2 },
  4: { name: 'ทักษิณ', row: 2, col: 1 },
  7: { name: 'หรดี', row: 2, col: 0 },
  5: { name: 'ประจิม', row: 1, col: 0 },
  8: { name: 'พายัพ', row: 0, col: 0 },
  6: { name: 'อุดร', row: 0, col: 1 },
};
