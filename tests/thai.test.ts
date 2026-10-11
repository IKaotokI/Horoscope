import { describe, expect, it } from 'vitest';
import { fromJdn, jdn, weekdayOf } from '../src/lib/core';
import { lek7 } from '../src/lib/thai/lek7';
import { LUNAR_RANGE, thaiLunarDate, waxing1Month5 } from '../src/lib/thai/lunar';
import { NAKSAT_NAMES, naksatOfYear, thaiNaksat } from '../src/lib/thai/naksat';
import { luckyColors, mahataksaAt, mahataksaPeriods, taksa } from '../src/lib/thai/taksa';
import { resolveThaiDay } from '../src/lib/thai/thaiDay';

describe('core', () => {
  it('JDN round trip และวันในสัปดาห์', () => {
    expect(jdn({ y: 2000, m: 1, d: 1 })).toBe(2451545);
    expect(fromJdn(2451545)).toEqual({ y: 2000, m: 1, d: 1 });
    expect(weekdayOf({ y: 2026, m: 10, d: 11 })).toBe(0); // อาทิตย์
  });
});

describe('ทักษา', () => {
  it('คนเกิดวันอาทิตย์: บริวาร = อาทิตย์, กาลกิณี = ศุกร์', () => {
    const t = taksa(1);
    expect(t.map((x) => x.planet)).toEqual([1, 2, 3, 4, 7, 5, 8, 6]);
    expect(t[7]).toEqual({ bhumi: 'กาลกิณี', planet: 6 });
  });
  it('พุธกลางคืน = ราหู 8', () => {
    expect(taksa(8).map((x) => x.planet)).toEqual([8, 6, 1, 2, 3, 4, 7, 5]);
  });
  it('สีกาลกิณีคนเกิดวันอาทิตย์คือสีของศุกร์ (ฟ้า)', () => {
    expect(luckyColors(1).kalakini.color.name).toBe('ฟ้า');
  });
});

describe('มหาทักษา', () => {
  it('รวม 108 ปี', () => {
    const p = mahataksaPeriods(1);
    expect(p[p.length - 1].toAge).toBe(108);
  });
  it('เกิดวันอาทิตย์ อายุ 30 อยู่ใต้พุธ (29–46)', () => {
    const r = mahataksaAt(1, 30);
    expect(r.planet).toBe(4);
    expect([r.fromAge, r.toAge]).toEqual([29, 46]);
  });
  it('วนรอบที่ 108', () => {
    expect(mahataksaAt(1, 108).planet).toBe(1);
  });
});

describe('ขอบวันไทย', () => {
  const wed = { y: 2026, m: 10, d: 14 };
  it('วันพุธไม่มีเวลา แสดงทั้งสองแบบ', () => {
    expect(resolveThaiDay({ date: wed }).planets).toEqual([4, 8]);
  });
  it('พุธ 10:00 = พุธกลางวัน, 19:00 = ราหู', () => {
    expect(resolveThaiDay({ date: wed, time: { h: 10, mi: 0 } }).planets).toEqual([4]);
    expect(resolveThaiDay({ date: wed, time: { h: 19, mi: 0 } }).planets).toEqual([8]);
  });
  it('ตี 5 วันพฤหัส = ยังเป็นพุธกลางคืน', () => {
    const r = resolveThaiDay({ date: { y: 2026, m: 10, d: 15 }, time: { h: 5, mi: 0 } });
    expect(r.thaiDate).toEqual(wed);
    expect(r.planets).toEqual([8]);
  });
  it('ตี 3 วันจันทร์ = วันอาทิตย์', () => {
    const r = resolveThaiDay({ date: { y: 2026, m: 10, d: 12 }, time: { h: 3, mi: 0 } });
    expect(r.weekday).toBe(0);
    expect(r.planets).toEqual([1]);
  });
});

describe('จันทรคติไทย (ตาราง pythaidate)', () => {
  it('วิสาขบูชา 2568 = 11 พ.ค. 2025 ขึ้น 15 ค่ำ เดือน 6', () => {
    expect(thaiLunarDate({ y: 2025, m: 5, d: 11 })).toEqual({ month: 6, day: 15 });
  });
  it('มาฆบูชา 2569 (ปีอธิกมาส) = 3 มี.ค. 2026 ขึ้น 15 ค่ำ เดือน 4', () => {
    expect(thaiLunarDate({ y: 2026, m: 3, d: 3 })).toEqual({ month: 4, day: 15 });
  });
  it('ครอบคลุม 1900–2100', () => {
    expect(LUNAR_RANGE.from.y).toBeLessThanOrEqual(1900);
    expect(LUNAR_RANGE.to.y).toBeGreaterThanOrEqual(2100);
  });
  it('ขึ้น 1 ค่ำ เดือน 5 อยู่ในช่วง มี.ค.–เม.ย. ทุกปี', () => {
    for (let y = 1900; y <= 2100; y++) {
      const d = waxing1Month5(y);
      expect(d, String(y)).not.toBeNull();
      expect([3, 4], String(y)).toContain(d!.m);
    }
  });
});

describe('นักษัตรไทย', () => {
  it('2026 = มะเมีย', () => {
    expect(NAKSAT_NAMES[naksatOfYear(2026) - 1]).toBe('มะเมีย');
  });
  it('ก่อนขึ้น 1 ค่ำ เดือน 5 ยังเป็นปีเก่า, 1 ม.ค. เป็นปีใหม่แล้ว', () => {
    const r = thaiNaksat({ y: 2026, m: 2, d: 1 }, 'lunar5');
    expect(NAKSAT_NAMES[r.index - 1]).toBe('มะเส็ง');
    expect(r.warning).toBeDefined();
    expect(r.alternatives.find((a) => a.boundary === 'jan1')!.index).toBe(naksatOfYear(2026));
  });
  it('หลังสงกรานต์ทุกธรรมเนียมตรงกัน', () => {
    const r = thaiNaksat({ y: 2026, m: 6, d: 1 }, 'songkran');
    expect(r.alternatives.every((a) => a.index === r.index)).toBe(true);
    expect(r.warning).toBeUndefined();
  });
});

describe('เลข 7 ตัว 4 ฐาน', () => {
  it('อาทิตย์ / เดือน 5 / ชวด', () => {
    const r = lek7(0, 5, 1, '');
    expect(r.day).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(r.month).toEqual([5, 6, 7, 1, 2, 3, 4]);
    expect(r.year).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(r.sum).toEqual([7, 10, 13, 9, 12, 15, 18]);
  });
  it('เดือน 12 → ฐาน 5, นักษัตรกุน (12) → ฐาน 5', () => {
    const r = lek7(6, 12, 12, '');
    expect(r.day[0]).toBe(7);
    expect(r.month[0]).toBe(5);
    expect(r.year[0]).toBe(5);
  });
});
