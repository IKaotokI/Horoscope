// ศาสตร์แต่ละอันต้องการข้อมูลอะไร — ใช้กำหนดความสว่างของประกายดาวใน galaxy (CLAUDE.md §7)

export type InputField = 'date' | 'time' | 'place' | 'sex';
export type ScienceTab = 'thai' | 'chinese' | 'western';
export type ScienceFamily = 'thai' | 'chinese' | 'western';

export interface Science {
  id: string;
  /** ชื่อภาษาไทย */
  name: string;
  /** ชื่อในภาษาเจ้าของศาสตร์ (ศาสตร์ไทยแท้ที่ไม่มีชื่อภาษาอื่นให้เว้นไว้) */
  native?: string;
  family: ScienceFamily;
  tab: ScienceTab;
  /** ข้อมูลที่ต้องครบจึงได้ผลเต็ม → ดาวเปล่งแสงเต็มที่ */
  full: InputField[];
  /** ข้อมูลขั้นต่ำที่เริ่มได้ผลบางส่วน → ดาวเริ่มเรือง (ไม่ระบุ = เท่ากับ full) */
  partial?: InputField[];
}

export const SCIENCES: Science[] = [
  { id: 'taksa', name: 'ทักษา · สีมงคล', family: 'thai', tab: 'thai', full: ['date'] },
  { id: 'lek7', name: 'เลข 7 ตัว', family: 'thai', tab: 'thai', full: ['date'] },
  { id: 'lagna', name: 'ลัคนา · ดวงชะตา', native: 'लग्न Lagna', family: 'thai', tab: 'thai', full: ['date', 'time', 'place'], partial: ['date'] },
  { id: 'rerk', name: 'ฤกษ์ 27', native: 'नक्षत्र Nakṣatra', family: 'thai', tab: 'thai', full: ['date', 'time'], partial: ['date'] },
  { id: 'naksat', name: 'นักษัตร · ปีชง', native: '生肖 · 沖太歲', family: 'chinese', tab: 'chinese', full: ['date'] },
  { id: 'bazi', name: 'ปาจื้อ', native: '八字', family: 'chinese', tab: 'chinese', full: ['date', 'time'], partial: ['date'] },
  { id: 'kua', name: 'เลขกัว · วัยจร', native: '命卦 · 大運', family: 'chinese', tab: 'chinese', full: ['date', 'sex'], partial: ['date'] },
  { id: 'zodiac', name: 'ราศีสากล · ลัคนาสากล', native: 'Zodiac · Ascendant', family: 'western', tab: 'western', full: ['date', 'time', 'place'], partial: ['date'] },
  { id: 'numerology', name: 'เลขศาสตร์', native: 'Numerology', family: 'western', tab: 'western', full: ['date'] },
  { id: 'tarot', name: 'ไพ่ทาโรต์', native: 'Tarot', family: 'western', tab: 'western', full: ['date'] },
  { id: 'cycles', name: 'ไบโอริทึม · ซอลกิน', native: 'Biorhythm · Tzolkʼin', family: 'western', tab: 'western', full: ['date'] },
];

/** 0 = ยังไม่มีข้อมูลพอ, 1 = ได้ผลบางส่วน, 2 = ข้อมูลครบตามเงื่อนไข */
export type ScienceLevel = 0 | 1 | 2;

export function scienceLevel(s: Science, have: ReadonlySet<InputField>): ScienceLevel {
  if (s.full.every((f) => have.has(f))) return 2;
  if ((s.partial ?? s.full).every((f) => have.has(f))) return 1;
  return 0;
}

/** ป้ายชื่อที่แสดงเมื่อชี้ที่ดาว: "ชื่อภาษาไทย(ชื่อภาษาเจ้าของ)" */
export const scienceLabel = (s: Science): string => (s.native ? `${s.name}(${s.native})` : s.name);

export const FIELD_LABEL: Record<InputField, string> = {
  date: 'วันเกิด',
  time: 'เวลาเกิด',
  place: 'จังหวัดเกิด',
  sex: 'เพศกำเนิด',
};
