# Chinese fortune-telling systems used in Thailand, computable from birth date and time (formulas, conventions, history)

> Scope: 12 นักษัตร / 干支, ปีชง, ปาจื้อ (BaZi), Kua / 八宅, lunar calendar libraries, and a short look at Zi Wei and daily almanac data. Input: birth date, optional time, optional gender. No names or phone numbers.
> Research date: 2026-10-11. Items marked **[std]** are standard tables I took from general reference knowledge or worked out by hand in this session; no fetched page confirmed them. Check every **[std]** item against `lunar-javascript` output in unit tests before shipping.

---

## Q1. Chinese zodiac (12 นักษัตร): year boundary, 60-year cycle, element, ปีชง and harmony tables, Thai vs Chinese conventions

### Takeaway
Thai media and ซินแส working in the Chinese system change the zodiac year at **ลิบชุน (立春, about 4 Feb)**, not at ตรุษจีน. The traditional Thai นักษัตร changes at **ขึ้น 1 ค่ำ เดือน 5 / สงกรานต์**, which is a separate system. The site must label which convention it uses and handle births between 1 Jan and Lichun.

### Cited Findings
- Thairath on 2566 (2023): ตรุษจีนตรงกับ 22 ม.ค. 2566 (เข้าปีเถาะ), "ถ้านับตามหลักของดวงจีน (ลิบชุน) ... ตั้งแต่วันเสาร์ที่ 4 กุมภาพันธ์ 2566". So Thai horoscope media treat Lichun as the zodiac change for fortune-telling — [Thairath](https://www.thairath.co.th/horoscope/interesting/2570416)
- KBank SME article: "วันที่ 4 กุมภาพันธ์ 2565 คือ วันสารทลิบชุน ... ถือเป็นวันเปลี่ยนเข้าปีนักษัตรใหม่ของโหราศาสตร์จีน" — [Kasikornbank](https://www.kasikornbank.com/th/business/sme/ksmeknowledge/article/smetips/Pages/2022-horoscope.aspx)
- 2026: Lichun fell on 4 Feb 2026, about 13 days before Chinese New Year — [SAYS](https://says.com/my/Lifestyle/what-most-auspicious-time-each-zodiac-deposit-money-li-chun-2026-horse-year). Thai press gives ตรุษจีน 2569 as 17 ก.พ. 2569 — [Thansettakij](https://www.thansettakij.com/general-news/651345)
- English Wikipedia: astrologers disagree on whether the zodiac year starts at Chinese New Year or at Lichun. Some astrological sources start the sexagenary cycle at Lichun, around 4 Feb — [Wikipedia: Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac)
- Thai Wikipedia also records two schools in ดวงจีน, one starting the year at "ปีใหม่จีน" and one at "วันเริ่มต้นใบไม้ผลิ" — [th.wikipedia ปีนักษัตร](https://th.wikipedia.org/wiki/ปีนักษัตร)
- Thai names: ชวด (หนู), ฉลู (วัว), ขาล (เสือ), เถาะ (กระต่าย), มะโรง (มังกร, called "งูใหญ่", also นาค/เหรา), มะเส็ง (งู, "งูเล็ก"), มะเมีย, มะแม, วอก, ระกา, จอ, กุน (หมู). The Thai Wikipedia table includes a Khmer column. The Tai Lue list has ช้าง in place of กุน — [th.wikipedia ปีนักษัตร](https://th.wikipedia.org/wiki/ปีนักษัตร)
- Regional variants: Thailand uses a **naga** for the dragon and may begin the cycle at **Songkran or the 5th lunar month**. Vietnam uses the water buffalo for the ox and the cat for the rabbit — [Wikipedia: Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac)
- Traditional Thai change of นักษัตร: under จุลศักราช custom, "วันขึ้น 1 ค่ำ เดือน 5 ของทุกปีเป็นวันขึ้นต้นปีนักษัตรใหม่". Popular custom took สงกรานต์ as new year. The official new year became 1 January from 24 Dec 2483 (1940, under Phibun) — [Silpa-mag](https://www.silpa-mag.com/?p=31026), [Silpa-mag: สงกรานต์ไม่ใช่วันเปลี่ยนนักษัตร](https://www.silpa-mag.com/?p=129882), [Khaosod](https://www.khaosod.co.th/lifestyle/news_1872448)
- A blog example: in 2566 the นักษัตร changed on ขึ้น 1 ค่ำ เดือน 5 (22 Mar 2566), but จุลศักราช changed on 16 Apr. The นักษัตร and the ศก/จ.ศ. can therefore change on different days. This is a blog source, so verify it — [Blockdit](https://www.blockdit.com/posts/6419dad4a5a51b4ea74a24b5)
- **60-year cycle formula (AD years):** stem = (Y − 3) mod 10 (0 → 癸), branch = (Y − 3) mod 12 (0 → 亥). Examples: 1984 = 甲子, 2013 = 癸巳. Wikipedia applies this from Chinese New Year; for BaZi, use the Lichun year — [Wikipedia: Sexagenary cycle](https://en.wikipedia.org/wiki/Sexagenary_cycle)
- Each year's element comes from its Heavenly Stem (for example, 1924 is Wood and 1926 is Fire). Compatibility groups are 三合 trines (best), 六合 (compatible), 六冲 (worst) and 六害, with 相刑 punishments also listed — [Wikipedia: Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac)
- Thai media follow the same pattern for **ปีชง 2569 (ม้าไฟ, 丙午)**: ชงตรง/ชงเต็ม 100% = **ปีชวด**, and ชงร่วม = **ปีมะเมีย, ปีเถาะ, ปีระกา**. Many outlets add a list of birth พ.ศ. years per animal, for example ชวด = 2467, 2479, 2491, 2503, 2515, 2527, 2539, 2551, 2563 — [Thansettakij](https://www.thansettakij.com/general-news/651345), [Shopee blog](https://shopee.co.th/blog/how-to-solve-bad-luck-12-zodiac/amp/), [Krungsri](https://www.krungsri.com/th/plearn-plearn/lifestyle/living/jinx-year-2026), [Matichon](https://www.matichon.co.th/lifestyle/news_5593846), [LG TH](https://www.lg.com/th/blog-list/fix-unlucky-year/)
- Sources differ on labels. Thansettakij calls ปีมะเมีย "ชงตัวเอง" (second worst), while others call it ชงร่วม — [Thansettakij](https://www.thansettakij.com/general-news/651345). Thairath (citing "โหรรัตนโกสินทร์") instead ranks all 12 animals 1–12, with ฉลู as "ปีทอง", มะเมีย as ชงร่วม (#11) and ชวด "ชงหนักที่สุด" (#12). It gives no percentages — [Thairath](https://www.thairath.co.th/horoscope/belief/2896751)
- Remedies Thai media publish: ไหว้ไท้ส่วยเอี๊ย at Chinese temples such as วัดมังกรกมลาวาส, ไถ่ชีวิตสัตว์, บริจาคโลหิต, usually after ตรุษจีน. Thairath names the 2569 ไท้ส่วยเอี๊ย as "บุ่งเตียกไต่เจียงกุง", no. 43 of the 60 — [Thairath ไท้ส่วยเอี๊ย 2569](https://www.thairath.co.th/horoscope/belief/2908560), [Thansettakij](https://www.thansettakij.com/general-news/651345)
- ปีม้าไฟ (มะเมีย + ธาตุไฟ) recurs only once every 60 years. Some outlets advise avoiding red — [Thairath via search summary](https://www.thairath.co.th/lifestyle/life/2899290)
- Great Race legend: the Jade Emperor held a race. The Rat rode on the Ox and jumped off to finish first. The Cat was pushed into the river by the Rat and left out of the zodiac — [Wikipedia: Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac)
- Origins: animals were standardized as branch symbols by the Han. The Fangmatan bamboo slips contain an early animal system — [Wikipedia: Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac)

### Inferences
- **Implementation tables [std]:**
  - Branch index (0 = 子/ชวด … 11 = 亥/กุน): `(Y − 4) mod 12`, where Y is the Lichun-adjusted Gregorian year. Thai พ.ศ.: `Y = BE − 543`.
  - Stem index (0 = 甲 … 9 = 癸): `(Y − 4) mod 10`. Stem element: 甲乙 ไม้, 丙丁 ไฟ, 戊己 ดิน, 庚辛 ทอง, 壬癸 น้ำ. Shortcut by the last digit of the CE year: 0–1 ทอง, 2–3 น้ำ, 4–5 ไม้, 6–7 ไฟ, 8–9 ดิน. Example: 2026 ends in 6, so 丙 ไฟ, consistent with "ม้าไฟ". Even stem = หยาง, odd = หยิน.
  - 六冲 (ชง): 子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥, so `clash = (b + 6) mod 12`.
  - 三合 (สามประสาน): 申子辰 (น้ำ), 寅午戌 (ไฟ), 亥卯未 (ไม้), 巳酉丑 (ทอง), so `(b + 4) mod 12` and `(b + 8) mod 12`.
  - 六合 (คู่มิตร/คู่เอก): 子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未, so `partner = (13 − b) mod 12`, since b + partner ≡ 1 (mod 12).
  - 六害: 子未, 丑午, 寅巳, 卯辰, 申亥, 酉戌, so `(19 − b) mod 12`, since b + h ≡ 7 (mod 12).
  - 相破: 子酉, 午卯, 寅亥, 巳申, 辰丑, 戌未.
  - 相刑: 寅巳申, 丑戌未, 子卯, and self-punishment 辰午酉亥.
- **How Thai lists are built:** the classical Chinese 犯太岁 set for a 午 year is 值 (午), 冲 (子), 破 (卯), 害 (丑) and 自刑 (午). The Thai 2569 list instead has ชวด, มะเมีย, เถาะ, ระกา, which is exactly the 四正 group {子, 午, 卯, 酉}. Thai media seem to compute ปีชง as "the year's own animal, its opposite, plus the other two in the same 4-group (子午卯酉 / 寅申巳亥 / 辰戌丑未)". Rule for the website: ชงตรง = `(Y + 6) mod 12`; ชงตัวเอง = the year's own branch; ชงร่วม = the other members of the same group `b mod 3`. Optionally show the classical Chinese 破/害/刑 as "ชงอ้อม". Treat this as an inference from the published lists only; I found no Thai source stating the rule.
- **Boundary handling:** offer a setting with "ลิบชุน (ดวงจีน/ปาจื้อ, default)" and "ตรุษจีน (ปฏิทินจันทรคติจีน)", and a separate "นักษัตรไทย (ขึ้น 1 ค่ำ เดือน 5)" for the Thai-astrology module. For births from 1 Jan to about 4 Feb (Lichun) or to Chinese New Year, show both animals with a tooltip explaining why.

### Gaps
- No authoritative statement of the Thai ปีชง rule (ชงร่วม/ชงเฉียง/ชงอ้อม) was found. The term "ชงเฉียง" did not appear in any fetched source.
- The Thai ศก names (เอกศก … สัมฤทธิศก, from the last digit of จ.ศ.) were not covered by the fetched Thai Wikipedia page, so they are uncited here.
- Whether Lanna uses ช้าง for กุน could not be confirmed. Thai Wikipedia attributes ช้าง only to the Tai Lue.

---

## Q2. ปาจื้อ / BaZi (Four Pillars): algorithm, what works without birth time, libraries

### Takeaway
All four pillars can be computed deterministically. Year changes at Lichun, month changes at the 12 節 solar terms (which needs an astronomical ephemeris, so use a library), day comes from the Julian Day Number mod 60, and hour from the five-rats rule. Without birth time you get 3 pillars (6 characters) and the Day Master. `lunar-javascript` (MIT) does all of this plus almanac data.

### Cited Findings
- History: stem-branch dating appears on Shang oracle bones. Li Xuzhong (Tang, about 761–813) read fate from year, month and day (3 pillars, 6 characters). Xu Ziping (Song) added the hour, giving 4 pillars and 8 characters, which is why it is called the 子平法 (Ziping method). Key texts: 淵海子平 (Song, revised in the Ming), 三命通會 (Wan Minying, Ming), 滴天髓 (authorship disputed) — [Wikipedia: Four Pillars of Destiny](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny)
- The month pillar follows the 24 solar terms, not lunar months, which makes the system effectively solar. The hour pillar uses 12 double-hours (時辰) — [Wikipedia: Four Pillars](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny)
- Ten Gods (十神) come from the Day Master's five-element relation to each other stem plus polarity: 比肩/劫財, 食神/傷官, 正財/偏財, 正官/七殺, 正印/偏印 — [Wikipedia: Four Pillars](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny). The fetched summary of that page swapped the polarity for wealth, officer and resource; the correct mapping is in Inferences.
- **Month stems (五虎遁):** the 寅-month stem is set by the year stem. 甲/己 → 丙寅, 乙/庚 → 戊寅, 丙/辛 → 庚寅, 丁/壬 → 壬寅, 戊/癸 → 甲寅. Later months add 1 to the stem each month — [Wikipedia: Sexagenary cycle](https://en.wikipedia.org/wiki/Sexagenary_cycle)
- **Hour stems (五鼠遁):** the 子-hour stem is set by the day stem. 甲/己 → 甲子, 乙/庚 → 丙子, 丙/辛 → 戊子, 丁/壬 → 庚子, 戊/癸 → 壬子. Each following hour adds 1. 子 hour = 23:00–01:00 — [Wikipedia: Sexagenary cycle](https://en.wikipedia.org/wiki/Sexagenary_cycle)
- The day count has run unbroken since the Shang. Wikipedia's example: 18 Feb 1912 = 甲子 day — [Wikipedia: Sexagenary cycle](https://en.wikipedia.org/wiki/Sexagenary_cycle)
- **lunar-javascript (6tail): MIT license, about 1.7k stars, no dependencies.** Features: Gregorian–lunar conversion, Julian day, 干支, 生肖, 節氣, festivals, daily 宜忌, 吉神方位, 冲煞, 納音, 星宿, **八字, 五行, 十神**, 建除十二值星, plus Buddhist and Taoist calendars. Install with `npm install lunar-javascript`; `Solar.fromYmd(1986,5,29).getLunar().toFullString()`. Full API docs are at 6tail.cn/calendar/api.html. That site had an expired TLS certificate when I fetched it on 2026-10-11 — [GitHub 6tail/lunar-javascript](https://github.com/6tail/lunar-javascript), [README raw](https://raw.githubusercontent.com/6tail/lunar-javascript/master/README.md)
- The related `lunar-typescript` package is listed as MIT — [Snyk](https://dev.snyk.io/advisor/npm-package/lunar-typescript). 6tail also publishes the `tyme4py` family — [Gitee 6tail/tyme4py](https://gitee.com/6tail/tyme4py)
- **sxtwl** (Python/C++ via SWIG, based on 寿星天文历 by 許劍偉): lunar–solar conversion, 干支, true solar time. Listed as **BSD-3-Clause** on Snyk (third-party; check the LICENSE). The README asks users to credit 許劍偉. `pip install sxtwl` — [PyPI sxtwl](https://pypi.org/project/sxtwl/), [Snyk sxtwl](https://snyk.io/advisor/python/sxtwl), [sxwnl upstream](https://gitee.com/sxwnl)

### Inferences
- **Algorithm [std]. Verify each step against lunar-javascript `getEightChar()`.**
  1. **Year pillar:** Y = Gregorian year, minus 1 if the birth moment is before that year's 立春 instant (solar longitude 315°). Stem = `(Y − 4) mod 10`, branch = `(Y − 4) mod 12`.
  2. **Month pillar:** month branch is set by the last 節 passed. 立春 (~Feb 4) → 寅; 驚蟄 (~Mar 6) → 卯; 清明 (~Apr 5) → 辰; 立夏 (~May 6) → 巳; 芒種 (~Jun 6) → 午; 小暑 (~Jul 7) → 未; 立秋 (~Aug 8) → 申; 白露 (~Sep 8) → 酉; 寒露 (~Oct 8) → 戌; 立冬 (~Nov 7) → 亥; 大雪 (~Dec 7) → 子; 小寒 (~Jan 6) → 丑. The 中氣 terms do not change the month. Stem uses 五虎遁: `yinStem = (2·(yearStem mod 5) + 2) mod 10` with 0-based 甲 = 0, then `stem = (yinStem + k) mod 10`, where k = months since 寅. Exact 節 times vary by about ±1 day and need an ephemeris, so take them from the library.
  3. **Day pillar:** compute the JDN (integer, at noon) of the civil date. `idx60 = (JDN + 49) mod 60`, with 0 = 甲子, stem = `idx60 mod 10`, branch = `idx60 mod 12`. Checks: 2000-01-01 has JDN 2451545 → 54 = 戊午; 1949-10-01 has JDN 2433191 → 0 = 甲子. Standard JDN (Gregorian): `a = ⌊(14 − M)/12⌋, y = Y + 4800 − a, m = M + 12a − 3, JDN = D + ⌊(153m + 2)/5⌋ + 365y + ⌊y/4⌋ − ⌊y/100⌋ + ⌊y/400⌋ − 32045`.
  4. **Hour pillar:** branch = `⌊(hour + 1)/2⌋ mod 12` (23:00 → 子). Stem uses 五鼠遁: `ziStem = (2·(dayStem mod 5)) mod 10`, then `stem = (ziStem + branch) mod 10`.
  5. **The 23:00–24:00 problem (早子/晚子):** one school moves to the next day's day pillar at 23:00; the other keeps the same day and uses the next day's 子-hour stem. lunar-javascript exposes this as a "sect" option. Make it a user setting and default to 23:00 = next day.
  6. **True solar time (Thailand):** Thai civil time is UTC+7, centred on 105°E. Bangkok is about 100.5°E, so local mean time runs about 18 minutes behind clock time (4 min per degree × 4.5°). The equation of time adds roughly −14 to +16 minutes. Births within about 30 minutes of an odd-hour boundary can change the hour pillar. Offer an optional province selector (longitude only, no address).
- **Day Master (日主/ดิถีธาตุ):** the day stem. For example, 辛 = เหล็ก/ทองหยิน.
- **Hidden stems 藏干 [std]** (main, middle, residual):
  - 子 癸
  - 丑 己癸辛
  - 寅 甲丙戊
  - 卯 乙
  - 辰 戊乙癸
  - 巳 丙庚戊
  - 午 丁己
  - 未 己丁乙
  - 申 庚壬戊
  - 酉 辛
  - 戌 戊辛丁
  - 亥 壬甲
- **Five-element balance:** the simple version counts 8 characters (stems plus branch main element). Branch elements: 寅卯 ไม้, 巳午 ไฟ, 申酉 ทอง, 亥子 น้ำ, 辰戌丑未 ดิน. A weighted version gives each stem 1.0 and each hidden stem e.g. 0.6 / 0.3 / 0.1, and may double the month branch. Most Thai sites show the simple 8-count, so present it as "สมดุลธาตุ" (a pentagon or radar chart) and state that the weighting is a design choice.
- **Ten Gods mapping [std]:** where X relates to the DM:
  - Same element: same polarity 比肩, different polarity 劫財.
  - DM produces X: same 食神, different 傷官.
  - DM controls X: same **偏財**, different **正財**.
  - X controls DM: same **七殺**, different **正官**.
  - X produces DM: same **偏印**, different **正印**.
- **Worked example, hand-computed [std]: 15 Jul 1990, 12:00 Bangkok**
  - Year: after Lichun, 1990 → (1990 − 4) mod 10 = 6 = 庚, mod 12 = 6 = 午 → **庚午**.
  - Month: after 小暑 (Jul 7) → 未. 庚 year → 寅 = 戊, plus 5 → **癸未**.
  - Day: JDN = 2448088 → (2448088 + 49) mod 60 = 17 → **辛巳**.
  - Hour: 12:00 (LMT ≈ 11:42) = 午. 辛 day → 子 = 戊, plus 6 → **甲午**.
  - Day Master 辛 (metal, yin).
  - 8-character count: ทอง 2 (庚, 辛), ไฟ 3 (午, 巳, 午), น้ำ 1 (癸), ดิน 1 (未), ไม้ 1 (甲).
- **Without birth time:** 3 pillars (6 characters), Day Master, year/month/day 十神, the element count over 6 characters and ปีชง/คู่มิตร all still work. You lose the hour pillar, 時柱 十神 and some 神煞. 大運 also needs gender: yang-year male or yin-year female count forward, otherwise backward. The start age comes from the days to the next or previous 節 divided by 3, so it needs the time only loosely (date is enough to about ±4 months). If the gender field is optional, show 大運 only when gender is given.
- Thai term: ปาจื้อ is the Teochew reading of 八字. Thai ซินแส and media use it alongside "โป๊ยหยี่สี่เถียว" (八字四柱, Teochew).

### Gaps
- Exact lunar-javascript method names (`getEightChar`, `getYearHideGan`, `setSect`, `getYun`) could not be confirmed because the API docs site had an expired TLS certificate. Check the npm package source directly.
- No license file for the upstream sxwnl (寿星天文历) repo was retrieved.
- The worked example is hand-computed and has not been checked against a library.

---

## Q3. Kua number / 八宅 (Eight Mansions)

### Takeaway
Kua needs **birth year (Lichun-adjusted) plus gender**. It is the only system here where the gender field is mandatory. It is a mod-9 formula, with Kua 5 replaced by 2 (male) or 8 (female). East group is 1, 3, 4, 9; West group is 2, 6, 7, 8.

### Cited Findings
- Classical formula: male = (100 − last two digits) mod 9; female = (last two digits − 4) mod 9; remainder 0 → 9. Examples: male 1975 → 7 (兑); female 1985 → 9 (离). Kua 5 has no trigram, so 男寄坤 (2) and 女寄艮 (8). The year boundary is 立春, not the lunar new year. East: 1 坎, 3 震, 4 巽, 9 离; West: 2 坤, 6 乾, 7 兑, 8 艮. Lucky stars: 生气, 天医, 延年, 伏位; unlucky: 绝命, 五鬼, 祸害, 六煞 — [Epoch Times (Chinese)](https://www.epochtimes.com/gb/9/6/16/n2559780.htm), [fengshuitoday 命卦](https://tools.fengshuitoday.com/?p=15778), [uptogo](https://uptogo.com.tw/?p=1290098) (these sources were read through search summaries)
- SCMP describes the digit-sum method: 1975 → 1+9+7+5 = 22 → 4, and male = 11 − 4 = 7 — [SCMP](https://www.scmp.com/article/709737/head-right-direction)
- Modern calculators change constants at 2000: male 10 − x before 2000 and 9 − x after; female 5 + x before and 6 + x after — [everycalculators](https://everycalculators.com/calculate-kua-number.html). Some online sources disagree on women born after 2000.
- Roxy API: Kua uses the Lichun year (2000-01-20 → solar year 1999 → male Kua 1, east). A 1990-07-15 female → west, Kua 8 with 生气 = SW. Kua 7 has 五鬼 = S. Kua 5 is reassigned to 2 (male) or 8 (female) — [RoxyAPI feng shui guide](https://roxyapi.com/docs/guides/feng-shui.md)

### Inferences
- **Century-independent formula [std]**, with r = Y mod 9 (Y = Lichun year), which equals the repeated digit sum:
  - Male: `k = (11 − r) mod 9`, 0 → 9, 5 → 2.
  - Female: `k = (r + 4) mod 9`, 0 → 9, 5 → 8.
  - This reproduces the classical, SCMP and post-2000 versions: male 1975 = 7, female 1985 = 9, male 1999 = 1, female 1990 = 5 → 8. The RoxyAPI examples match.
- **Direction table [std]**, derived from the 大游年歌 (乾六天五祸绝延生, 坎五天生延绝祸六, 艮六绝祸生延天五, 震延生祸绝五天六, 巽天五六祸生绝延, 离六五绝延祸生天, 坤天延绝生祸五六, 兑生祸延绝六五天) and checked for symmetry. Columns are N / NE / E / SE / S / SW / W / NW:

| Kua | Group | N | NE | E | SE | S | SW | W | NW |
|---|---|---|---|---|---|---|---|---|---|
| 1 坎 | East | 伏位 | 五鬼 | 天医 | 生气 | 延年 | 绝命 | 祸害 | 六煞 |
| 2 坤 | West | 绝命 | 生气 | 祸害 | 五鬼 | 六煞 | 伏位 | 天医 | 延年 |
| 3 震 | East | 天医 | 六煞 | 伏位 | 延年 | 生气 | 祸害 | 绝命 | 五鬼 |
| 4 巽 | East | 生气 | 绝命 | 延年 | 伏位 | 天医 | 五鬼 | 六煞 | 祸害 |
| 6 乾 | West | 六煞 | 天医 | 五鬼 | 祸害 | 绝命 | 延年 | 生气 | 伏位 |
| 7 兑 | West | 祸害 | 延年 | 绝命 | 六煞 | 五鬼 | 天医 | 伏位 | 生气 |
| 8 艮 | West | 五鬼 | 伏位 | 六煞 | 绝命 | 祸害 | 生气 | 延年 | 天医 |
| 9 离 | East | 延年 | 祸害 | 生气 | 天医 | 伏位 | 六煞 | 五鬼 | 绝命 |

  - Table checks against the sources: Kua 8 生气 = SW and Kua 7 五鬼 = S both match RoxyAPI.
  - One search summary gave a different 坎 layout (绝命 NW, 五鬼 W) and flagged it as unverified. It contradicts the 大游年歌 derivation, so it was rejected.
- **Gender UX:** without gender, either hide Kua or show both the male and female results. Many sites use the term "เพศกำเนิด" for this field.
- **Thai labels:** 生气 = เซ็งขี่ (Teochew), 天医 = เทียนอี, 延年 = เหยียนเหนียน, 伏位 = ฮกอุ่ย. These Teochew and Hokkien readings are **unverified**.

### Gaps
- No primary classical text (e.g. 八宅明镜) was fetched, and the zh.wikipedia 八宅 page returned a 404. The direction table rests on the 大游年歌 rhyme recalled from memory and two data points from RoxyAPI.

---

## Q4. Chinese lunar calendar conversion and libraries

### Takeaway
Do not hand-roll the lunar calendar or solar terms. Use `lunar-javascript` / `lunar-typescript` (MIT) in the browser or Node, or `sxtwl` (BSD-3, per Snyk) in Python. They give lunar date, leap months, 節氣 times, 干支 and the almanac.

### Cited Findings
- lunar-javascript converts Gregorian ↔ lunar dates (including leap months), and outputs 節氣, 干支, 納音, 二十八宿, 彭祖百忌, and directions of the lucky deities and 冲煞. Example: 1986-05-29 → 农历丙寅年四月廿一 (lunar date, Year of the Tiger) — [GitHub README](https://raw.githubusercontent.com/6tail/lunar-javascript/master/README.md)
- sxtwl offers lunar/solar/干支 conversion, true solar time and planetary calendars, based on 寿星天文历 — [PyPI](https://pypi.org/project/sxtwl/)
- `sxtwl-modern` is a separately packaged fork — [PyPI sxtwl-modern](https://pypi.org/project/sxtwl-modern/)

### Inferences
- Calendar computations should use China Standard Time (UTC+8) for Lichun and 節 instants and lunar day boundaries, as the libraries do. Convert the Thai birth moment (UTC+7) to UTC+8 before comparing with 節 times. The **day pillar** should still use the local (Thai) civil date or true solar time. This is the common practitioner convention but sites differ, so document the choice.
- Verify the TLS and documentation status of 6tail.cn. The package itself installs from npm.

### Gaps
- No benchmark of library accuracy against the Hong Kong Observatory or Purple Mountain Observatory tables was found.

---

## Q5. Optional: 紫微斗數 and ปฏิทินจีน daily auspicious info; Thai diaspora history and media figures

### Takeaway
Daily almanac data (宜忌, 冲煞, 建除) comes free with lunar-javascript, which makes a "ปฏิทินจีนวันนี้" widget cheap to build. Zi Wei needs the exact birth hour and the lunar month/day; it is feasible but needs a dedicated library. Thai-Chinese practice is carried mainly by Teochew-heritage ซินแส and mass media.

### Cited Findings
- lunar-javascript includes 每日宜忌, 吉神方位, 冲煞 and 建除十二值星 — [GitHub README](https://raw.githubusercontent.com/6tail/lunar-javascript/master/README.md)
- Teochew Chinese were prominent in trade and administration in the Thonburi and early Rattanakosin periods — [Silpa-mag](https://www.silpa-mag.com/?p=48377)
- Thai ซินแส in the media:
  - อ.ธนวันต์ จิรเจริญเวศน์ (ตี่ลี่ ฮวงจุ้ย) is described as heir to a feng shui lineage, generation 15 — [Matichon](https://www.matichon.co.th/lifestyle/horoscope-lifestyle/news_4880750)
  - Thethaiger reported on his businesses and that he had stepped down as a company director — [Thethaiger](https://thethaiger.com/th/news/1274403/)
  - "ซินแสเป็นหนึ่ง" (อ.เป็นหนึ่ง **วงษ์ภูดร**, not "วงศ์สวัสดิ์") works in ฮวงจุ้ย, ลายเซ็น/โลโก้, ตัวเลข and โหงวเฮ้ง. He is quoted on topics such as Bangkok's "หัวใจมังกร" — [Bangkokbiznews](https://www.bangkokbiznews.com/lifestyle/art-living/1149007), [Dailynews](https://www.dailynews.co.th/articles/3199706/)
- Annual ปีชง content in Thai media (Thairath, Thansettakij, Matichon, and banks such as Krungsri and KBank) is a recurring publishing format around ตรุษจีน and ลิบชุน — see the Q1 sources.

### Inferences
- **Zi Wei feasibility:** it needs the lunar month and day, the birth hour (mandatory) and gender, then places 14 main stars in 12 palaces using the 命宮 and 五行局 tables. It is deterministic, but without an hour it is unusable. Open-source JS options exist (e.g. "iztro", MIT, from memory and unverified). Treat it as a phase-2 feature that appears only when a time is entered.
- **Who uses which system:** ซินแส such as ธนวันต์ and เป็นหนึ่ง work in the **Chinese** system (ฮวงจุ้ย, ปาจื้อ, โหงวเฮ้ง). Thai-astrology figures such as "หมอช้าง ทศพร ศรีตุลา" (from general knowledge, unverified here) and "โหรรัตนโกสินทร์" work in **Thai** โหราศาสตร์ (ทักษา, ลัคนา), even though they publish ปีชง rankings. The GUI should separate these two systems.
- **Visual language:**
  - Luopan (羅盤) concentric rings as a radial chart for the 8 Kua directions.
  - Bagua octagon (later-heaven arrangement, 後天八卦: 离 S top in the Chinese convention, 坎 N).
  - Red and gold palette, 12 animal medallions, and four "pillars" drawn as vertical columns with a stem above the branch, in the 八字 chart's right-to-left order.
  - A five-element cycle diagram (生/克 star-pentagon).
  - A Lichun/Chinese New Year timeline slider for the year-boundary explanation.

### Gaps
- No reliable biography for ซินแสโจ้ or detailed career of ซินแสเป็นหนึ่ง was found.
- No sourced history of feng shui (郭璞 葬書, 形勢派 vs 理氣派) was gathered in this session.
- No source was found on how the Great Race legend is told in Thai children's media.
- The iztro library and its license were not verified.
- No academic source on the spread of 八字 practice among Thai Teochew communities was retrieved. The TCI-ThaiJO PDFs surfaced in search but were not read: [so06](https://so06.tci-thaijo.org/index.php/thaikhadijournal/article/download/269864/180503/1077880), [so01](https://so01.tci-thaijo.org/index.php/husocjr/article/download/278136/181784/1190666).
