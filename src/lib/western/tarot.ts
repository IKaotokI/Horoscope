// ไพ่ทาโรต์ประจำวันเกิด (Greer), ไพ่ประจำปี, ไพ่รายวัน (CLAUDE.md §3.3)
// เลขไพ่แบบ RWS (8 = Strength, 11 = Justice) — ห้ามใช้ชื่อ "Rider-Waite" (เครื่องหมายการค้า)
import { type CivilDate, type Convention, isoDate } from '../core';

export const MAJOR_ARCANA: { en: string; th: string; keywords: string }[] = [
  { en: 'The Fool', th: 'คนเดินทาง', keywords: 'การเริ่มต้น ความไร้เดียงสา กล้าเสี่ยง' },
  { en: 'The Magician', th: 'นักมายากล', keywords: 'ความสามารถ ลงมือทำ ทรัพยากรพร้อม' },
  { en: 'The High Priestess', th: 'นักบวชหญิง', keywords: 'ญาณหยั่งรู้ ความลับ โลกภายใน' },
  { en: 'The Empress', th: 'จักรพรรดินี', keywords: 'ความอุดมสมบูรณ์ ความงาม การดูแล' },
  { en: 'The Emperor', th: 'จักรพรรดิ', keywords: 'โครงสร้าง ความมั่นคง ภาวะผู้นำ' },
  { en: 'The Hierophant', th: 'พระสังฆราช', keywords: 'ประเพณี ครูบาอาจารย์ ความเชื่อ' },
  { en: 'The Lovers', th: 'คนรัก', keywords: 'ความรัก การเลือก ความสอดคล้อง' },
  { en: 'The Chariot', th: 'รถศึก', keywords: 'ความมุ่งมั่น ชัยชนะ ควบคุมทิศทาง' },
  { en: 'Strength', th: 'พลัง', keywords: 'ความกล้าหาญอย่างอ่อนโยน ความอดทน' },
  { en: 'The Hermit', th: 'ฤๅษี', keywords: 'การใคร่ครวญ ปัญญา การอยู่กับตัวเอง' },
  { en: 'Wheel of Fortune', th: 'กงล้อแห่งโชคชะตา', keywords: 'วัฏจักร จังหวะชีวิต โอกาส' },
  { en: 'Justice', th: 'ความยุติธรรม', keywords: 'ความสมดุล เหตุและผล ความจริง' },
  { en: 'The Hanged Man', th: 'คนแขวน', keywords: 'มุมมองใหม่ การรอคอย การยอมปล่อย' },
  { en: 'Death', th: 'ความเปลี่ยนแปลง', keywords: 'การจบเพื่อเริ่มใหม่ การเปลี่ยนผ่าน' },
  { en: 'Temperance', th: 'ความพอดี', keywords: 'ความสมดุล การผสมผสาน ความอดทน' },
  { en: 'The Devil', th: 'ปีศาจ', keywords: 'พันธนาการ ความอยาก สิ่งที่ยึดติด' },
  { en: 'The Tower', th: 'หอคอย', keywords: 'การเปลี่ยนแปลงฉับพลัน การตื่นรู้' },
  { en: 'The Star', th: 'ดวงดาว', keywords: 'ความหวัง การเยียวยา แรงบันดาลใจ' },
  { en: 'The Moon', th: 'ดวงจันทร์', keywords: 'ความฝัน ความไม่แน่นอน จิตใต้สำนึก' },
  { en: 'The Sun', th: 'ดวงอาทิตย์', keywords: 'ความสุข ความสำเร็จ ความสดใส' },
  { en: 'Judgement', th: 'การพิพากษา', keywords: 'การตื่นรู้ การเรียกให้ก้าวต่อ' },
  { en: 'The World', th: 'โลก', keywords: 'ความสมบูรณ์ การบรรลุเป้าหมาย' },
];

const SUITS = [
  { en: 'Wands', th: 'ไม้เท้า', keywords: 'ไฟ พลัง ความกระตือรือร้น' },
  { en: 'Cups', th: 'ถ้วย', keywords: 'น้ำ ความรู้สึก ความสัมพันธ์' },
  { en: 'Swords', th: 'ดาบ', keywords: 'ลม ความคิด การตัดสินใจ' },
  { en: 'Pentacles', th: 'เหรียญ', keywords: 'ดิน เงินทอง การงาน' },
];
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
const RANKS_TH = ['เอซ', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'เพจ', 'อัศวิน', 'ราชินี', 'ราชา'];

export interface TarotCard {
  index: number; // 0..77
  en: string;
  th: string;
  keywords: string;
  major: boolean;
  numeral: string;
}

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

export function card(index: number): TarotCard {
  if (index < 22) {
    const c = MAJOR_ARCANA[index];
    return { index, ...c, major: true, numeral: ROMAN[index] };
  }
  const i = index - 22;
  const suit = SUITS[Math.floor(i / 14)];
  const r = i % 14;
  return {
    index,
    en: `${RANKS[r]} of ${suit.en}`,
    th: `${RANKS_TH[r]} ${suit.th}`,
    keywords: suit.keywords,
    major: false,
    numeral: r < 10 ? String(r + 1) : RANKS[r][0],
  };
}

const digitSum = (n: number) => String(n).split('').reduce((s, c) => s + +c, 0);

export interface BirthCards {
  personality: TarotCard;
  soul: TarotCard;
  convention: Convention;
}

/**
 * s = D + M + YYYY ลดหลักจนเหลือ ≤ 22 = Personality, ลดต่อจนเหลือหลักเดียว = Soul
 * ได้ 22 ใช้ The Fool — ตรวจ: 24 ต.ค. 1966 → 2000 → High Priestess
 */
export function greerCards(d: number, m: number, y: number): BirthCards {
  let s = d + m + y;
  while (s > 22) s = digitSum(s);
  let soul = s;
  while (soul > 9) soul = digitSum(soul);
  const toCard = (n: number) => card(n === 22 ? 0 : n);
  return {
    personality: toCard(s),
    soul: toCard(soul),
    convention: { label: 'วิธีของ Mary K. Greer: วัน + เดือน + ปี ลดหลักจน ≤ 22 (22 = The Fool) · เลขไพ่แบบ RWS 1909' },
  };
}

export const birthCards = (date: CivilDate) => greerCards(date.d, date.m, date.y);

/** ไพ่ประจำปี: ใช้ปีปัจจุบันแทนปีเกิด */
export const yearCard = (date: CivilDate, currentYear: number) => greerCards(date.d, date.m, currentYear).personality;

/** xmur3 string hash → seed */
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mulberry32(a: number): () => number {
  let s = a >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * ไพ่รายวัน: seed = hash(วันเกิด ISO + วันนี้ Asia/Bangkok) แล้วสับ 0..77 ด้วย Fisher–Yates
 * ได้ไพ่เดียวกันทุกอุปกรณ์โดยไม่ต้องเก็บข้อมูล
 */
export function dailyCards(birth: CivilDate, today: CivilDate, n = 1): TarotCard[] {
  const rand = mulberry32(xmur3(`${isoDate(birth)}|${isoDate(today)}`)());
  const deck = Array.from({ length: 78 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map(card);
}
