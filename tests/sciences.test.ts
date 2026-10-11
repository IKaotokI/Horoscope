import { describe, expect, it } from 'vitest';
import { type InputField, SCIENCES, scienceLabel, scienceLevel } from '../src/lib/sciences';

const level = (id: string, fields: InputField[]) => scienceLevel(SCIENCES.find((s) => s.id === id)!, new Set(fields));

describe('ความสว่างของดาวแต่ละศาสตร์', () => {
  it('ไม่มีวันเกิด = ดาวทุกดวงยังไม่สว่าง', () => {
    expect(SCIENCES.every((s) => scienceLevel(s, new Set()) === 0)).toBe(true);
  });
  it('มีแค่วันเกิด: ศาสตร์ที่ใช้วันเกิดอย่างเดียวสว่างเต็ม ที่เหลือได้บางส่วน', () => {
    expect(level('taksa', ['date'])).toBe(2);
    expect(level('tarot', ['date'])).toBe(2);
    expect(level('bazi', ['date'])).toBe(1);
    expect(level('lagna', ['date'])).toBe(1);
    expect(level('kua', ['date'])).toBe(1);
  });
  it('ลัคนาต้องมีทั้งเวลาและจังหวัด', () => {
    expect(level('lagna', ['date', 'time'])).toBe(1);
    expect(level('lagna', ['date', 'time', 'place'])).toBe(2);
    expect(level('zodiac', ['date', 'time', 'place'])).toBe(2);
  });
  it('ปาจื้อ 4 เสาต้องมีเวลา, Kua/大運 ต้องมีเพศ', () => {
    expect(level('bazi', ['date', 'time'])).toBe(2);
    expect(level('kua', ['date', 'sex'])).toBe(2);
    expect(level('kua', ['date', 'time', 'place'])).toBe(1);
  });
  it('กรอกครบทุกช่อง = สว่างเต็มทุกดวง', () => {
    const all = new Set<InputField>(['date', 'time', 'place', 'sex']);
    expect(SCIENCES.every((s) => scienceLevel(s, all) === 2)).toBe(true);
  });
  it('ป้ายชื่อเป็น "ชื่อภาษาไทย(ชื่อภาษาเจ้าของ)"', () => {
    const by = (id: string) => scienceLabel(SCIENCES.find((s) => s.id === id)!);
    expect(by('bazi')).toBe('ปาจื้อ(八字)');
    expect(by('tarot')).toBe('ไพ่ทาโรต์(Tarot)');
    expect(by('taksa')).toBe('ทักษา · สีมงคล');
  });
});
