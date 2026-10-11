// ประกาศ type เฉพาะส่วนที่โปรเจกต์ใช้ (lunar-javascript ไม่มี type มาให้)
declare module 'lunar-javascript' {
  export interface Solar {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
    toYmd(): string;
    toYmdHms(): string;
  }
  export interface DaYun {
    getStartYear(): number;
    getEndYear(): number;
    getStartAge(): number;
    getIndex(): number;
    getGanZhi(): string;
  }
  export interface Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    isForward(): boolean;
    getStartSolar(): Solar;
    getDaYun(n?: number): DaYun[];
  }
  export interface EightChar {
    setSect(sect: number): void;
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYun(gender: number, sect?: number): Yun;
  }
  export interface Lunar {
    getEightChar(): EightChar;
    getSolar(): Solar;
    getYearInGanZhiExact(): string;
    getMonthInGanZhiExact(): string;
    getDayInGanZhi(): string;
    getDayYi(): string[];
    getDayJi(): string[];
    getDayChongDesc(): string;
    getDaySha(): string;
    getZhiXing(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearInGanZhi(): string;
  }
  export const Solar: {
    fromYmd(y: number, m: number, d: number): Solar;
    fromYmdHms(y: number, m: number, d: number, h: number, mi: number, s: number): Solar;
  };
  export const Lunar: {
    fromYmd(y: number, m: number, d: number): Lunar;
  };
  export const I18n: {
    setLanguage(lang: string): void;
    getLanguage(): string;
  };
}
