import { Solar } from 'lunar-javascript';
import { describe, expect, it } from 'vitest';
import { instantFromLocal, localFromInstant } from '../src/lib/core';
import { almanac } from '../src/lib/chinese/almanac';
import { bazi, chineseNewYear, chineseZodiac, dayPillar, lichun, monthStem } from '../src/lib/chinese/bazi';
import {
  BRANCHES, chongKindFor, chongOfYear, ganzhiText, liuhai, liuhe, sanhe, STEMS, yearBranch, yearElementByLastDigit, yearStem,
} from '../src/lib/chinese/ganzhi';
import { kua, kuaGroup } from '../src/lib/chinese/kua';
import { tropicalLongitude } from '../src/lib/western/ephemeris';

const txt = (p: { stem: number; branch: number }) => ganzhiText(p.stem, p.branch);

describe('ก้านกิ่งของปี', () => {
  it('2026 = 丙午 ม้าไฟ', () => {
    expect(STEMS[yearStem(2026)] + BRANCHES[yearBranch(2026)]).toBe('丙午');
    expect(yearElementByLastDigit(2026)).toBe('fire');
  });
});

describe('ปีชงแบบไทย ปี 2569 (午)', () => {
  const c = chongOfYear(6);
  it('ชวด = ชงตรง', () => expect(c.direct).toBe(0));
  it('มะเมีย = ชงตัวเอง, เถาะ/ระกา = ชงร่วม', () => {
    expect(c.self).toBe(6);
    expect(c.shared.sort()).toEqual([3, 9]);
  });
  it('มะโรงไม่ชง', () => expect(chongKindFor(4, 6)).toBeNull());
});

describe('คู่สัมพันธ์', () => {
  it('子: 三合 申辰, 六合 丑, 六害 未', () => {
    expect(sanhe(0).sort((a, b) => a - b)).toEqual([4, 8]);
    expect(liuhe(0)).toBe(1);
    expect(liuhai(0)).toBe(7);
  });
});

describe('Kua', () => {
  it('ชาย 1975 = 7, หญิง 1985 = 9', () => {
    expect(kua(1975, 'male')).toBe(7);
    expect(kua(1985, 'female')).toBe(9);
  });
  it('ได้ 5 → ชาย 2 / หญิง 8', () => {
    // ชาย: (11−r)%9 = 5 → r = 6, เช่นปี 1986 (1986 mod 9 = 6)
    expect(kua(1986, 'male')).toBe(2);
    // หญิง: (r+4)%9 = 5 → r = 1, เช่นปี 1981
    expect(kua(1981, 'female')).toBe(8);
  });
  it('กลุ่มตะวันออก/ตะวันตก', () => {
    expect([1, 3, 4, 9].map(kuaGroup)).toEqual(['east', 'east', 'east', 'east']);
    expect([2, 6, 7, 8].map(kuaGroup)).toEqual(['west', 'west', 'west', 'west']);
  });
});

describe('ปาจื้อ', () => {
  it('เสาวัน 2000-01-01 = 戊午', () => {
    expect(txt(dayPillar({ y: 2000, m: 1, d: 1 }))).toBe('戊午');
  });

  it('ตรงกับตัวอย่างของ lunar-javascript (2005-12-23 08:37 เวลาจีน = 07:37 เวลาไทย)', () => {
    const r = bazi({ date: { y: 2005, m: 12, d: 23 }, time: { h: 7, mi: 37 } }, { ziHour: 'nextDay', trueSolarTime: false });
    expect([r.year, r.month, r.day, r.hour!].map(txt)).toEqual(['乙酉', '戊子', '辛巳', '壬辰']);
  });

  it('15 ก.ค. 1990 12:00 กทม. → 庚午 癸未 辛巳 甲午 (เทียบกับไลบรารี)', () => {
    const r = bazi({ date: { y: 1990, m: 7, d: 15 }, time: { h: 12, mi: 0 } }, { ziHour: 'nextDay', trueSolarTime: false });
    expect([r.year, r.month, r.day, r.hour!].map(txt)).toEqual(['庚午', '癸未', '辛巳', '甲午']);
    // ไลบรารีคิดเวลาจีน: เสาปี/เดือน/วันที่ 13:00 CST ตรงกัน ส่วนเสายามเราใช้เวลาท้องถิ่นไทย (12:00 = 午)
    const ec = Solar.fromYmdHms(1990, 7, 15, 13, 0, 0).getLunar().getEightChar();
    expect([ec.getYear(), ec.getMonth(), ec.getDay()]).toEqual(['庚午', '癸未', '辛巳']);
    expect(Solar.fromYmdHms(1990, 7, 15, 12, 0, 0).getLunar().getEightChar().getTime()).toBe('甲午');
  });

  it('เสาวันตรงกับไลบรารีทุกวันตลอด 2 ปี', () => {
    for (let i = 0; i < 730; i++) {
      const d = localFromInstant(new Date(Date.UTC(2023, 0, 1) + i * 86_400_000), 0).date;
      const lib = Solar.fromYmdHms(d.y, d.m, d.d, 12, 0, 0).getLunar().getEightChar().getDay();
      expect(txt(dayPillar(d))).toBe(lib);
    }
  });

  it('23:00 早子/晚子', () => {
    const date = { y: 1988, m: 2, d: 15 };
    const next = bazi({ date, time: { h: 23, mi: 30 } }, { ziHour: 'nextDay', trueSolarTime: false });
    const same = bazi({ date, time: { h: 23, mi: 30 } }, { ziHour: 'sameDay', trueSolarTime: false });
    expect(txt(next.day)).toBe('辛丑');
    expect(txt(same.day)).toBe('庚子');
    expect(txt(next.hour!)).toBe('戊子');
    expect(txt(same.hour!)).toBe('戊子');
  });

  it('เสาเดือนของไลบรารีตรงกับสูตรลองจิจูดดวงอาทิตย์ + 五虎遁', () => {
    for (let i = 0; i < 120; i++) {
      const t = new Date(Date.UTC(1950, 0, 15) + i * 31 * 86_400_000);
      const lon = tropicalLongitude('sun', t);
      const fromJie = ((lon - 315 + 360) % 360) % 30;
      if (fromJie < 0.5 || fromJie > 29.5) continue; // เลี่ยงช่วงใกล้ 節
      const l = localFromInstant(t);
      const r = bazi({ date: l.date, time: l.time }, { ziHour: 'nextDay', trueSolarTime: false });
      const branch = (Math.floor(((lon - 315 + 360) % 360) / 30) + 2) % 12;
      expect(r.month.branch).toBe(branch);
      expect(r.month.stem).toBe(monthStem(r.year.stem, branch));
    }
  });

  it('ไม่มีเวลาเกิด = 3 เสา, ธาตุนับ 6 อักษร', () => {
    const r = bazi({ date: { y: 1990, m: 7, d: 15 } }, { ziHour: 'nextDay', trueSolarTime: false });
    expect(r.hour).toBeUndefined();
    expect(Object.values(r.elements).reduce((a, b) => a + b, 0)).toBe(6);
  });

  it('ไม่มีเวลาเกิดและเกิดวันที่มี 節 จะมีเสาเดือนสำรอง', () => {
    const lc = lichun(2026);
    const r = bazi({ date: lc.date }, { ziHour: 'nextDay', trueSolarTime: false });
    expect(r.monthAlt).toBeDefined();
    expect(r.yearAlt).toBeDefined();
  });

  it('大運 ต้องมีเพศ', () => {
    const date = { y: 1990, m: 7, d: 15 };
    expect(bazi({ date }, { ziHour: 'nextDay', trueSolarTime: false }).daYun).toBeUndefined();
    const m = bazi({ date, time: { h: 12, mi: 0 }, sex: 'male' }, { ziHour: 'nextDay', trueSolarTime: false });
    // ชายปีหยาง (庚) นับเดินหน้า: 癸未 → 甲申
    expect(m.daYun!.forward).toBe(true);
    expect(m.daYun!.periods[0].ganzhi).toBe('甲申');
    const f = bazi({ date, time: { h: 12, mi: 0 }, sex: 'female' }, { ziHour: 'nextDay', trueSolarTime: false });
    expect(f.daYun!.forward).toBe(false);
    expect(f.daYun!.periods[0].ganzhi).toBe('壬午');
  });

  it('true solar time กรุงเทพฯ ช้ากว่านาฬิการาว 18 นาที ± equation of time', () => {
    const r = bazi(
      { date: { y: 2026, m: 4, d: 15 }, time: { h: 12, mi: 0 }, place: { lat: 13.75, lon: 100.5, name: 'กรุงเทพฯ' } },
      { ziHour: 'nextDay', trueSolarTime: true },
    );
    // 15 เม.ย. equation of time ≈ 0 → offset ≈ −18 นาที
    expect(r.usedTime!.solarOffsetMin!).toBeGreaterThan(-21);
    expect(r.usedTime!.solarOffsetMin!).toBeLessThan(-15);
  });
});

describe('นักษัตรจีน ลิบชุน/ตรุษจีน', () => {
  it('ปี 2569: ลิบชุน 4 ก.พ., ตรุษจีน 17 ก.พ.', () => {
    expect(lichun(2026).date).toEqual({ y: 2026, m: 2, d: 4 });
    expect(chineseNewYear(2026)).toEqual({ y: 2026, m: 2, d: 17 });
  });
  it('เกิด 10 ก.พ. 2026: ลิบชุน = ม้า, ตรุษจีน = งู และมีคำอธิบาย', () => {
    const r = chineseZodiac({ y: 2026, m: 2, d: 10 }, undefined, 'lichun');
    expect(r.byLichun).toBe(6);
    expect(r.byCny).toBe(5);
    expect(r.branch).toBe(6);
    expect(r.explain).toBeDefined();
  });
  it('เวลาลิบชุนจากดาราศาสตร์ตรงกับไลบรารีภายใน 2 นาที', () => {
    const lc = lichun(2026);
    const jq = instantFromLocal({ y: 2026, m: 2, d: 4 }, { h: 4, mi: 2 }, 8 * 60); // 立春 2026 ≈ 04:02 เวลาจีน
    expect(Math.abs(lc.instant.getTime() - jq.getTime())).toBeLessThan(2 * 60_000);
  });
});

describe('ปฏิทินจีนวันนี้', () => {
  it('มี 宜/忌 และคำแปลภาษาอังกฤษ', () => {
    const a = almanac({ y: 2026, m: 10, d: 11 });
    expect(a.yi.length).toBeGreaterThan(0);
    expect(a.yi[0].en).toMatch(/[A-Za-z]/);
    expect(a.dayGanzhi).toHaveLength(2);
  });
});
