import * as A from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { instantFromLocal } from '../src/lib/core';
import { biorhythm, daysSince, tzolkin } from '../src/lib/western/cycles';
import { ascendant, lahiriAyanamsa, meanObliquity } from '../src/lib/western/ephemeris';
import { lifePath, personalYear, reduceKeepMaster } from '../src/lib/western/numerology';
import { birthCards, dailyCards, greerCards, yearCard } from '../src/lib/western/tarot';
import { nakshatra, nakshatraOf, natalChart, planetSign } from '../src/lib/western/zodiac';

describe('Tzolkin', () => {
  it("2026-10-11 = 2 Ik'", () => {
    const t = tzolkin({ y: 2026, m: 10, d: 11 });
    expect(`${t.num} ${t.name}`).toBe("2 Ik'");
  });
});

describe('เลขศาสตร์', () => {
  it('6 พ.ค. 1984 = 33/6', () => {
    expect(lifePath({ y: 1984, m: 5, d: 6 }).display).toBe('33/6');
  });
  it('เก็บเลขมาสเตอร์', () => {
    expect(reduceKeepMaster(29)).toBe(11);
    expect(reduceKeepMaster(38)).toBe(11);
    expect(reduceKeepMaster(19)).toBe(1);
  });
  it('Personal Year เป็นเลขหลักเดียว', () => {
    // r(7) + r(15) + r(2026) = 7 + 6 + 1 = 14 → 5
    expect(personalYear({ y: 1990, m: 7, d: 15 }, 2026)).toBe(5);
  });
});

describe('ทาโรต์', () => {
  it('Greer: 24 ต.ค. 1966 → 2000 → High Priestess', () => {
    const r = greerCards(24, 10, 1966);
    expect(r.personality.en).toBe('The High Priestess');
    expect(r.soul.en).toBe('The High Priestess');
  });
  it('ได้ 22 → The Fool', () => {
    // 2 + 1 + 1990 = 1993 → 22
    expect(greerCards(2, 1, 1990).personality.en).toBe('The Fool');
    expect(greerCards(2, 1, 1990).soul.en).toBe('The Emperor');
  });
  it('เลขแบบ RWS: 8 = Strength, 11 = Justice', () => {
    // 2 + 1 + 2003 = 2006 → 8
    expect(greerCards(2, 1, 2003).personality.en).toBe('Strength');
    // 2 + 2 + 2014 = 2018 → 11
    expect(greerCards(2, 2, 2014).personality.en).toBe('Justice');
  });
  it('ไพ่ประจำปีใช้ปีปัจจุบัน', () => {
    expect(yearCard({ y: 1966, m: 10, d: 24 }, 2026).index).toBe(greerCards(24, 10, 2026).personality.index);
    expect(birthCards({ y: 1966, m: 10, d: 24 }).personality.index).toBe(2);
  });
  it('ไพ่รายวันคงที่ตาม seed และเปลี่ยนตามวัน', () => {
    const b = { y: 1995, m: 3, d: 8 };
    const a1 = dailyCards(b, { y: 2026, m: 10, d: 11 }, 3).map((c) => c.index);
    const a2 = dailyCards(b, { y: 2026, m: 10, d: 11 }, 3).map((c) => c.index);
    expect(a1).toEqual(a2);
    expect(new Set(a1).size).toBe(3);
    const days = new Set(Array.from({ length: 30 }, (_, i) => dailyCards(b, { y: 2026, m: 11, d: i + 1 })[0].index));
    expect(days.size).toBeGreaterThan(10);
  });
});

describe('ไบโอริทึม', () => {
  it('วันเกิด = 0 ทุกรอบ', () => {
    expect(biorhythm(0).every((c) => Math.abs(c.value) < 1e-9)).toBe(true);
    expect(daysSince({ y: 2026, m: 1, d: 1 }, { y: 2026, m: 1, d: 24 })).toBe(23);
  });
});

describe('ephemeris', () => {
  it('Lahiri ≈ 23.857° ที่ J2000 และ ≈ 24.2° ในปี 2026', () => {
    expect(lahiriAyanamsa(new Date(Date.UTC(2000, 0, 1, 12)))).toBeCloseTo(23.857, 2);
    expect(lahiriAyanamsa(new Date(Date.UTC(2026, 0, 1)))).toBeCloseTo(24.22, 1);
  });

  it('ลัคนาอยู่บนขอบฟ้าทิศตะวันออกจริง', () => {
    const cases = [
      { lat: 13.75, lon: 100.5, t: instantFromLocal({ y: 1990, m: 7, d: 15 }, { h: 12, mi: 0 }) },
      { lat: 18.79, lon: 98.98, t: instantFromLocal({ y: 2001, m: 1, d: 3 }, { h: 5, mi: 40 }) },
      { lat: 6.87, lon: 101.25, t: instantFromLocal({ y: 2026, m: 10, d: 11 }, { h: 21, mi: 15 }) },
    ];
    for (const c of cases) {
      const asc = ascendant(c.t, c.lat, c.lon);
      const eps = (meanObliquity(c.t) * Math.PI) / 180;
      const l = (asc * Math.PI) / 180;
      const ra = Math.atan2(Math.sin(l) * Math.cos(eps), Math.cos(l));
      const dec = Math.asin(Math.sin(eps) * Math.sin(l));
      const hor = A.Horizon(c.t, new A.Observer(c.lat, c.lon, 0), ((ra * 180) / Math.PI / 15 + 24) % 24, (dec * 180) / Math.PI);
      expect(Math.abs(hor.altitude)).toBeLessThan(0.5);
      expect(hor.azimuth).toBeLessThan(180);
    }
  });

  it('ราศีไทย (sidereal) ต่างจากสากลราว 24°', () => {
    const date = { y: 1990, m: 7, d: 15 };
    const tro = planetSign('sun', date, { h: 12, mi: 0 }, 'tropical');
    const sid = planetSign('sun', date, { h: 12, mi: 0 }, 'sidereal');
    expect(tro.sign).toBe(3); // กรกฎ
    expect(sid.sign).toBe(2); // เมถุน
  });

  it('ไม่มีเวลาและวันนั้นดวงอาทิตย์ย้ายราศี → มีราศีสำรอง', () => {
    // ดวงอาทิตย์เข้าราศีเมถุน (tropical 60°) 21 พ.ค. 2026 ราว 01:37 UTC
    const r = planetSign('sun', { y: 2026, m: 5, d: 21 }, undefined, 'tropical');
    expect(r.sign).toBe(2);
    expect(r.alternatives).toEqual([1]);
  });

  it('ฤกษ์ 27: แบ่ง 13°20′ และ pada 3°20′', () => {
    expect(nakshatraOf(0)).toEqual({ n: 1, pada: 1 });
    expect(nakshatraOf(13.34)).toEqual({ n: 2, pada: 1 });
    expect(nakshatraOf(359.9)).toEqual({ n: 27, pada: 4 });
    expect(nakshatra({ y: 2026, m: 10, d: 11 }, undefined).candidates.length).toBeGreaterThanOrEqual(1);
  });

  it('ดวงชะตาซ่อนลัคนาถ้าไม่มีเวลาหรือสถานที่', () => {
    expect(natalChart({ date: { y: 1990, m: 7, d: 15 } }, 'sidereal').ascendant).toBeUndefined();
    expect(natalChart({ date: { y: 1990, m: 7, d: 15 }, time: { h: 12, mi: 0 } }, 'sidereal').ascendant).toBeUndefined();
    const full = natalChart(
      { date: { y: 1990, m: 7, d: 15 }, time: { h: 12, mi: 0 }, place: { lat: 13.75, lon: 100.5, name: 'กรุงเทพฯ' } },
      'sidereal',
    );
    expect(full.ascendant).toBeDefined();
    expect(full.planets).toHaveLength(9);
  });
});
