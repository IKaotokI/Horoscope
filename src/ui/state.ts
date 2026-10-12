// สถานะของหน้าเว็บ + การจำค่าใน localStorage (เฉพาะความสะดวกฝั่งผู้ใช้, ห่อ try/catch ตาม CLAUDE.md §2)
import type { ChineseYearBoundary, ZiHourRule } from '../lib/chinese/bazi';
import type { ThaiYearBoundary } from '../lib/thai/naksat';
import type { DayBoundary } from '../lib/thai/thaiDay';

export type Tab = 'thai' | 'chinese' | 'western' | 'today';

export interface FormState {
  date: string; // YYYY-MM-DD
  time: string; // ชั่วโมง 'HH' (00–23) หรือว่าง — เลือกจาก dropdown
  province: string; // ชื่อจังหวัดหรือว่าง
  sex: '' | 'male' | 'female';
}

export interface Conventions {
  thaiYear: ThaiYearBoundary;
  chineseYear: ChineseYearBoundary;
  ziHour: ZiHourRule;
  dayBoundary: DayBoundary;
  trueSolarTime: boolean;
}

export interface AppState {
  form: FormState;
  conv: Conventions;
  tab: Tab;
  /** เลือกพุธกลางวัน (4) / กลางคืน (8) เมื่อไม่มีเวลาเกิด */
  wedChoice: 4 | 8;
  effects: boolean;
}

export const DEFAULT_CONVENTIONS: Conventions = {
  thaiYear: 'lunar5',
  chineseYear: 'lichun',
  ziHour: 'nextDay',
  dayBoundary: 'fixed0600',
  trueSolarTime: true,
};

const KEY = 'horoscope.saved.v1';
const PREF_KEY = 'horoscope.prefs.v1';

/** ลบข้อมูลเกิดที่รุ่นก่อนเคยจำไว้ (ฟีเจอร์ "จำค่าที่กรอก" ถูกเอาออกแล้ว) */
export function purgeSavedBirth(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* โหมดส่วนตัวหรือถูกบล็อก — ไม่ต้องทำอะไร */
  }
}

/** ค่าที่ไม่ใช่ข้อมูลเกิด (เปิด/ปิดเอฟเฟกต์) */
export function loadEffectsPref(): boolean | null {
  try {
    const v = localStorage.getItem(PREF_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

export function saveEffectsPref(on: boolean): void {
  try {
    localStorage.setItem(PREF_KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}
