# ราศีสากล (Tropical) · Moon sign · Ascendant

> หมวด: สากล · สถานะ: Sun sign = **MVP**, Moon sign/ASC = **ปลดล็อกเมื่อกรอกเวลา + จังหวัด**
> กลับไปที่ [CLAUDE.md](../../CLAUDE.md) · เกี่ยวข้อง: [ราศีไทย (Sidereal)](thai-rasi-lagna.md)

## ภาพรวม
ราศีสากลวัดจากจุดวสันตวิษุวัต (tropical) ต่างจากราศีไทยที่วัดจากกลุ่มดาวจริง (sidereal) ราว 24° ในปี 2026 คนเดียวกันจึงมักได้ราศีต่างกัน **ต้องแสดงคู่กันและติดป้ายแยกให้ชัด**

## ข้อมูลนำเข้า
| ผลลัพธ์ | วันเกิด | เวลา | จังหวัด |
|---|---|---|---|
| Sun sign | ✔ (วันคาบเกี่ยวต้องใช้ ephemeris) | – | – |
| Moon sign | ✔ (อาจไม่แน่นอน) | ✔ | – |
| Ascendant | – | **บังคับ** | **บังคับ** |

## ธรรมเนียมและค่าตั้งต้น
| ประเด็น | ค่าตั้งต้น |
|---|---|
| Sun sign | ใช้ตารางวันที่ ยกเว้นวันคาบเกี่ยว → คำนวณ λ☉ จาก astronomy-engine |
| Moon ไม่มีเวลา | คำนวณที่เที่ยง ติด flag ถ้าวันนั้นดวงจันทร์ย้ายราศี |
| ASC ไม่มีเวลา/สถานที่ | ซ่อน |

## อัลกอริทึม
```
sign = floor(λ_tropical / 30)        // 0 = Aries
ASC  = atan2(cos RAMC, −(sin RAMC·cos ε + tan φ·sin ε))
```
RAMC = local sidereal time × 15°, ε = ความเอียงของแกนโลก, φ = ละติจูด

### ตารางวันที่ (โดยประมาณ)
| ราศี | ช่วง | ราศี | ช่วง |
|---|---|---|---|
| ♈ เมษ | 21 มี.ค.–20 เม.ย. | ♎ ตุลย์ | 24 ก.ย.–23 ต.ค. |
| ♉ พฤษภ | 21 เม.ย.–21 พ.ค. | ♏ พิจิก | 24 ต.ค.–22 พ.ย. |
| ♊ เมถุน | 22 พ.ค.–21 มิ.ย. | ♐ ธนู | 23 พ.ย.–21 ธ.ค. |
| ♋ กรกฎ | 22 มิ.ย.–23 ก.ค. | ♑ มังกร | 22 ธ.ค.–20 ม.ค. |
| ♌ สิงห์ | 24 ก.ค.–23 ส.ค. | ♒ กุมภ์ | 21 ม.ค.–19 ก.พ. |
| ♍ กันย์ | 24 ส.ค.–23 ก.ย. | ♓ มีน | 20 ก.พ.–20 มี.ค. |

## ไลบรารีและไลเซนส์
- `astronomy-engine` (MIT) — ลองจิจูดดวงอาทิตย์/จันทร์/ดาวเคราะห์ ใช้ในเบราว์เซอร์ได้
- `circular-natal-horoscope-js` (Unlicense, Moshier) — 7 ระบบภพ, ASC/MC, aspects
- ⚠️ **Swiss Ephemeris / `sweph` ≥ 2.10.1 / WASM ports = AGPL-3.0** ห้ามเพิ่มโดยไม่ได้รับอนุมัติ (ดู CLAUDE.md §4)

## ค่าตรวจ (unit test)
- ตรวจขอบ: λ☉ = 0° ในวันวสันตวิษุวัตของแต่ละปี (19–21 มี.ค.)
- Moon: ทดสอบวันที่ดวงจันทร์ย้ายราศี → ต้องได้ flag

## ยังไม่ยืนยัน
- [ ] ayanamsa ที่ circular-natal-horoscope-js ใช้ (ถ้าจะใช้โหมด sidereal)
- [ ] ราคา Pro License ของ Swiss Ephemeris (ถ้าจะใช้)

## แนวทาง GUI
- วงล้อ 12 ราศีระบายสีตามธาตุ + วงนอก 27 ฤกษ์ glyph ♈–♓ ☉☽☿♀♂♃♄
- แผนที่ดาวขณะเกิดด้วย d3-celestial (BSD-3)
- พื้นหลัง: Cellarius *Harmonia Macrocosmica* (ตรวจสถานะทีละระเบียน), ESA Gaia (CC BY-SA 3.0 IGO เครดิต "ESA/Gaia/DPAC")
- Daily transit (อนาคต): คำนวณลองจิจูดดาววันละครั้ง เทียบ aspect กับ Sun/Moon ของผู้ใช้ฝั่ง client

## ประวัติย่อ
การแบ่งสุริยวิถีเป็น 12 ส่วนเท่ากันมาจาก MUL.APIN ของบาบิโลน กรีก-อียิปต์เพิ่มดวงชะตาส่วนบุคคล ลัคนา และ 12 ภพ *Tetrabiblos* ของปโตเลมี (ศตวรรษที่ 2) เป็นตำราอ้างอิงราว 17 ศตวรรษ

## แหล่งอ้างอิง
- [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign) · [Wikipedia: Ayanamsa](https://en.wikipedia.org/wiki/Ayanamsa)
- [astro.com swephinfo](https://www.astro.com/swisseph/swephinfo_e.htm) · [sweph](https://github.com/timotejroiko/sweph)
- [CircularNatalHoroscopeJS](https://github.com/0xStarcat/CircularNatalHoroscopeJS)
- โน้ตดิบ: `western_universal_systems.md` (ข้อ 1)
