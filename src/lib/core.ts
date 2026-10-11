// ฟังก์ชันพื้นฐานที่ทุกศาสตร์ใช้ร่วมกัน (pure, ไม่มี side effect)

export interface CivilDate {
  y: number;
  m: number; // 1..12
  d: number; // 1..31
}

export interface ClockTime {
  h: number; // 0..23
  mi: number; // 0..59
}

/** ข้อมูลเกิดที่ผู้ใช้กรอก — บังคับแค่วันเกิด */
export interface BirthInput {
  date: CivilDate;
  time?: ClockTime; // เวลาท้องถิ่นไทย (UTC+7)
  place?: { lat: number; lon: number; name: string };
  sex?: 'male' | 'female';
}

export const THAI_TZ_OFFSET_MIN = 7 * 60;

/** ผลลัพธ์ทุกอันต้องบอกธรรมเนียมที่ใช้ (CLAUDE.md §1) */
export interface Convention {
  label: string;
  /** true = มาจากข้อมูลที่ติด [ยังไม่ยืนยัน] ใน CLAUDE.md ต้องตรวจก่อนเปิดตัว */
  unverified?: boolean;
}

export const mod = (a: number, n: number): number => ((a % n) + n) % n;

/** JDN ปฏิทินเกรกอเรียน (CLAUDE.md §3.3) */
export function jdn({ y, m, d }: CivilDate): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

export function fromJdn(j: number): CivilDate {
  const a = j + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    d: e - Math.floor((153 * m + 2) / 5) + 1,
    m: m + 3 - 12 * Math.floor(m / 10),
    y: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** 0 = อาทิตย์ … 6 = เสาร์ */
export const weekdayOf = (date: CivilDate): number => mod(jdn(date) + 1, 7);

export const addDays = (date: CivilDate, n: number): CivilDate => fromJdn(jdn(date) + n);

export const compareDate = (a: CivilDate, b: CivilDate): number => jdn(a) - jdn(b);

export const isoDate = ({ y, m, d }: CivilDate): string =>
  `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export function parseIsoDate(s: string): CivilDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const date = { y: +m[1], m: +m[2], d: +m[3] };
  const back = fromJdn(jdn(date));
  return back.y === date.y && back.m === date.m && back.d === date.d ? date : null;
}

export function parseClock(s: string): ClockTime | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const h = +m[1];
  const mi = +m[2];
  return h < 24 && mi < 60 ? { h, mi } : null;
}

/** ขณะเวลา (UTC) จากวันเวลาท้องถิ่นที่ offset นาที */
export function instantFromLocal(date: CivilDate, time: ClockTime, offsetMin = THAI_TZ_OFFSET_MIN): Date {
  return new Date(Date.UTC(date.y, date.m - 1, date.d, time.h, time.mi) - offsetMin * 60_000);
}

/** วันเวลาท้องถิ่นของขณะเวลาหนึ่งที่ offset นาที */
export function localFromInstant(t: Date, offsetMin = THAI_TZ_OFFSET_MIN): { date: CivilDate; time: ClockTime } {
  const s = new Date(t.getTime() + offsetMin * 60_000);
  return {
    date: { y: s.getUTCFullYear(), m: s.getUTCMonth() + 1, d: s.getUTCDate() },
    time: { h: s.getUTCHours(), mi: s.getUTCMinutes() },
  };
}

/** วันนี้ตามเวลา Asia/Bangkok */
export const todayBangkok = (now: Date = new Date()): CivilDate => localFromInstant(now).date;

/** อายุเต็มปี ณ วันที่กำหนด */
export function ageInYears(birth: CivilDate, on: CivilDate): number {
  let age = on.y - birth.y;
  if (on.m < birth.m || (on.m === birth.m && on.d < birth.d)) age--;
  return age;
}

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';
export const toThaiDigits = (v: number | string): string =>
  String(v).replace(/[0-9]/g, (c) => THAI_DIGITS[+c]);

export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

/** พ.ศ. = ค.ศ. + 543 */
export const beYear = (y: number): number => y + 543;

export const formatThaiDate = (d: CivilDate): string =>
  `${d.d} ${THAI_MONTHS_SHORT[d.m - 1]} ${beYear(d.y)}`;
