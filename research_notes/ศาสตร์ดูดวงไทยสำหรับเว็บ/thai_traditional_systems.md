# Thai Traditional Fortune-Telling Systems Computable from Birth Date/Time (algorithms + history)

> Research scope note: about 15 web tool calls. Several key Thai sites (silpa-mag, myhora, th.wikipedia direct URL) returned 403/404 to the fetcher, and a ThaiJO PDF came back as binary only. Items marked **[unverified – general knowledge]** come from widely repeated Thai folk/astrological convention and were NOT confirmed by a fetched source in this session. The report writer should treat them as candidates to verify, not as cited facts. Planet numbering used throughout (Thai convention): อาทิตย์1 จันทร์2 อังคาร3 พุธ4 พฤหัสบดี5 ศุกร์6 เสาร์7 ราหู8 เกตุ9 มฤตยู0.

## Q1. โหราศาสตร์ไทย (Thai sidereal astrology): ลัคนา, สุริยยาตร์ vs ลาหิรี, ราศี, what is computable without birth time

### Takeaway
Thai astrology has two competing calculation schools. One is the traditional **คัมภีร์สุริยยาตร์** (Suriyayatra), used since Sukhothai and by the กรมโหรหลวง. The other is the Indian **Lahiri (นิรายนะ)** ayanamsa, which matches the real sky (e.g., Swiss Ephemeris with SE_SIDM_LAHIRI). The two can disagree by about ±1 sign on the ลัคนา and by up to 4–15° for Mercury and Venus, so a website must pick one and label it. ลัคนา needs birth time and place. Without a birth time you can still compute the sun sign (ราศีเกิด by the Thai sidereal sun) and the planets' signs, except a fast-moving Moon near a sign boundary.

### Cited Findings
- The use of คัมภีร์สุริยยาตร์ is attested from the Sukhothai period and continues among Thai schools. The กรมโหรหลวง used Suriyayatra together with คัมภีร์มานัตต์ to compute planet positions for the astrological almanac and the Thai lunar calendar. — [Pantip discussion summarised in search](https://pantip.com/topic/37222862); [myhora Lahiri ephemeris page](https://myhora.com/astrology/thai.aspx)
- Lahiri positions follow modern (NASA-grade) astronomy. Suriyayatra follows the text, so its planets do not exactly match the sky. Instead of a true ayanamsa, Suriyayatra uses a cyclic correction described as "0-27 องศาในรอบ 1800 ปี". — [astroneemo.net (อาศรมศรีจักรนารท)](https://www.astroneemo.net/index.php/2016-08-07-05-21-50/2016-09-26-02-29-18/49-2010-01-14-07-49-04/1174-2012-02-25-14-57-44.html)
- Ascendant: Lahiri uses one method (the actual rising sign and degree). Suriyayatra has several **อันโตนาที**-based methods, including variants based on sunrise (สมผุสอาทิตย์อุทัย) and on local time. The page says 7 methods in one place and "มากกว่า 6 วิธี" in another. Suriyayatra gives each sign a rising time of 102–132 minutes in one approach and 96–168 minutes in another. — [astroneemo.net](https://www.astroneemo.net/index.php/2016-08-07-05-21-50/2016-09-26-02-29-18/49-2010-01-14-07-49-04/1174-2012-02-25-14-57-44.html)
- Size of the disagreement: ลัคนา "คลาดเคลื่อนประมาณ +/- 1ราศี", the lagna nakshatra 4–17°, and Mercury/Venus "มากถึง 4-15 องศา", which can change their sign. The page concludes "ไม่มีใครถูกหรือผิด": each astrologer follows their own school. — [astroneemo.net](https://www.astroneemo.net/index.php/2016-08-07-05-21-50/2016-09-26-02-29-18/49-2010-01-14-07-49-04/1174-2012-02-25-14-57-44.html)
- Some Suriyayatra almanacs compute positions at a fixed time of 07:00 or 24:00, so the reference time also affects results. myhora publishes both a Lahiri (นิรายนะ) ephemeris and Suriyayatra-based pages. — [myhora ปฏิทินโหราศาสตร์ไทย นิรายนะวิธี ลาหิรี](https://myhora.com/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99%E0%B9%82%E0%B8%AB%E0%B8%A3%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%97%E0%B8%A2-%E0%B8%99%E0%B8%B4%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%99%E0%B8%B0.aspx)
- A "magazine sun sign" based on Western tropical dates (e.g., เมษ = 21 มี.ค.–20 เม.ย.) is a different thing from the Thai ราศีเกิด/ลัคนา. That page rates its accuracy at only "15 เปอร์เซ็นต์". — [astroneemo.net](https://www.astroneemo.net/index.php/2016-08-07-05-21-50/2016-09-26-02-29-18/49-2010-01-14-07-49-04/1174-2012-02-25-14-57-44.html)
- Thai astrology also underpins traditional medicine: research links planet and zodiac positions in คัมภีร์สุริยยาตร์ to diseases. — [Veridian E-Journal (ThaiJO)](https://he02.tci-thaijo.org/index.php/Veridian-E-Journal/article/download/170497/156529); [NRCT thesis DOI 10.14457/STOU.the.2013.505](https://doi.nrct.go.th/ListDoi/listDetail/10.14457%2FSTOU.the.2013.505)
- Thai court astrologers advised the elite on political decisions. For example, a Thai astrologer cast the horoscope of the Russian Tsarevich (Nicholas, on his 1891 visit to Siam). — [Silpa-Mag: โหรไทยทำนายดวงพระชะตามกุฎราชกุมารรัสเซีย](https://www.silpa-mag.com/?p=10033); [JDAR (ThaiJO)](https://so01.tci-thaijo.org/index.php/JDAR/article/view/279770)
- The Suriyayatra-based Thai calendar was possibly influenced by the Surya Siddhanta, but does not require it for calculation. — [Wikipedia: Thai lunar calendar](https://en.wikipedia.org/wiki/Thai_lunar_calendar)

### Inferences
- Implementation recommendation: compute with Swiss Ephemeris in sidereal mode using Lahiri (`swe_set_sid_mode(SE_SIDM_LAHIRI)`), and label it "นิรายนะ ลาหิรี". Optionally add a Suriyayatra mode later (see the Q5 formulas; open-source code exists in pythaidate). Most modern Thai web tools that run on real ephemerides appear to use Lahiri, while traditional printed almanacs (ปฏิทินโหราศาสตร์) use Suriyayatra. This is inferred from myhora offering both; I found no usage statistics.
- What can be computed without a birth time: the sun's sidereal sign (ราศีเกิดแบบไทย = the sign the sun occupies), the signs of the slow planets, the weekday and its systems (ทักษา, 7 days, เลข 7 ตัว's day row), the นักษัตร year, and the lunar date. ลัคนา, houses (ภพ) and the Moon's exact degree need a time. Province or place gives longitude and latitude for sunrise and the ascendant.
- Thai sidereal sun ingress dates fall around the 13th–17th of each Gregorian month. Songkran (13–14 April) is the sun entering เมษ. The Thai solar month names (เมษายน, พฤษภาคม, …) are named after the sidereal signs (เมษ, พฤษภ, …), but under the 1888/1941 calendar they start on the 1st. **[unverified – general knowledge; compute ingress with the ephemeris rather than hard-coding dates]**
- The 12 ราศี and their glyph symbols for the GUI: เมษ (ram/แกะ), พฤษภ (ox/วัว), เมถุน (couple/คนคู่), กรกฎ (crab/ปู), สิงห์ (lion), กันย์ (maiden/หญิงสาว), ตุลย์ (scales/ตาชั่ง), พิจิก (scorpion/แมงป่อง), ธนู (archer/คนถือธนู), มังกร (makara/มังกร), กุมภ์ (water-pot/หม้อน้ำ), มีน (fish/ปลาคู่). **[unverified – general knowledge]**

### Gaps
- No exact numeric Suriyayatra ayanamsa versus Lahiri (e.g., the degree difference for 2026) was found. The astroneemo source gives only the cyclic description.
- The Thai Wikipedia article on โหราศาสตร์ไทย could not be fetched (404 on the URL tried). Detailed history (e.g., โหรหลวง lineage, Wat Pho zodiac/astrology inscriptions, พลูหลวง [เทพย์ สาริกบุตร?]) is still unconfirmed. Note that "พลูหลวง" is the pen name of ประยูร พลอยพุ่ม (not verified here). อาจารย์เทพย์ สาริกบุตร (1919–1993) is confirmed below as an author on มหาทักษา.
- The exact Suriyayatra อันโตนาที table (minutes per sign) and the step-by-step lagna procedure were not obtained.

## Q2. ทักษาพยากรณ์ / ทักษาปกรณ์: the 8 ภูมิ per birth day, ordering, letter groups, colors

### Takeaway
The algorithm is simple and well attested. Place the 8 planets on a fixed ring in this order: **อาทิตย์ → จันทร์ → อังคาร → พุธ → เสาร์ → พฤหัสบดี → ราหู → ศุกร์**. Start at the birth-day planet (พุธกลางคืน = ราหู). Assign the 8 ภูมิ in the fixed order **บริวาร, อายุ, เดช, ศรี, มูละ, อุตสาหะ, มนตรี, กาลกิณี**. The planet that lands on กาลกิณี is the "bad" planet: its letters are avoided in names and its colour is avoided.

### Cited Findings
- Ring order "อาทิตย์-จันทร์-อังคาร-พุธ-เสาร์-พฤหัสบดี-ราหู-ศุกร์". Counting starts from the birth weekday's planet, which is assigned บริวาร. Worked example for a **Monday** birth: จันทร์=บริวาร, อังคาร=อายุ, พุธ=เดช, เสาร์=ศรี, พฤหัสบดี=มูละ, ราหู=อุตสาหะ, ศุกร์=มนตรี, อาทิตย์=กาลกิณี. The article describes กาลกิณี as "ศัตรู อุปสรรค ความทุกข์ยาก รายจ่าย". The system was adapted by "โหราจารย์แต่โบราณ" from the มหาทักษา framework. It cites อาจารย์เทพย์ สาริกบุตร (1919–1993), the book *มหาทักษาพยากรณ์* (cremation-volume edition, พ.ศ. 2507). Article by ศรัณย์ ทองปาน, Sarakadee, 9 Apr 2025. — [Sarakadee: มหาทักษา ๒๙](https://www.sarakadee.com/2025/04/09/taksapayakorn/)
- Example for **พุธกลางคืน (ราหู)**: บริวาร=ราหู(8), อายุ=ศุกร์(6), เดช=อาทิตย์(1), ศรี=จันทร์(2), มูละ=อังคาร(3), อุตสาหะ=พุธ(4), มนตรี=เสาร์(7), กาลกิณี=พฤหัสบดี(5). This is consistent with the ring rule. — [thaibabyname.com ภูมิทักษา](https://www.thaibabyname.com/astrology_mahataksa.asp); [myhora การตั้งชื่อ ภูมิทักษา](https://myhora.com/content/?0034=); [sana-anong.com หลักทักษา ตอนที่ ๒](https://www.sana-anong.com/astrology_detail.php?id=1868&catg=1)
- Meanings: บริวาร = subordinates and people around you; อายุ = health, temperament, life; เดช = power, prestige (วาสนา อำนาจบารมี เกียรติยศ); ศรี = charm, gentleness, love, auspiciousness; มูละ = money and property, foundation; อุตสาหะ = diligence and perseverance; มนตรี = patrons and supporters; กาลกิณี = inauspicious. — [gotoknow: เลือกสีกระเป๋าสตางค์ตามวันเกิด](https://www.gotoknow.org/posts/386870); [sana-anong.com](https://www.sana-anong.com/astrology_detail.php?id=1868&catg=1)
- Example of ทักษาจร (transit) usage, in a reading of the Rattanakosin city horoscope: อังคาร=บริวาร, พุธ=อายุ, เสาร์=เดช, พฤหัส=ศรี, ราหู=มูละ, ศุกร์=อุตสาหะ, อาทิตย์=มนตรี, จันทร์=กาลกิณี. This is the same ring started at อังคาร. — [Matichon: โหรฟองสนาน ดวงเมืองรัตนโกสินทร์ 237 ปี](https://www.matichon.co.th/politics/news_1459820)
- ทักษาปกรณ์ is the most popular manual for Thai personal naming. It explains, for example, why Monday-born names avoid vowels (vowels belong to อาทิตย์, which is กาลกิณี for Monday). — [Silpa-Mag: ทักษาปกรณ์ ตำรายอดนิยมตั้งชื่อคนไทย](https://www.silpa-mag.com/?p=150762) (title and search snippet only; page 403); [ThaiJO: ตำราทักษากับการตั้งชื่อของคนไทย (อำนาจ ปักษาสุข)](https://so06.tci-thaijo.org/index.php/VANNAVIDAS/article/download/48400/40209/) (PDF not machine-readable here)
- Directions on the ทักษา ring: พระอาทิตย์ sits in the north-east and พระอังคาร in the south-east. — [Thairath: เทวดานพเคราะห์ประจำวันเกิด](https://www.thairath.co.th/horoscope/belief/2581801); [gotoknow 567226](https://www.gotoknow.org/posts/567226)

### Full lookup table (derived from the cited ring rule)
| เกิดวัน (ดาว) | บริวาร | อายุ | เดช | ศรี | มูละ | อุตสาหะ | มนตรี | กาลกิณี |
|---|---|---|---|---|---|---|---|---|
| อาทิตย์ (1) | อาทิตย์ | จันทร์ | อังคาร | พุธ | เสาร์ | พฤหัส | ราหู | ศุกร์ |
| จันทร์ (2) | จันทร์ | อังคาร | พุธ | เสาร์ | พฤหัส | ราหู | ศุกร์ | อาทิตย์ |
| อังคาร (3) | อังคาร | พุธ | เสาร์ | พฤหัส | ราหู | ศุกร์ | อาทิตย์ | จันทร์ |
| พุธกลางวัน (4) | พุธ | เสาร์ | พฤหัส | ราหู | ศุกร์ | อาทิตย์ | จันทร์ | อังคาร |
| พฤหัสบดี (5) | พฤหัส | ราหู | ศุกร์ | อาทิตย์ | จันทร์ | อังคาร | พุธ | เสาร์ |
| ศุกร์ (6) | ศุกร์ | อาทิตย์ | จันทร์ | อังคาร | พุธ | เสาร์ | พฤหัส | ราหู |
| เสาร์ (7) | เสาร์ | พฤหัส | ราหู | ศุกร์ | อาทิตย์ | จันทร์ | อังคาร | พุธ |
| พุธกลางคืน/ราหู (8) | ราหู | ศุกร์ | อาทิตย์ | จันทร์ | อังคาร | พุธ | เสาร์ | พฤหัส |

Code: `RING=[1,2,3,4,7,5,8,6]; i=RING.index(birthPlanet); bhumi[k]=RING[(i+k)%8]` for k = 0..7 (บริวาร..กาลกิณี).

### Inferences
- Letter groups per planet **[unverified – general knowledge, but standard in naming books]**: อาทิตย์ = all vowels (สระ); จันทร์ = ก ข ค ฆ ง; อังคาร = จ ฉ ช ซ ฌ ญ; พุธ = ฎ ฏ ฐ ฑ ฒ ณ; เสาร์ = ด ต ถ ท ธ น; พฤหัสบดี = บ ป ผ ฝ พ ฟ ภ ม; ราหู = ย ร ล ว; ศุกร์ = ศ ษ ส ห ฬ ฮ. This mapping is consistent with the Silpa-Mag headline: Monday's กาลกิณี is อาทิตย์, which owns the vowels.
- Ring directions **[unverified except อาทิตย์=NE and อังคาร=SE]**: อาทิตย์ NE, จันทร์ E, อังคาร SE, พุธ S, เสาร์ SW, พฤหัส W, ราหู NW, ศุกร์ N. This gives a natural 8-direction (3×3 grid with the centre empty, or centre=เกตุ) GUI layout, which is how ทักษา appears in ยันต์ and in สมุดข่อย diagrams.
- สีมงคล/สีกาลกิณี by day: many modern sites derive the colour for each ภูมิ from the colour of the planet that occupies it (planet colours: อาทิตย์ red, จันทร์ yellow/cream, อังคาร pink, พุธ green, พฤหัส orange, ศุกร์ light blue, เสาร์ purple/black, ราหู grey/black). The กาลกิณี colour is the colour of the กาลกิณี planet. Example: Sunday-born avoid ศุกร์ blue. **[unverified – sites vary; gotoknow wallet-colour post uses this approach]**

### Gaps
- No primary historical dating for ทักษาปกรณ์ (e.g., which reign compiled it) was found. The ThaiJO article by อำนาจ ปักษาสุข is the best lead but was unreadable as a PDF.

## Q3. เลข 7 ตัว (9 ฐาน)

### Takeaway
The core three rows are well attested. Day row: the weekday number. Month row: the **lunar** month, with เดือนอ้าย ≈ Dec = 1. Year row: the นักษัตร number, with ชวด = 1. Each row starts at its base number (values over 7 reduced by 7) and counts upward around 1..7 across 7 columns. The column sums form the "ฐานรวม". The names of the 7 positions in each row are known. The extra derived rows (ฐาน 5–9) were not found in a reachable source.

### Cited Findings
- Day number: Sunday = 1 … Saturday = 7. — [seehorasat.blogspot: หลักการพยากรณ์แบบเลข 7 ตัว](http://seehorasat.blogspot.com/2009/06/7.html)
- Month: the lunar month is used, with "ธันวาคม" as month 1 (เดือนอ้าย) and "มกราคม" as month 2 (เดือนยี่). Months 8–12 are reduced by 7 (8→1, 9→2, 10→3, 11→4, 12→5). — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html)
- Year: ปีชวด = 1 … ปีกุน = 12, reduced by 7, so ชวด/มะแม=1, ฉลู/วอก=2, ขาล/ระกา=3, เถาะ/จอ=4, มะโรง/กุน=5, มะเส็ง=6, มะเมีย=7. — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html)
- Rotation: start at the base number and count up, wrapping 7→1. A Monday day row is 2 3 4 5 6 7 1. — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html)
- Column (position) names. Day row: **อัตตะ หินะ ธนัง ปิตา มาตา โภคา มัชฌิมา**. Month row: **ตนุ กดุมภะ สหัชชะ พันธุ ปุตตะ อริ ปัตนิ**. Year row: **มรณะ สุภะ กัมมะ ลาภะ พยายะ ทาสา ทาสี**. (The blog's spellings include กฎุมภะ, สุหัชชะ, หริ, and the order "ทาสี ทาสา".) — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html); [bloggang abhinop](https://www.bloggang.com/m/viewdiary.php?id=abhinop&month=09-2011&date=01&group=6&gblog=22)
- Worked example (Sunday, เดือนยี่, ปีขาล): day 1 2 3 4 5 6 7; month 2 3 4 5 6 7 1; year 3 4 5 6 7 1 2; column sums 6 9 12 15 18 14 10. — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html)
- Errors in the source: the blog's Monday/เดือน 5/ชวด example mis-sums column 5 (13 is correct, not 12), and it says "8−7=2". Implementers should not copy that example's numbers. — [seehorasat](http://seehorasat.blogspot.com/2009/06/7.html)
- Meanings: กดุมภะ = finances, circulating income, valuables, credit, knowledge. ปุตตะ = children and responsibility. อริ = enemies and obstacles. ปัตนิ = spouse and family. — [myhora นิยามความหมายตัวพยากรณ์](https://www.myhora.com/astrology/7number/help-explan-key.aspx); [blockdit อ.เจษฎา คำไหล](https://www.blockdit.com/posts/5ff711ec3213f603551a63b0)
- Commercial and online calculators exist (myhora "เลข 7 ตัว 9 ฐาน (VIP)", payakorn.com). A Scribd course is titled "วิชาเลข 7 ตัว 9 ฐาน ภาคพื้นฐาน". — [myhora sample](https://myhora.com/horoscope/seven-number/sample.html); [payakorn](http://www.payakorn.com/seven_result.php); [Scribd](https://www.scribd.com/document/914252368/)

### Inferences
- Algorithm (implementable):
  `d = weekday(1..7, Sun=1)`; `m = lunarMonth(1..12)`, where an 8/8 (อธิกมาส) month counts as 8; `y = zodiacIndex(1..12, ชวด=1)`.
  `base(x) = ((x-1) % 7) + 1`.
  `row(b)[j] = ((b-1+j) % 7) + 1` for j = 0..6.
  `ฐาน1 = row(base(d))`, `ฐาน2 = row(base(m))`, `ฐาน3 = row(base(y))`, `ฐาน4(รวม)[j] = ฐาน1[j]+ฐาน2[j]+ฐาน3[j]`.
  Note that the weekday should be the traditional (sunrise-based) day.
- Because the month row uses the lunar month, a correct implementation needs a Gregorian→Thai lunar converter (Q5). Simplified websites map solar months directly (Dec = 1, Jan = 2, …), which is wrong for about half of each month. **[inference]**
- The year must also follow the same นักษัตร boundary convention as Q5. Most 7-ตัว teachers use the lunar new year (1 ขึ้น 1 ค่ำ เดือน 5) or Songkran, not 1 January. **[unverified]**

### Gaps
- The names and derivation of ฐาน 5–9 (the "9 ฐาน" beyond the day, month, year and sum rows) could not be confirmed; myhora's sample page returned 403. Some schools add rows for age and dasa (เลขอายุ) or a ฐาน พระเคราะห์ row. This needs a primary text, such as the Scribd course or a myhora VIP sample.
- The historical origin of เลข 7 ตัว (when and by whom it was systematised) was not found.

## Q4. 7 วันเกิด: เทวดาประจำวัน, พระประจำวัน, สีประจำวัน, กำลังวัน, day boundary

### Takeaway
The weekday system rests on the 8 นพเคราะห์ deities (7 days plus ราหู for Wednesday night). Each deity was created by พระอิศวร from N animals or beings, and that number N becomes the planet's กำลังวัน and its มหาทักษา years: อาทิตย์6 จันทร์15 อังคาร8 พุธ17 พฤหัส19 ศุกร์21 เสาร์10 ราหู12 (sum 108), with เกตุ9 added later. The 8 Buddha postures (adding พุธกลางคืน) became popular through royal patronage.

### Cited Findings
- พระอาทิตย์ was created by พระอิศวร from **6 ราชสีห์** ground to powder, wrapped in red cloth and sprinkled with amrita. He has a red body, rides a lion, and sits in the north-east. พระอังคาร was made from **8 มหิงสา (water buffalo)**: pink body, rides a buffalo, south-east. The navagraha concept derives from Hindu Surya worship, with 8 attendant deities making 9. — [Thairath: เทวดานพเคราะห์ประจำวันเกิด](https://www.thairath.co.th/horoscope/belief/2581801); [gotoknow 567226](https://www.gotoknow.org/posts/567226)
- **เลขกำลังวัน** is the number of years each deity "เสวยอายุ": อาทิตย์6, จันทร์15 (some texts 18), อังคาร8, พุธกลางวัน17, พุธกลางคืน/ราหู12, พฤหัส19, ศุกร์21, เสาร์10, เกตุ9 (added later). The first 8 sum to 108. — [Dailynews articles](https://www.dailynews.co.th/articles/2012545/); [gotoknow 213342](https://www.gotoknow.org/posts/213342)
- Buddha images for the days: a royal fashion (พระราชนิยม) spread to commoners, and the set later grew from 7 to **8 ปาง** by adding a posture for พุธกลางคืน "เพราะโหราศาสตร์ถือดาวสำคัญ 8 ดวงแต่สัปดาห์มี 7 วัน". The cited reference book is ไขศรี ศรีอรุณ, *พระพุทธรูปปางต่างๆ ในสยามประเทศ*. — [Silpa-Mag: พระประจำเดือนเกิด](https://www.silpa-mag.com/?p=159542); [Shopee blog: seven days buddha postures](https://shopee.co.th/blog/seven-days-buddha-postures)
- During Songkran, temples hold ceremonies bathing the "9 เทพนพเคราะห์" images, which is useful imagery for a GUI. — [Matichon](https://www.matichon.co.th/local/education/news_526335)
- Caution: some lifestyle sites instead map the days to Hindu gods (Sunday=Shiva, Monday=Uma, Tuesday=Skanda, Wednesday=Vishnu, Thursday=Saraswati, Friday=Lakshmi, Saturday=Ganesha). This is a modern devotional mapping, not the astrological นพเคราะห์ system. — [Wongnai: god and goddess seven days](https://www.wongnai.com/articles/god-and-goddess-seven-days)

### Inferences (lookup tables — **[unverified – general knowledge; verify before shipping]**)
| วัน | เทวดา (สร้างจาก) | พาหนะ | สีประจำวัน (common) | ปางพระประจำวัน |
|---|---|---|---|---|
| อาทิตย์ | พระอาทิตย์ (ราชสีห์ 6) | ราชสีห์ | แดง | ปางถวายเนตร |
| จันทร์ | พระจันทร์ (เทพธิดา/นางฟ้า 15) | ม้า | เหลือง/ครีม | ปางห้ามญาติ / ห้ามสมุทร |
| อังคาร | พระอังคาร (มหิงสา 8) | กระบือ | ชมพู | ปางไสยาสน์ |
| พุธกลางวัน | พระพุธ (ช้าง 17) | ช้าง | เขียว | ปางอุ้มบาตร |
| พุธกลางคืน | พระราหู (หัวผีโขมด 12) | ครุฑ/นกฮูก | เทา/ดำ | ปางป่าเลไลยก์ |
| พฤหัสบดี | พระพฤหัสบดี (ฤๅษี 19) | กวาง | ส้ม/แสด | ปางสมาธิ |
| ศุกร์ | พระศุกร์ (โค 21) | โค | ฟ้า/น้ำเงิน | ปางรำพึง |
| เสาร์ | พระเสาร์ (เสือ 10) | เสือ | ม่วง/ดำ | ปางนาคปรก |
| (เกตุ) | พระเกตุ (นาค 9) | นาค | — | — |

- Day boundary: in Thai astrology the day changes at sunrise (conventionally 06:00), not at midnight. A birth at 02:00 on Tuesday (civil date) therefore counts as a **Monday** birth for weekday systems. พุธกลางคืน (ราหู) is Wednesday from 18:00 to 06:00 of Thursday morning. Websites differ: some use the 18:00–24:00 window only, and some use the actual local sunrise and sunset. **[unverified; no fetched source]** Recommendation: default to 06:00/18:00, offer a "use the actual sunrise for the province" option, and show a notice when the time is unknown and the date could be ambiguous (no time means you can't decide between พุธกลางวัน and พุธกลางคืน, so ask or show both).

### Gaps
- No authoritative (e.g., ราชบัณฑิต / กรมศิลปากร) table of the 8 postures and colours was fetched. The table above needs verification.
- The reign in which the พระประจำวัน set was formalised (often attributed to Rama III / รัชกาลที่ 3) was not confirmed.

## Q5. Thai calendar: พ.ศ./ค.ศ., จุลศักราช, นักษัตร boundary, lunar (ข้างขึ้นข้างแรม) conversion

### Takeaway
พ.ศ. = ค.ศ. + 543 (since 1941 the civil year starts on 1 Jan). จุลศักราช (CS) = ค.ศ. − 638 (= พ.ศ. − 1181), with epoch 22 March 638 CE. The Thai lunar year is 354, 355 or 384 days (normal, อธิกวาร or อธิกมาส). The นักษัตร animal popularly changes at Songkran (13 April). Traditionally it changes at the lunar new year (1 ขึ้น 1 ค่ำ เดือน 5), which is a competing convention. Lunar conversion should use a tested library (pythaidate, Dart thai_lunar), not ad-hoc math.

### Cited Findings
- Year lengths: 354 days (normal), 355 (อธิกวาร: extra day added to month 7), 384 (อธิกมาส: month 8 repeated, "8/8"). Months alternate 29-day odd (hollow) and 30-day even (full). ข้างขึ้น always has 15 days. ข้างแรม has 14 in hollow months and 15 in full months. เดือนอ้าย (month 1) usually begins in December and does not mark the new year. — [Wikipedia: Thai lunar calendar](https://en.wikipedia.org/wiki/Thai_lunar_calendar)
- Zodiac: "13 April … marks the start of the traditional Thai New Year (Songkran) and the change to the next animal". Thai Chinese communities may switch at Chinese New Year. 2025 = มะเส็ง and 2026 = มะเมีย. — [Wikipedia: Thai lunar calendar](https://en.wikipedia.org/wiki/Thai_lunar_calendar)
- The solar calendar replaced the lunar one for official use in 1888 (พ.ศ. 2431). There was a 1940 proclamation on New Year's Day (effective 1941). — [Wikipedia: Thai lunar calendar](https://en.wikipedia.org/wiki/Thai_lunar_calendar)
- Chulasakarat epoch "22nd March 638 AD". **horakhun** counts days since the epoch (example: CS 1361/1/24 → horakhun 497378). **avoman** is the excess of lunar over solar days in units of 1/692, rising 11 per day. **uccapon** is the lunar apogee, rising 1 per day to a maximum of 3232. **masaken** is lunar months since the epoch. The cycle has 7 intercalary months per 19 years and 11 intercalary days per 57 years, and a year cannot have both. Licence: MIT. — [pythaidate (GitHub)](https://github.com/hmmbug/pythaidate/); [PyPI](https://pypi.org/project/pythaidate)
- Dart package thai_lunar converts Gregorian ↔ Thai lunar dates, classifies years as normal, athikavar or athikamat, and computes Makha/Visakha/Asalha Bucha. It uses integer arithmetic only, because floating point drifts. — [pub.dev thai_lunar](https://pub.dev/packages/thai_lunar)
- The Royal Institute journal (vol. 41 no. 3) has an article on computing อธิกมาส with dynamic systems. It notes that synodic months and the sidereal year are not whole numbers of days. — [ORST](https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000612.FLP/html/90)
- The Suriyayatra-based lunar calendar is computed by the กรมโหรหลวง tradition. — [Wikipedia](https://en.wikipedia.org/wiki/Thai_lunar_calendar); [Pantip 37222862](https://pantip.com/topic/37222862)

### Inferences
- Suriyayatra core formulas, as commonly quoted from Eade / older Wikipedia versions **[unverified recall; cross-check with the pythaidate source before use]**:
  `horakhun = floor((CS*292207 + 373)/800) + 1`;
  `kammacubala = 800 − ((CS*292207 + 373) mod 800)`;
  `uccabala = (horakhun + 2611) mod 3232`;
  `avoman = (11*horakhun + 650) mod 692`;
  `masaken = floor((horakhun + floor((11*horakhun + 650)/692)) / 30)`;
  `tithi = (horakhun + floor((11*horakhun+650)/692)) mod 30`.
  Here 292207/800 = 365.25875 days, the Suriyayatra year length.
- **Official Thai lunar dates** (those printed in ปฏิทินหลวง) follow the Suriyayatra rules and occasionally differ by a day from astronomical new moons. Use pythaidate or thai_lunar, or a precomputed table checked against the official calendar.
- **นักษัตร convention for the website**: Default to the Songkran boundary (13 April, or precisely the เถลิงศก moment), which matches Wikipedia and popular usage. Offer a toggle for "1 ค่ำ เดือน 5" (traditional astrologers) and for "1 ม.ค." (common mistake on mass sites). Show the user which convention is applied when the birth falls between 1 Jan and mid-April. A notable share of Thai websites uses 1 Jan, but I have no data on that share.
- `zodiacIndex(ชวด=1) = ((CE_year − 4) mod 12) + 1`, applied to the "zodiac year" after the boundary rule. Check: 2026 → ((2022) mod 12)+1 = 7 = มะเมีย ✓. 2025 → 6 = มะเส็ง ✓, consistent with Wikipedia.
- The จุลศักราช year also changes at Songkran/เถลิงศก (not on 1 Jan). Use CS = CE − 638 after Songkran and CE − 639 before it. **[inference from epoch in March 638]**

### Gaps
- The exact rule practitioners use for the นักษัตร boundary (Songkran vs 1 ค่ำ เดือน 5) lacks a survey source. Both are described in Thai sources I couldn't fetch.
- I didn't verify an authoritative written Gregorian→lunar formula in this session. Rely on the libraries.

## Q6. มหาทักษา / ดาวเสวยอายุ (dasa)

### Takeaway
The years each planet "rules" equal its กำลังวัน: อาทิตย์6, จันทร์15, อังคาร8, พุธ17, เสาร์10, พฤหัส19, ราหู12, ศุกร์21 (total 108). The sequence follows the ทักษา ring starting from the birth-day planet.

### Cited Findings
- Years per planet: อาทิตย์6 จันทร์15 อังคาร8 พุธ17 พฤหัส19 ศุกร์21 เสาร์10 ราหู12. Total 108. เกตุ9 was added later and is excluded from 108. Some texts give จันทร์ 18. — [Dailynews](https://www.dailynews.co.th/articles/2012545/); [gotoknow 213342](https://www.gotoknow.org/posts/213342)
- มหาทักษา is the parent framework of ทักษาพยากรณ์. The ring order is อาทิตย์-จันทร์-อังคาร-พุธ-เสาร์-พฤหัสบดี-ราหู-ศุกร์. Key text: เทพย์ สาริกบุตร, *มหาทักษาพยากรณ์* (2507). — [Sarakadee](https://www.sarakadee.com/2025/04/09/taksapayakorn/)

### Inferences
- Algorithm **[inference; widely used convention, not confirmed step-by-step by a fetched source]**:
  `RING=[1,2,3,4,7,5,8,6]`; `YEARS={1:6,2:15,3:8,4:17,7:10,5:19,8:12,6:21}`.
  Start at the birth planet and walk the ring, accumulating years. The planet ruling age `a` (years since birth, as a float) is the first one whose cumulative total exceeds `a mod 108`.
  Each major period can also be subdivided into 8 sub-periods (อันตรทักษา) in the same ring order, starting with the major planet, each lasting `major*minor/108` years.
- Worked example (Sunday-born, age 30): อาทิตย์ 0–6, จันทร์ 6–21, อังคาร 21–29, พุธ 29–46. Age 30 is therefore under **พุธ** (ruling ages 29–46).
- Variants: some schools start at birth with only the remaining fraction of the first period (as in Indian Vimshottari), or use ages counted from 1. The website should state its convention.

### Gaps
- No fetched source gave a step-by-step มหาทักษา age table or the sub-period formula. These need verification against Sarakadee/เทพย์ สาริกบุตร or myhora.
- No sourced history was found for the Indian origin of the 108-year Thai dasa (it resembles, but differs from, the Indian Ashtottari 108-year dasa). This is an inference only.
