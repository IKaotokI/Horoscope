// เลขศาสตร์ Life Path / Birthday / Personal Year (CLAUDE.md §3.3)
import type { CivilDate, Convention } from '../core';

const digitSum = (n: number) => String(Math.abs(n)).split('').reduce((s, c) => s + +c, 0);

const MASTER = new Set([11, 22, 33]);

/** ลดหลักจนเหลือหลักเดียว แต่เก็บ 11/22/33 ไว้ */
export function reduceKeepMaster(n: number): number {
  let x = n;
  while (x > 9 && !MASTER.has(x)) x = digitSum(x);
  return x;
}

export function reduceSingle(n: number): number {
  let x = n;
  while (x > 9) x = digitSum(x);
  return x;
}

export interface LifePath {
  value: number;
  /** แสดงผลแบบ "33/6" */
  display: string;
  convention: Convention;
}

/** r(M)+r(D)+r(Y) แล้วลดอีกครั้ง เก็บเลขมาสเตอร์ — ตรวจ: 6 พ.ค. 1984 = 33/6 */
export function lifePath({ y, m, d }: CivilDate): LifePath {
  const value = reduceKeepMaster(reduceKeepMaster(m) + reduceKeepMaster(d) + reduceKeepMaster(y));
  return {
    value,
    display: MASTER.has(value) ? `${value}/${reduceSingle(value)}` : String(value),
    convention: { label: 'ลดทีละส่วน r(เดือน) + r(วัน) + r(ปี) แล้วลดอีกครั้ง เก็บเลขมาสเตอร์ 11/22/33' },
  };
}

export const birthdayNumber = (d: number) => reduceKeepMaster(d);

/** r(r(M)+r(D)+r(ปีปัจจุบัน)) เปลี่ยนวันที่ 1 ม.ค. */
export const personalYear = ({ m, d }: CivilDate, currentYear: number) =>
  reduceSingle(reduceSingle(m) + reduceSingle(d) + reduceSingle(currentYear));

export const LIFE_PATH_MEANING: Record<number, string> = {
  1: 'ผู้บุกเบิก มีความเป็นผู้นำ อยากทำอะไรด้วยตัวเอง',
  2: 'ผู้ประสาน ใส่ใจคนรอบข้าง ทำงานเป็นทีมเก่ง',
  3: 'นักสื่อสาร สร้างสรรค์ ร่าเริง มีเสน่ห์ทางคำพูด',
  4: 'นักสร้าง มีระบบ อดทน เชื่อถือได้',
  5: 'นักเดินทาง รักอิสระ ชอบความเปลี่ยนแปลง',
  6: 'ผู้ดูแล รักครอบครัว มีความรับผิดชอบ',
  7: 'นักคิด ชอบค้นหาความจริง มีโลกภายในลึก',
  8: 'นักบริหาร มุ่งความสำเร็จ จัดการเงินและอำนาจเก่ง',
  9: 'ผู้ให้ ใจกว้าง มองภาพใหญ่ อยากช่วยโลก',
  11: 'เลขมาสเตอร์ 11 — ผู้จุดประกาย ญาณไว เป็นแรงบันดาลใจ',
  22: 'เลขมาสเตอร์ 22 — ผู้สร้างการใหญ่ ทำฝันให้เป็นจริง',
  33: 'เลขมาสเตอร์ 33 — ผู้เยียวยา เมตตาและเสียสละ',
};

export const PERSONAL_YEAR_MEANING: Record<number, string> = {
  1: 'ปีแห่งการเริ่มต้นใหม่ ลงเมล็ดพันธุ์',
  2: 'ปีแห่งความร่วมมือและความอดทน',
  3: 'ปีแห่งการแสดงออกและสังคม',
  4: 'ปีแห่งการวางรากฐานและทำงานหนัก',
  5: 'ปีแห่งการเปลี่ยนแปลงและอิสรภาพ',
  6: 'ปีแห่งครอบครัวและความรับผิดชอบ',
  7: 'ปีแห่งการทบทวนและเรียนรู้ภายใน',
  8: 'ปีแห่งผลลัพธ์ เงิน และความสำเร็จ',
  9: 'ปีแห่งการปิดรอบและปล่อยวาง',
};
