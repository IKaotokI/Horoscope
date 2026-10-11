// ขอบวันแบบไทย: วันเปลี่ยนตอนพระอาทิตย์ขึ้น (ค่าตั้งต้น 06:00) และพุธกลางคืน
import {
  addDays, type BirthInput, type CivilDate, type Convention, instantFromLocal, localFromInstant, weekdayOf,
} from '../core';
import { sunEvent } from '../western/ephemeris';

/** เลขดาวไทย: 1 อาทิตย์ 2 จันทร์ 3 อังคาร 4 พุธ 5 พฤหัส 6 ศุกร์ 7 เสาร์ 8 ราหู 9 เกตุ 0 มฤตยู */
export type ThaiPlanet = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DayBoundary = 'fixed0600' | 'sunrise';

export interface ThaiDayResult {
  /** วันตามปฏิทินไทยแบบนับตอนพระอาทิตย์ขึ้น */
  thaiDate: CivilDate;
  /** 0 = อาทิตย์ … 6 = เสาร์ */
  weekday: number;
  /** ดาวประจำวันเกิด ถ้าเกิดวันพุธแต่ไม่รู้เวลาจะมี 2 ค่า (พุธกลางวัน 4 / พุธกลางคืน 8) */
  planets: ThaiPlanet[];
  convention: Convention;
  note?: string;
}

const WEEKDAY_PLANET: ThaiPlanet[] = [1, 2, 3, 4, 5, 6, 7];

const minutes = (h: number, mi: number) => h * 60 + mi;

function sunTimesLocal(date: CivilDate, lat: number, lon: number) {
  const midnight = instantFromLocal(date, { h: 0, mi: 0 });
  const rise = sunEvent('rise', lat, lon, midnight);
  const set = sunEvent('set', lat, lon, midnight);
  const toMin = (t: Date | null, fallback: number) => {
    if (!t) return fallback;
    const l = localFromInstant(t);
    return minutes(l.time.h, l.time.mi);
  };
  return { rise: toMin(rise, 360), set: toMin(set, 1080) };
}

export function resolveThaiDay(input: BirthInput, boundary: DayBoundary = 'fixed0600'): ThaiDayResult {
  const useSun = boundary === 'sunrise' && !!input.place;
  const convention: Convention = useSun
    ? { label: `วันเปลี่ยนตอนพระอาทิตย์ขึ้นจริงที่${input.place!.name} · พุธกลางคืน = ตั้งแต่พระอาทิตย์ตกถึงขึ้น`, unverified: true }
    : { label: 'วันเปลี่ยนตอนพระอาทิตย์ขึ้น 06:00 · พุธกลางคืน = 18:00–06:00', unverified: true };

  if (!input.time) {
    const weekday = weekdayOf(input.date);
    return {
      thaiDate: input.date,
      weekday,
      planets: weekday === 3 ? [4, 8] : [WEEKDAY_PLANET[weekday]],
      convention,
      note:
        'ไม่ได้ระบุเวลาเกิด จึงถือวันตามปฏิทิน ถ้าเกิดก่อนพระอาทิตย์ขึ้นจะนับเป็นวันก่อนหน้า' +
        (weekday === 3 ? ' และวันพุธแสดงทั้งพุธกลางวันกับพุธกลางคืน' : ''),
    };
  }

  const t = minutes(input.time.h, input.time.mi);
  let rise = 360;
  let dusk = 1080;
  if (useSun) {
    const s = sunTimesLocal(input.date, input.place!.lat, input.place!.lon);
    rise = s.rise;
    dusk = s.set;
  }
  const beforeSunrise = t < rise;
  const thaiDate = beforeSunrise ? addDays(input.date, -1) : input.date;
  const weekday = weekdayOf(thaiDate);
  let planet = WEEKDAY_PLANET[weekday];
  if (weekday === 3) {
    // วันพุธ: กลางคืน = หลังพระอาทิตย์ตกของวันพุธ หรือก่อนพระอาทิตย์ขึ้นของเช้าวันพฤหัส
    if (beforeSunrise || t >= dusk) planet = 8;
  }
  return {
    thaiDate,
    weekday,
    planets: [planet],
    convention,
    note: beforeSunrise ? 'เกิดก่อนพระอาทิตย์ขึ้น จึงนับเป็นวันก่อนหน้าตามธรรมเนียมไทย' : undefined,
  };
}

export const THAI_WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export const PLANET_NAME: Record<ThaiPlanet, string> = {
  1: 'อาทิตย์', 2: 'จันทร์', 3: 'อังคาร', 4: 'พุธ', 5: 'พฤหัสบดี', 6: 'ศุกร์', 7: 'เสาร์', 8: 'ราหู',
};

/** ชื่อวันเกิดของดาวประจำวัน (ราหู = พุธกลางคืน) */
export const PLANET_DAY_NAME: Record<ThaiPlanet, string> = {
  1: 'วันอาทิตย์', 2: 'วันจันทร์', 3: 'วันอังคาร', 4: 'วันพุธ (กลางวัน)', 5: 'วันพฤหัสบดี',
  6: 'วันศุกร์', 7: 'วันเสาร์', 8: 'วันพุธ (กลางคืน)',
};
