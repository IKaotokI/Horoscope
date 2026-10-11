// ศาสตร์แต่ละอันต้องการข้อมูลอะไร — ใช้กำหนดความสว่างของประกายดาวใน galaxy (CLAUDE.md §7)

export type InputField = 'date' | 'time' | 'place' | 'sex';
export type ScienceTab = 'thai' | 'chinese' | 'western';
export type ScienceFamily = 'thai' | 'chinese' | 'western';

export interface Science {
  id: string;
  name: string;
  /** ชื่อสั้นสำหรับจอแคบ */
  short: string;
  family: ScienceFamily;
  tab: ScienceTab;
  /** ข้อมูลที่ต้องครบจึงได้ผลเต็ม → ดาวเปล่งแสงเต็มที่ */
  full: InputField[];
  /** ข้อมูลขั้นต่ำที่เริ่มได้ผลบางส่วน → ดาวเริ่มเรือง (ไม่ระบุ = เท่ากับ full) */
  partial?: InputField[];
}

export const SCIENCES: Science[] = [
  { id: 'taksa', name: 'ทักษา · สีมงคล', short: 'ทักษา', family: 'thai', tab: 'thai', full: ['date'] },
  { id: 'lek7', name: 'เลข 7 ตัว', short: 'เลข 7 ตัว', family: 'thai', tab: 'thai', full: ['date'] },
  { id: 'lagna', name: 'ลัคนา · ดวงชะตา', short: 'ลัคนา', family: 'thai', tab: 'thai', full: ['date', 'time', 'place'], partial: ['date'] },
  { id: 'rerk', name: 'ฤกษ์ 27', short: 'ฤกษ์', family: 'thai', tab: 'thai', full: ['date', 'time'], partial: ['date'] },
  { id: 'naksat', name: 'นักษัตร · ปีชง', short: 'ปีชง', family: 'chinese', tab: 'chinese', full: ['date'] },
  { id: 'bazi', name: 'ปาจื้อ 4 เสา', short: 'ปาจื้อ', family: 'chinese', tab: 'chinese', full: ['date', 'time'], partial: ['date'] },
  { id: 'kua', name: 'Kua · 大運', short: 'Kua', family: 'chinese', tab: 'chinese', full: ['date', 'sex'], partial: ['date'] },
  { id: 'zodiac', name: 'ราศีสากล · ASC', short: 'ราศี', family: 'western', tab: 'western', full: ['date', 'time', 'place'], partial: ['date'] },
  { id: 'numerology', name: 'เลขศาสตร์', short: 'เลขศาสตร์', family: 'western', tab: 'western', full: ['date'] },
  { id: 'tarot', name: 'ไพ่ทาโรต์', short: 'ทาโรต์', family: 'western', tab: 'western', full: ['date'] },
  { id: 'cycles', name: "ไบโอริทึม · Tzolk'in", short: 'ไบโอฯ', family: 'western', tab: 'western', full: ['date'] },
];

/** 0 = ยังไม่มีข้อมูลพอ, 1 = ได้ผลบางส่วน, 2 = ข้อมูลครบตามเงื่อนไข */
export type ScienceLevel = 0 | 1 | 2;

export function scienceLevel(s: Science, have: ReadonlySet<InputField>): ScienceLevel {
  if (s.full.every((f) => have.has(f))) return 2;
  if ((s.partial ?? s.full).every((f) => have.has(f))) return 1;
  return 0;
}

export const FIELD_LABEL: Record<InputField, string> = {
  date: 'วันเกิด',
  time: 'เวลาเกิด',
  place: 'จังหวัดเกิด',
  sex: 'เพศกำเนิด',
};
