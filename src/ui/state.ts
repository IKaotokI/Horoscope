// สถานะของหน้าเว็บ + การจำค่าใน localStorage (เฉพาะความสะดวกฝั่งผู้ใช้, ห่อ try/catch ตาม CLAUDE.md §2)
import type { ChineseYearBoundary, ZiHourRule } from '../lib/chinese/bazi';
import type { ThaiYearBoundary } from '../lib/thai/naksat';
import type { DayBoundary } from '../lib/thai/thaiDay';

export type Tab = 'thai' | 'chinese' | 'western' | 'today';

export interface FormState {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM หรือว่าง
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
  remember: boolean;
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

interface Saved {
  form: FormState;
  conv: Conventions;
}

export function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Saved;
    if (typeof v?.form?.date !== 'string') return null;
    return { form: v.form, conv: { ...DEFAULT_CONVENTIONS, ...v.conv } };
  } catch {
    return null;
  }
}

export function saveForm(s: AppState): void {
  try {
    if (s.remember) localStorage.setItem(KEY, JSON.stringify({ form: s.form, conv: s.conv } satisfies Saved));
    else localStorage.removeItem(KEY);
  } catch {
    /* โหมดส่วนตัวหรือถูกบล็อก — ไม่ต้องทำอะไร */
  }
}

export function clearSaved(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(PREF_KEY);
  } catch {
    /* ignore */
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
