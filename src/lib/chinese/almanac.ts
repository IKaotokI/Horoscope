// ปฏิทินจีนวันนี้: 宜忌 / 冲煞 / 建除 จาก lunar-javascript
import { I18n, Solar } from 'lunar-javascript';
import type { CivilDate } from '../core';

export interface Almanac {
  lunarText: string;
  dayGanzhi: string;
  yi: { zh: string; en: string }[];
  ji: { zh: string; en: string }[];
  chong: string;
  sha: string;
  zhiXing: string;
}

function read(date: CivilDate) {
  const l = Solar.fromYmd(date.y, date.m, date.d).getLunar();
  return {
    yi: l.getDayYi(),
    ji: l.getDayJi(),
    chong: l.getDayChongDesc(),
    sha: l.getDaySha(),
    zhiXing: l.getZhiXing(),
    lunarText: `${l.getYearInGanZhi()}年 ${l.getMonthInChinese()}月${l.getDayInChinese()}`,
    dayGanzhi: l.getDayInGanZhi(),
  };
}

/** ข้อความภาษาอังกฤษได้จาก I18n ของไลบรารี (สลับภาษาชั่วคราวแล้วคืนค่าเดิม) */
export function almanac(date: CivilDate): Almanac {
  const zh = read(date);
  const prev = I18n.getLanguage();
  let en = zh;
  try {
    I18n.setLanguage('en');
    en = read(date);
  } finally {
    I18n.setLanguage(prev);
  }
  return {
    lunarText: zh.lunarText,
    dayGanzhi: zh.dayGanzhi,
    yi: zh.yi.map((v, i) => ({ zh: v, en: en.yi[i] ?? '' })),
    ji: zh.ji.map((v, i) => ({ zh: v, en: en.ji[i] ?? '' })),
    chong: zh.chong,
    sha: zh.sha,
    zhiXing: zh.zhiXing,
  };
}
