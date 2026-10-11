# ไพ่ทาโรต์ (ไพ่ประจำวันเกิด · ประจำปี · ไพ่รายวัน)

> หมวด: สากล · สถานะ: **MVP**
> กลับไปที่ [CLAUDE.md](../../CLAUDE.md)

## ภาพรวม
- **ไพ่ประจำวันเกิด (แบบ Greer)**: Personality + Soul จาก 22 ไพ่ Major Arcana
- **ไพ่ประจำปี**: สูตรเดียวกันแต่ใช้ปีปัจจุบัน
- **ไพ่รายวัน**: สุ่มแบบ deterministic จากวันเกิด + วันนี้ ได้ไพ่เดิมทุกอุปกรณ์โดยไม่ต้องเก็บข้อมูล

สำรับ 78 ใบ = Major 22 (The Fool + 21 ใบมีเลข) + Minor 56 (4 ชุด × 14)

## ข้อมูลนำเข้า
- **วันเกิด**, วันนี้ตาม Asia/Bangkok

## ธรรมเนียมและค่าตั้งต้น
| ประเด็น | ค่าตั้งต้น |
|---|---|
| ผลรวม = 22 | ใช้ **The Fool (0)** แล้วลดต่อเป็น 4 สำหรับ Soul |
| เลขไพ่ | แบบ **RWS**: 8 = Strength, 11 = Justice |
| seed ไพ่รายวัน | `hash(วันเกิด ISO + วันนี้ Asia/Bangkok)` |

## อัลกอริทึม
```js
// ไพ่ประจำวันเกิด / ประจำปี
let s = D + M + YYYY;              // ไพ่ประจำปี: ใช้ปีปัจจุบันแทน YYYY
while (s > 22) s = digitSum(s);
personality = (s === 22) ? 0 : s;  // 0 = The Fool
let t = s; while (t > 9) t = digitSum(t);
soul = t;                          // personality === soul → "single"

// ไพ่รายวัน
const seed = fnv1a32(`${birthISO}|${todayBangkokISO}`);   // หรือ xmur3
const rand = mulberry32(seed);                              // หรือ sfc32
const deck = fisherYates([...Array(78).keys()], rand);
const card = deck[0];
const reversed = rand() < 0.5;     // ไม่บังคับ
```

## ค่าตรวจ (unit test)
| วันเกิด | สูตร | ผล |
|---|---|---|
| 24 ต.ค. 1966 | 24+10+1966 = 2000 → 2 | **High Priestess** / Soul 2 (ตัวอย่างของ Greer) |
| 24 ต.ค. 1966, ปี 2011 | 24+10+2011 = 2045 → 11 | Justice (ตรงกับ "11 Year" ของ Greer) |
| 24 ต.ค. 1966, ปี 2026 | 2060 → 8 | Strength |
| 28 ต.ค. 1994 | 2032 → 7 | Chariot / 7 |
| 29 พ.ย. 1990 | 2030 → 5 | Hierophant |
| ไพ่รายวัน | seed เดิม | ต้องได้ไพ่เดิมทุกครั้ง |

## ภาพและลิขสิทธิ์
- ใช้ภาพ **Pamela Colman Smith 1909/1910** (สาธารณสมบัติใน US และ UK/EU ตั้งแต่ 1 ม.ค. 2022) จาก Wikimedia Commons ตรวจแท็ก PD ทีละไฟล์
- **ห้ามใช้ชื่อ "Rider-Waite"** (เครื่องหมายการค้า U.S. Games) ให้เรียก "ไพ่ทาโรต์ภาพต้นฉบับ Pamela Colman Smith (1909)"
- **ห้ามใช้ฉบับลงสีใหม่ของ U.S. Games ปี 1971**
- ข้อความตีความ: เขียนเองเป็นภาษาไทย หรือดัดแปลงจาก *Pictorial Key* ของ Waite (1911, PD) — หนังสือ Greer ยังมีลิขสิทธิ์

## ยังไม่ยืนยัน
- [ ] ลิขสิทธิ์ภาพ RWS ในไทย (ตลอดชีวิต + 50) ต้องปรึกษาทนาย
- [ ] กฎ 22 และ 9 constellations ต้นฉบับของ Greer (อยู่ในหนังสือ)

## แนวทาง GUI
- การ์ดพลิก 3D (reduced-motion → crossfade)
- คนไทยเรียก "ไพ่ยิปซี" ใช้คำนี้ในข้อความประกอบได้เพื่อ SEO

## ประวัติย่อ
เริ่มจากไพ่ trionfi ของอิตาลีราวปี 1440 ชุด Visconti-Sforza ปิดทองเป็นชุดเก่าที่สุดที่เหลืออยู่ เริ่มใช้ทำนายในปารีสช่วงทศวรรษ 1780 (Court de Gébelin, Etteilla) ชุด RWS ปี 1909 เป็นชุดแรกที่ไพ่ Minor มีภาพเล่าเรื่องครบทุกใบ Waite สลับ Strength (8) กับ Justice (11)

## แหล่งอ้างอิง
- [marykgreer.com](https://marykgreer.com/2011/08/17/who-are-you-in-the-tarot/) · [devcomma](https://tools.devcomma.com/en/calculators/arcana)
- [Wikipedia: Tarot](https://en.wikipedia.org/wiki/Tarot) · [Wikipedia: RWS](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot) · [The Wild Hunt](https://wildhunt.org/2021/01/rider-waite-smith-tarot-deck-may-enter-public-domain.html)
- [th.wikipedia: ไพ่ทาโรต์](https://th.wikipedia.org/wiki/%E0%B9%84%E0%B8%9E%E0%B9%88%E0%B8%97%E0%B8%B2%E0%B9%82%E0%B8%A3%E0%B8%95%E0%B9%8C)
- โน้ตดิบ: `western_universal_systems.md` (ข้อ 4)
