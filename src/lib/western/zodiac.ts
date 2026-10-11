// ราศี (tropical สากล / sidereal ไทย-ลาหิรี), ดวงชะตา, ลัคนา, ฤกษ์ 27
import {
  addDays, type BirthInput, type CivilDate, type ClockTime, type Convention, instantFromLocal, mod,
} from '../core';
import {
  ascendant, lahiriAyanamsa, type PlanetKey, siderealLongitude, tropicalLongitude,
} from './ephemeris';

export type ZodiacMode = 'tropical' | 'sidereal';

export const SIGNS_TH = ['เมษ', 'พฤษภ', 'เมถุน', 'กรกฎ', 'สิงห์', 'กันย์', 'ตุลย์', 'พิจิก', 'ธนู', 'มังกร', 'กุมภ์', 'มีน'];
export const SIGNS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
// U+FE0E บังคับให้แสดงเป็นตัวอักษร ไม่ใช่ emoji สี
export const SIGN_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((g) => `${g}\uFE0E`);

export const SIGN_KEYWORDS = [
  'กล้าเริ่มต้น ใจร้อน ตรงไปตรงมา',
  'มั่นคง รักความสบาย อดทน',
  'ช่างพูด อยากรู้อยากเห็น ปรับตัวไว',
  'อ่อนโยน ห่วงบ้าน ความรู้สึกไว',
  'มั่นใจ ใจกว้าง ชอบเป็นจุดสนใจ',
  'ละเอียด ช่างวิเคราะห์ ชอบช่วยเหลือ',
  'รักความยุติธรรม ประนีประนอม มีรสนิยม',
  'ลึกซึ้ง มุ่งมั่น เก็บความรู้สึก',
  'รักอิสระ มองโลกกว้าง ชอบผจญภัย',
  'มีวินัย ทะเยอทะยาน รับผิดชอบสูง',
  'คิดนอกกรอบ เป็นตัวของตัวเอง รักเพื่อน',
  'จินตนาการสูง เห็นอกเห็นใจ ศิลปิน',
];

const signOf = (lon: number) => Math.floor(mod(lon, 360) / 30);

const longitude = (p: PlanetKey, t: Date, mode: ZodiacMode) =>
  mode === 'tropical' ? tropicalLongitude(p, t) : siderealLongitude(p, t);

export interface SignResult {
  sign: number;
  degree: number; // องศาภายในราศี
  /** ถ้าไม่รู้เวลาและวันนั้นดาวย้ายราศี จะมีราศีอื่นที่เป็นไปได้ */
  alternatives: number[];
  convention: Convention;
}

const dayInstants = (date: CivilDate) => ({
  start: instantFromLocal(date, { h: 0, mi: 0 }),
  noon: instantFromLocal(date, { h: 12, mi: 0 }),
  end: instantFromLocal(addDays(date, 1), { h: 0, mi: 0 }),
});

/**
 * ราศีของดาวในวันเกิด — ถ้าไม่มีเวลาใช้เที่ยงวัน และติด flag ถ้าวันนั้นดาวย้ายราศี
 */
export function planetSign(p: PlanetKey, date: CivilDate, time: ClockTime | undefined, mode: ZodiacMode): SignResult {
  const label =
    mode === 'tropical'
      ? 'ราศีสากล (Tropical) จากลองจิจูดจริง ไม่ใช้ตารางวันที่'
      : 'ราศีไทย นิรายนะ ลาหิรี (Sidereal Lahiri)';
  if (time) {
    const lon = longitude(p, instantFromLocal(date, time), mode);
    return { sign: signOf(lon), degree: mod(lon, 30), alternatives: [], convention: { label } };
  }
  const { start, noon, end } = dayInstants(date);
  const lon = longitude(p, noon, mode);
  const s0 = signOf(longitude(p, start, mode));
  const s1 = signOf(longitude(p, end, mode));
  const sign = signOf(lon);
  const alternatives = [...new Set([s0, s1])].filter((s) => s !== sign);
  return {
    sign,
    degree: mod(lon, 30),
    alternatives,
    convention: { label: `${label} · ไม่มีเวลาเกิด คำนวณที่ 12:00 น.` },
  };
}

export const THAI_CHART_PLANETS: { key: PlanetKey; num: string; name: string; glyph: string }[] = [
  { key: 'sun', num: '๑', name: 'อาทิตย์', glyph: '☉' },
  { key: 'moon', num: '๒', name: 'จันทร์', glyph: '☽' },
  { key: 'mars', num: '๓', name: 'อังคาร', glyph: '♂' },
  { key: 'mercury', num: '๔', name: 'พุธ', glyph: '☿' },
  { key: 'jupiter', num: '๕', name: 'พฤหัสบดี', glyph: '♃' },
  { key: 'venus', num: '๖', name: 'ศุกร์', glyph: '♀' },
  { key: 'saturn', num: '๗', name: 'เสาร์', glyph: '♄' },
  { key: 'rahu', num: '๘', name: 'ราหู', glyph: '☊' },
  { key: 'uranus', num: '๐', name: 'มฤตยู', glyph: '♅' },
];

export interface ChartPlanet {
  key: PlanetKey;
  num: string;
  name: string;
  glyph: string;
  lon: number;
  sign: number;
}

export interface Chart {
  mode: ZodiacMode;
  planets: ChartPlanet[];
  /** มีเฉพาะเมื่อรู้ทั้งเวลาและสถานที่ */
  ascendant?: { lon: number; sign: number };
  ayanamsa: number;
  timeAssumed: boolean;
  convention: Convention;
}

export function natalChart(input: BirthInput, mode: ZodiacMode): Chart {
  const t = instantFromLocal(input.date, input.time ?? { h: 12, mi: 0 });
  const planets = THAI_CHART_PLANETS.map((p) => {
    const lon = longitude(p.key, t, mode);
    return { ...p, lon, sign: signOf(lon) };
  });
  let asc: Chart['ascendant'];
  if (input.time && input.place) {
    let lon = ascendant(t, input.place.lat, input.place.lon);
    if (mode === 'sidereal') lon = mod(lon - lahiriAyanamsa(t), 360);
    asc = { lon, sign: signOf(lon) };
  }
  const parts = [
    mode === 'sidereal' ? 'นิรายนะ ลาหิรี' : 'Tropical',
    'ราหู = mean node',
    'ยังไม่แสดงเกตุ (๙) เพราะเกตุไทยคำนวณต่างจาก south node',
  ];
  if (!input.time) parts.push('ไม่มีเวลาเกิด วางดาวที่ 12:00 น. และซ่อนลัคนา');
  else if (!input.place) parts.push('ไม่มีจังหวัดเกิด จึงซ่อนลัคนา');
  return {
    mode,
    planets,
    ascendant: asc,
    ayanamsa: lahiriAyanamsa(t),
    timeAssumed: !input.time,
    convention: { label: parts.join(' · ') },
  };
}

/** ชื่อฤกษ์ภาษาสันสกฤต — ชื่อภาษาไทยและ 9 หมู่ฤกษ์ [ยังไม่ยืนยัน] จึงยังไม่แสดง */
export const NAKSHATRA_NAMES = [
  'Ashvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

const SPAN = 360 / 27;

export const nakshatraOf = (lonSid: number) => ({
  n: Math.floor(mod(lonSid, 360) / SPAN) + 1,
  pada: Math.floor((mod(lonSid, 360) % SPAN) / (SPAN / 4)) + 1,
});

export interface NakshatraResult {
  /** ถ้าไม่มีเวลาเกิด อาจได้หลายค่า */
  candidates: { n: number; pada: number }[];
  convention: Convention;
}

export function nakshatra(date: CivilDate, time: ClockTime | undefined): NakshatraResult {
  if (time) {
    const lon = siderealLongitude('moon', instantFromLocal(date, time));
    return { candidates: [nakshatraOf(lon)], convention: { label: 'ฤกษ์ 27 จากดวงจันทร์นิรายนะ ลาหิรี' } };
  }
  // ดวงจันทร์เดินได้ถึง ~15°/วัน จึงอาจผ่านมากกว่าสองฤกษ์ — สุ่มทุกชั่วโมงแล้วเก็บฤกษ์ที่ต่างกัน
  const { start } = dayInstants(date);
  const candidates: { n: number; pada: number }[] = [];
  for (let h = 0; h <= 24; h++) {
    const t = new Date(start.getTime() + Math.min(h * 3600_000, 86_340_000));
    const k = nakshatraOf(siderealLongitude('moon', t));
    if (!candidates.some((c) => c.n === k.n)) candidates.push(k);
  }
  return {
    candidates,
    convention: { label: 'ฤกษ์ 27 จากดวงจันทร์นิรายนะ ลาหิรี · ไม่มีเวลาเกิด แสดงฤกษ์ต้นวันและปลายวัน' },
  };
}
