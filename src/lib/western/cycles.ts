// ไบโอริทึม และ Tzolk'in (CLAUDE.md §3.3)
import { type CivilDate, jdn, mod } from '../core';

export const BIORHYTHM_CYCLES = [
  { key: 'physical', th: 'ร่างกาย', days: 23 },
  { key: 'emotional', th: 'อารมณ์', days: 28 },
  { key: 'intellectual', th: 'สติปัญญา', days: 33 },
] as const;

/** t = จำนวนวันเต็มตามปฏิทิน (Asia/Bangkok) ตั้งแต่เกิด */
export const daysSince = (birth: CivilDate, on: CivilDate) => jdn(on) - jdn(birth);

export const biorhythm = (t: number) =>
  BIORHYTHM_CYCLES.map((c) => ({ ...c, value: Math.sin((2 * Math.PI * t) / c.days) }));

export const TZOLKIN_NAMES = [
  'Imix', "Ik'", "Ak'b'al", "K'an", 'Chikchan', 'Kimi', "Manik'", 'Lamat', 'Muluk', 'Ok',
  'Chuwen', "Eb'", "B'en", 'Ix', 'Men', "K'ib'", "Kab'an", "Etz'nab'", 'Kawak', 'Ajaw',
];

/** d = JDN − 584283; num = ((d+3) % 13) + 1; name = (d+19) % 20 — ตรวจ: 2026-10-11 = 2 Ik' */
export function tzolkin(date: CivilDate) {
  const d = jdn(date) - 584283;
  const num = mod(d + 3, 13) + 1;
  const nameIdx = mod(d + 19, 20);
  return { num, nameIdx, name: TZOLKIN_NAMES[nameIdx] };
}
