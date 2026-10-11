# Tzolk'in (ปฏิทินมายา 260 วัน)

> หมวด: สากล · สถานะ: **ส่วนเสริม (ไม่อยู่ใน MVP หลัก)** — คนไทยรู้จักน้อย
> กลับไปที่ [CLAUDE.md](../../CLAUDE.md)

## ภาพรวม
เลข 13 ตัว × ชื่อวัน 20 ชื่อ = รอบ 260 วัน คำนวณได้แน่นอนจาก JDN ด้วยค่า correlation GMT (584283)

## ข้อมูลนำเข้า
- **วันเกิด**

## ธรรมเนียมและค่าตั้งต้น
| ประเด็น | ค่าตั้งต้น |
|---|---|
| Correlation | **GMT 584283** (day 0 = 4 Ajaw) |
| การนับ | นับแบบมายาดั้งเดิม **ไม่ใช่ Dreamspell** (Argüelles 1987 ซึ่งข้าม 29 ก.พ.) — ติดป้ายให้ชัด |

## อัลกอริทึม
```js
d    = JDN - 584283;
num  = ((d + 3) % 13) + 1;     // 1..13
name = (d + 19) % 20;          // 0 = Imix … 19 = Ajaw
```
JDN (Gregorian): `a=⌊(14−M)/12⌋, y=Y+4800−a, m=M+12a−3, JDN=D+⌊(153m+2)/5⌋+365y+⌊y/4⌋−⌊y/100⌋+⌊y/400⌋−32045`

ชื่อวัน: Imix, Ik', Ak'b'al, K'an, Chikchan, Kimi, Manik', Lamat, Muluk, Ok, Chuwen, Eb', B'en, Ix, Men, Kib', Kab'an, Etz'nab', Kawak, Ajaw

## ค่าตรวจ (unit test)
- **11 ต.ค. 2026** → JDN 2461325, d = 1877042 → **2 Ik'** (ตรงกับ Wikipedia, Long Count 13.0.14.0.2)

## ยังไม่ยืนยัน
- [ ] Dreamspell และ Celtic tree calendar (Graves 1948 เป็นของสมัยใหม่) — ยังไม่ทำ

## แนวทาง GUI
- glyph วันมายาลายเส้นสาธารณสมบัติจาก Wikimedia (ตรวจแท็กทีละไฟล์)

## แหล่งอ้างอิง
- [Wikipedia: Tzolk'in](https://en.wikipedia.org/wiki/Tzolk%CA%BCin)
- โน้ตดิบ: `western_universal_systems.md` (ข้อ 6)
