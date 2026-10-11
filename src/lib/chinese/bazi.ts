// ปาจื้อ 八字 — เสาปี/เดือนจาก lunar-javascript (เวลา 節 ที่ UTC+8), เสาวัน/ยามจากสูตรใน CLAUDE.md §3.2
import { Lunar, Solar } from 'lunar-javascript';
import {
  addDays, type BirthInput, type CivilDate, type ClockTime, type Convention, compareDate, formatThaiDate,
  instantFromLocal, jdn, localFromInstant, mod,
} from '../core';
import { apparentSolarHours, searchSunLongitude } from '../western/ephemeris';
import {
  BRANCHES, branchElement, type Element, ganzhiOfIndex, STEMS, stemElement, yearBranch,
} from './ganzhi';

export type ZiHourRule = 'nextDay' | 'sameDay';
export type ChineseYearBoundary = 'lichun' | 'cny';

export interface Pillar {
  stem: number;
  branch: number;
}

export interface BaziOptions {
  ziHour: ZiHourRule;
  trueSolarTime: boolean;
}

export interface BaziResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour?: Pillar;
  /** เมื่อไม่มีเวลาเกิดและวันนั้นมี 節/ลิบชุน เสาอาจเปลี่ยนกลางวัน */
  yearAlt?: Pillar;
  monthAlt?: Pillar;
  dayMaster: number;
  elements: Record<Element, number>;
  /** เวลาที่ใช้หาเสายาม (หลังปรับ true solar time ถ้าเลือก) */
  usedTime?: { date: CivilDate; time: ClockTime; solarOffsetMin?: number };
  daYun?: DaYunInfo;
  convention: Convention;
}

export interface DaYunInfo {
  forward: boolean;
  startYears: number;
  startMonths: number;
  startDays: number;
  periods: { startYear: number; ganzhi: string }[];
}

const parsePillar = (gz: string): Pillar => ({ stem: STEMS.indexOf(gz[0]), branch: BRANCHES.indexOf(gz[1]) });

/** ขณะเวลา → Solar ของ lunar-javascript ที่เวลาจีน (UTC+8) */
function solarCst(t: Date) {
  const l = localFromInstant(t, 8 * 60);
  return Solar.fromYmdHms(l.date.y, l.date.m, l.date.d, l.time.h, l.time.mi, 0);
}

function yearMonthAt(t: Date): { year: Pillar; month: Pillar } {
  const ec = solarCst(t).getLunar().getEightChar();
  return { year: parsePillar(ec.getYear()), month: parsePillar(ec.getMonth()) };
}

/** เสาวัน: (JDN + 49) mod 60 — ตรวจ: 2000-01-01 = 戊午 */
export const dayPillar = (date: CivilDate): Pillar => ganzhiOfIndex(mod(jdn(date) + 49, 60));

/** เสายาม: branch = floor((h+1)/2) % 12, ziStem = (2·(dStem % 5)) % 10 */
export function hourPillar(dayStem: number, h: number): Pillar {
  const branch = Math.floor((h + 1) / 2) % 12;
  const ziStem = (2 * (dayStem % 5)) % 10;
  return { stem: (ziStem + branch) % 10, branch };
}

/** ก้านเดือนด้วย 五虎遁: yinStem = (2·(yStem % 5) + 2) % 10 */
export function monthStem(yearStemIdx: number, monthBranch: number): number {
  const yinStem = (2 * (yearStemIdx % 5) + 2) % 10;
  return (yinStem + mod(monthBranch - 2, 12)) % 10;
}

/** เวลาท้องถิ่นแบบสุริยคติปรากฏ (true solar time) ของเวลาเกิด */
export function trueSolarLocal(date: CivilDate, time: ClockTime, lat: number, lon: number) {
  const t = instantFromLocal(date, time);
  const solarMin = apparentSolarHours(t, lat, lon) * 60;
  const clockMin = time.h * 60 + time.mi;
  const offset = mod(solarMin - clockMin + 720, 1440) - 720;
  const shifted = localFromInstant(new Date(t.getTime() + offset * 60_000));
  return { ...shifted, solarOffsetMin: Math.round(offset) };
}

export function bazi(input: BirthInput, opts: BaziOptions): BaziResult {
  const notes: string[] = ['เสาปีเปลี่ยนที่ลิบชุน', 'เสาเดือนตาม 12 節 (เวลาจีน UTC+8)', 'เสาวันตามวันปฏิทินไทย'];
  let year: Pillar;
  let month: Pillar;
  let yearAlt: Pillar | undefined;
  let monthAlt: Pillar | undefined;
  let hour: Pillar | undefined;
  let usedTime: BaziResult['usedTime'];
  let dayDate = input.date;

  if (input.time) {
    const t = instantFromLocal(input.date, input.time);
    ({ year, month } = yearMonthAt(t));
    let local = { date: input.date, time: input.time, solarOffsetMin: undefined as number | undefined };
    if (opts.trueSolarTime && input.place) {
      local = trueSolarLocal(input.date, input.time, input.place.lat, input.place.lon);
      notes.push(`ยามเกิดใช้ true solar time ของ${input.place.name}`);
    }
    usedTime = local;
    const lateZi = local.time.h >= 23;
    dayDate = lateZi && opts.ziHour === 'nextDay' ? addDays(local.date, 1) : local.date;
    // เสายามใช้ก้านวันถัดไปเสมอเมื่อ 23:00 ขึ้นไป (ทั้ง 早子 และ 晚子)
    const stemDay = lateZi ? addDays(local.date, 1) : local.date;
    hour = hourPillar(dayPillar(stemDay).stem, local.time.h);
    notes.push(opts.ziHour === 'nextDay' ? '23:00 นับเป็นวันถัดไป' : '23:00–24:00 ยังนับเป็นวันเดิม (晚子)');
  } else {
    const start = instantFromLocal(input.date, { h: 0, mi: 0 });
    const end = instantFromLocal(addDays(input.date, 1), { h: 0, mi: 0 });
    const a = yearMonthAt(start);
    const b = yearMonthAt(new Date(end.getTime() - 60_000));
    ({ year, month } = yearMonthAt(instantFromLocal(input.date, { h: 12, mi: 0 })));
    if (a.year.stem !== b.year.stem) yearAlt = a.year.stem === year.stem ? b.year : a.year;
    if (a.month.branch !== b.month.branch) monthAlt = a.month.branch === month.branch ? b.month : a.month;
    notes.push('ไม่มีเวลาเกิด: 3 เสา คำนวณที่ 12:00 น.');
  }

  const day = dayPillar(dayDate);
  const elements: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const p of [year, month, day, hour]) {
    if (!p) continue;
    elements[stemElement(p.stem)]++;
    elements[branchElement(p.branch)]++;
  }

  let daYun: DaYunInfo | undefined;
  if (input.sex) {
    const t = instantFromLocal(input.date, input.time ?? { h: 12, mi: 0 });
    const yun = solarCst(t).getLunar().getEightChar().getYun(input.sex === 'male' ? 1 : 0);
    daYun = {
      forward: yun.isForward(),
      startYears: yun.getStartYear(),
      startMonths: yun.getStartMonth(),
      startDays: yun.getStartDay(),
      periods: yun
        .getDaYun(9)
        .filter((d) => d.getIndex() > 0)
        .map((d) => ({ startYear: d.getStartYear(), ganzhi: d.getGanZhi() })),
    };
  }

  return {
    year,
    month,
    day,
    hour,
    yearAlt,
    monthAlt,
    dayMaster: day.stem,
    elements,
    usedTime,
    daYun,
    convention: { label: notes.join(' · ') },
  };
}

export interface ChineseZodiacResult {
  branch: number;
  year: number;
  boundary: ChineseYearBoundary;
  lichunDate: CivilDate;
  cnyDate: CivilDate;
  /** ถ้าเกิดก่อนลิบชุนหรือตรุษจีน แสดงสัตว์ทั้งสองแบบ */
  byLichun: number;
  byCny: number;
  explain?: string;
  convention: Convention;
}

/** วันลิบชุน (λ☉ = 315°) ตามวันที่ประเทศไทย และขณะเวลาจริง */
export function lichun(year: number): { instant: Date; date: CivilDate } {
  const instant = searchSunLongitude(315, new Date(Date.UTC(year, 0, 20)), 30)!;
  return { instant, date: localFromInstant(instant).date };
}

export function chineseNewYear(year: number): CivilDate {
  const s = Lunar.fromYmd(year, 1, 1).getSolar();
  return { y: s.getYear(), m: s.getMonth(), d: s.getDay() };
}

export function chineseZodiac(
  date: CivilDate,
  time: ClockTime | undefined,
  boundary: ChineseYearBoundary = 'lichun',
): ChineseZodiacResult {
  const lc = lichun(date.y);
  const cny = chineseNewYear(date.y);
  let lichunYear: number;
  if (time) lichunYear = instantFromLocal(date, time) >= lc.instant ? date.y : date.y - 1;
  else lichunYear = compareDate(date, lc.date) >= 0 ? date.y : date.y - 1;
  const cnyYear = compareDate(date, cny) >= 0 ? date.y : date.y - 1;
  const year = boundary === 'lichun' ? lichunYear : cnyYear;
  const byLichun = yearBranch(lichunYear);
  const byCny = yearBranch(cnyYear);
  let explain: string | undefined;
  const beforeEither = compareDate(date, lc.date) < 0 || compareDate(date, cny) < 0;
  if (beforeEither) {
    explain =
      `ปี ${date.y} ลิบชุนตรงกับ ${formatThaiDate(lc.date)} และตรุษจีนตรงกับ ${formatThaiDate(cny)} ` +
      'คุณเกิดก่อนวันเปลี่ยนปีอย่างน้อยหนึ่งแบบ จึงแสดงนักษัตรตามทั้งสองธรรมเนียม';
  }
  if (!time && compareDate(date, lc.date) === 0) {
    explain = `${explain ? `${explain} · ` : ''}เกิดวันลิบชุนพอดี ต้องรู้เวลาเกิดจึงจะบอกปีได้แน่นอน (ลิบชุนเวลา ${localFromInstant(lc.instant).time.h}:${String(localFromInstant(lc.instant).time.mi).padStart(2, '0')} น. เวลาไทย)`;
  }
  return {
    branch: yearBranch(year),
    year,
    boundary,
    lichunDate: lc.date,
    cnyDate: cny,
    byLichun,
    byCny,
    explain,
    convention: {
      label: boundary === 'lichun' ? 'เปลี่ยนปีที่ลิบชุน 立春 (λ☉ = 315°) ตามสายดวงจีนในไทย' : 'เปลี่ยนปีที่ตรุษจีน (ชิวอิด เดือน 1)',
    },
  };
}
