// รวมผลคำนวณทุกศาสตร์จากสถานะฟอร์ม (ทำงานในเบราว์เซอร์ทั้งหมด ไม่ส่งข้อมูลออก)
import { PROVINCES } from '../data/provinces';
import { almanac } from '../lib/chinese/almanac';
import { bazi, chineseZodiac } from '../lib/chinese/bazi';
import { kua } from '../lib/chinese/kua';
import {
  ageInYears, type BirthInput, parseClock, parseIsoDate, todayBangkok, weekdayOf,
} from '../lib/core';
import { lek7 } from '../lib/thai/lek7';
import { monthNumber, thaiLunarDate } from '../lib/thai/lunar';
import { BOUNDARY_LABEL, thaiNaksat } from '../lib/thai/naksat';
import { luckyColors, mahataksaAt, mahataksaPeriods, taksa } from '../lib/thai/taksa';
import { resolveThaiDay, type ThaiPlanet } from '../lib/thai/thaiDay';
import { biorhythm, daysSince, tzolkin } from '../lib/western/cycles';
import { birthdayNumber, lifePath, personalYear } from '../lib/western/numerology';
import { birthCards, dailyCards, yearCard } from '../lib/western/tarot';
import { nakshatra, natalChart, planetSign } from '../lib/western/zodiac';
import type { InputField } from '../lib/sciences';
import type { AppState } from './state';

/** ข้อมูลที่ผู้ใช้กรอกแล้ว (ใช้กำหนดความสว่างของดาวแต่ละศาสตร์) */
export function filledFields(s: AppState): Set<InputField> {
  const have = new Set<InputField>();
  const input = toBirthInput(s);
  if (!input) return have;
  have.add('date');
  if (input.time) have.add('time');
  if (input.place) have.add('place');
  if (input.sex) have.add('sex');
  return have;
}

export function toBirthInput(s: AppState): BirthInput | null {
  const date = parseIsoDate(s.form.date);
  if (!date || date.y < 1900 || date.y > 2100) return null;
  // เวลาเกิดเลือกเป็นชั่วโมง → คำนวณที่กลางชั่วโมง (HH:30)
  const time = /^\d{2}$/.test(s.form.time) ? parseClock(`${s.form.time}:30`) ?? undefined : undefined;
  const p = PROVINCES.find((x) => x.name === s.form.province);
  return {
    date,
    time,
    place: p ? { lat: p.lat, lon: p.lon, name: p.name } : undefined,
    sex: s.form.sex || undefined,
  };
}

export type Results = ReturnType<typeof computeAll>;

export function computeAll(input: BirthInput, s: AppState, now = new Date()) {
  const today = todayBangkok(now);
  const { conv } = s;

  // ไทย
  const day = resolveThaiDay(input, conv.dayBoundary);
  const planet: ThaiPlanet = day.planets.length > 1 ? s.wedChoice : day.planets[0];
  const lunar = thaiLunarDate(day.thaiDate);
  const naksat = thaiNaksat(day.thaiDate, conv.thaiYear);
  const age = Math.max(0, ageInYears(input.date, today));
  const thai = {
    day,
    planet,
    taksa: taksa(planet),
    lucky: luckyColors(planet),
    lunar,
    naksat,
    lek7: lunar ? lek7(day.weekday, monthNumber(lunar.month), naksat.index, BOUNDARY_LABEL[conv.thaiYear]) : null,
    age,
    mahataksa: { periods: mahataksaPeriods(planet), now: mahataksaAt(planet, age) },
    sunSign: planetSign('sun', input.date, input.time, 'sidereal'),
    chart: natalChart(input, 'sidereal'),
    nakshatra: nakshatra(input.date, input.time),
  };

  // จีน
  const zodiac = chineseZodiac(input.date, input.time, conv.chineseYear);
  const lichunZodiac = conv.chineseYear === 'lichun' ? zodiac : chineseZodiac(input.date, input.time, 'lichun');
  const currentZodiac = chineseZodiac(today, undefined, 'lichun');
  const chinese = {
    zodiac,
    currentYear: currentZodiac,
    bazi: bazi(input, { ziHour: conv.ziHour, trueSolarTime: conv.trueSolarTime }),
    kua: {
      male: kua(lichunZodiac.year, 'male'),
      female: kua(lichunZodiac.year, 'female'),
      lichunYear: lichunZodiac.year,
    },
  };

  // สากล
  const western = {
    sun: planetSign('sun', input.date, input.time, 'tropical'),
    moon: planetSign('moon', input.date, input.time, 'tropical'),
    chart: natalChart(input, 'tropical'),
    lifePath: lifePath(input.date),
    birthday: birthdayNumber(input.date.d),
    personalYear: personalYear(input.date, today.y),
    tarot: birthCards(input.date),
    yearCard: yearCard(input.date, today.y),
    biorhythmDays: daysSince(input.date, today),
    tzolkin: tzolkin(input.date),
  };

  const todayInfo = {
    date: today,
    weekday: weekdayOf(today),
    cards: dailyCards(input.date, today, 3),
    almanac: almanac(today),
    biorhythm: biorhythm(daysSince(input.date, today)),
  };

  return { input, thai, chinese, western, today: todayInfo };
}
