// เลข Kua (八宅) — ต้องรู้เพศกำเนิด (CLAUDE.md §3.2)
import { mod } from '../core';

export type Sex = 'male' | 'female';

/**
 * r = (ปีตามลิบชุน) mod 9; ชาย k = (11−r) % 9, หญิง k = (r+4) % 9
 * ได้ 0 → 9, ได้ 5 → ชาย 2 / หญิง 8
 * ตรวจ: ชาย 1975 = 7, หญิง 1985 = 9
 */
export function kua(lichunYear: number, sex: Sex): number {
  const r = mod(lichunYear, 9);
  let k = sex === 'male' ? mod(11 - r, 9) : mod(r + 4, 9);
  if (k === 0) k = 9;
  if (k === 5) k = sex === 'male' ? 2 : 8;
  return k;
}

export const kuaGroup = (k: number): 'east' | 'west' => ([1, 3, 4, 9].includes(k) ? 'east' : 'west');

/** ตรีแกรมตามผัง 後天 (ทิศของ Kua) */
export const KUA_TRIGRAM: Record<number, { zh: string; symbol: string; direction: string }> = {
  1: { zh: '坎', symbol: '☵', direction: 'เหนือ' },
  2: { zh: '坤', symbol: '☷', direction: 'ตะวันตกเฉียงใต้' },
  3: { zh: '震', symbol: '☳', direction: 'ตะวันออก' },
  4: { zh: '巽', symbol: '☴', direction: 'ตะวันออกเฉียงใต้' },
  6: { zh: '乾', symbol: '☰', direction: 'ตะวันตกเฉียงเหนือ' },
  7: { zh: '兌', symbol: '☱', direction: 'ตะวันตก' },
  8: { zh: '艮', symbol: '☶', direction: 'ตะวันออกเฉียงเหนือ' },
  9: { zh: '離', symbol: '☲', direction: 'ใต้' },
};
