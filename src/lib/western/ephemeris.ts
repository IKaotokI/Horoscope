// ตำแหน่งดาวจาก astronomy-engine (MIT) — ห้ามใช้ Swiss Ephemeris (AGPL) ดู CLAUDE.md §4
import * as A from 'astronomy-engine';
import { mod } from '../core';

export type PlanetKey =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'rahu';

const BODY: Partial<Record<PlanetKey, A.Body>> = {
  mercury: A.Body.Mercury,
  venus: A.Body.Venus,
  mars: A.Body.Mars,
  jupiter: A.Body.Jupiter,
  saturn: A.Body.Saturn,
  uranus: A.Body.Uranus,
};

const julianCenturies = (t: Date): number => A.MakeTime(t).tt / 36525;

/** ลองจิจูดสุริยวิถีแบบ tropical (true ecliptic of date), องศา 0..360 */
export function tropicalLongitude(planet: PlanetKey, t: Date): number {
  switch (planet) {
    case 'sun':
      return A.SunPosition(t).elon;
    case 'moon':
      return A.EclipticGeoMoon(t).lon;
    case 'rahu':
      return meanNode(t);
    default:
      return A.Ecliptic(A.GeoVector(BODY[planet]!, t, true)).elon;
  }
}

/** Mean lunar ascending node (Meeus, Astronomical Algorithms บทที่ 47) */
export function meanNode(t: Date): number {
  const T = julianCenturies(t);
  return mod(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441, 360);
}

/**
 * Ayanamsa ลาหิรี: ค่าอ้างอิง 23°15′00.658″ ที่ 21 มี.ค. 1956 (นิยามของ Indian Ephemeris)
 * บวก general precession in longitude (IAU 1976, Lieske 1977)
 * ให้ ≈ 23.857° ที่ J2000 และ ≈ 24.22° ในปี 2026 (CLAUDE.md: ≈ 24.2°)
 * [ยังไม่ยืนยัน] ยังไม่ได้เทียบกับ Swiss Ephemeris ทีละค่า — ความต่างคาดว่าอยู่ในระดับ arc-second
 */
export function lahiriAyanamsa(t: Date): number {
  const T = julianCenturies(t);
  const T0 = (2435553.5 - 2451545.0) / 36525;
  const pA = (x: number) => (5029.0966 * x + 1.11113 * x * x - 0.000006 * x * x * x) / 3600;
  return 23.250182778 + (pA(T) - pA(T0));
}

export const siderealLongitude = (planet: PlanetKey, t: Date): number =>
  mod(tropicalLongitude(planet, t) - lahiriAyanamsa(t), 360);

/** มุมเอียงของแกนโลก (mean obliquity, IAU 2006) */
export function meanObliquity(t: Date): number {
  const T = julianCenturies(t);
  return (84381.406 - 46.836769 * T - 0.0001831 * T * T + 0.0020034 * T * T * T) / 3600;
}

const rad = Math.PI / 180;

/**
 * ลัคนา (Ascendant) แบบ tropical — สูตรจาก CLAUDE.md §3.3
 * ASC = atan2(cos RAMC, −(sin RAMC·cos ε + tan φ·sin ε))
 */
export function ascendant(t: Date, lat: number, lon: number): number {
  const ramc = mod(A.SiderealTime(t) * 15 + lon, 360) * rad;
  const eps = meanObliquity(t) * rad;
  const asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat * rad) * Math.sin(eps)));
  return mod(asc / rad, 360);
}

/** เวลาที่ดวงอาทิตย์ถึงลองจิจูด tropical ที่ระบุ ครั้งแรกหลัง start */
export function searchSunLongitude(target: number, start: Date, limitDays: number): Date | null {
  const r = A.SearchSunLongitude(target, start, limitDays);
  return r ? r.date : null;
}

/** เวลาพระอาทิตย์ขึ้น/ตก ครั้งแรกหลัง start */
export function sunEvent(kind: 'rise' | 'set', lat: number, lon: number, start: Date): Date | null {
  const r = A.SearchRiseSet(A.Body.Sun, new A.Observer(lat, lon, 0), kind === 'rise' ? 1 : -1, start, 1.5);
  return r ? r.date : null;
}

/** เวลาสุริยคติปรากฏ (apparent solar time) เป็นชั่วโมง 0..24 */
export function apparentSolarHours(t: Date, lat: number, lon: number): number {
  return mod(A.HourAngle(A.Body.Sun, t, new A.Observer(lat, lon, 0)) + 12, 24);
}
