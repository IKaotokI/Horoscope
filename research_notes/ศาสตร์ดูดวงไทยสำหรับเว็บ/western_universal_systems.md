# Western and Universal Fortune-Telling Systems Computable from Birth Date (for a Thai horoscope website)

Scope: systems that can be computed automatically from birth date, with optional birth time and place. No name-based or phone-based methods. Research date: 2026-10-11. Worked examples marked "computed" were checked with a short Python script during this research. They are not taken from a source.

---

## 1. Western tropical astrology: sun sign, moon sign, ascendant, libraries, licensing, sidereal vs tropical

### Takeaway
You can get the sun sign from a date table, though a date that falls on a cusp needs an ephemeris to be certain. The Moon sign needs an ephemeris and ideally a birth time, because the Moon changes sign about every 2.5 days. The Ascendant needs birth time and place. The best free option for a browser is the MIT-licensed `astronomy-engine`, or the Unlicense `circular-natal-horoscope-js` (Moshier ephemeris). The Swiss Ephemeris and its npm port `sweph` are AGPL-3.0 unless you buy the Professional License (about CHF 700). The AGPL is a serious risk for a closed-source commercial website.

### Cited Findings
**Sun sign date ranges (tropical, approximate)** — [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign)

| Sign (Thai) | Approx. dates |
|---|---|
| Aries (เมษ) | 21 Mar – 20 Apr |
| Taurus (พฤษภ) | 21 Apr – 21 May |
| Gemini (เมถุน) | 22 May – 21 Jun |
| Cancer (กรกฎ) | 22 Jun – 23 Jul |
| Leo (สิงห์) | 24 Jul – 23 Aug |
| Virgo (กันย์) | 24 Aug – 23 Sep |
| Libra (ตุลย์) | 24 Sep – 23 Oct |
| Scorpio (พิจิก) | 24 Oct – 22 Nov |
| Sagittarius (ธนู) | 23 Nov – 21 Dec |
| Capricorn (มังกร) | 22 Dec – 20 Jan |
| Aquarius (กุมภ์) | 21 Jan – 19 Feb |
| Pisces (มีน) | 20 Feb – 20 Mar |

- The start of Aries shifts a little from year to year because the March equinox falls between 19 and 21 March. Boundaries are therefore approximate, and an exact cusp needs the Sun's computed longitude. — [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign)
- **History:** The division of the ecliptic into 12 equal sectors is a Babylonian construction, traced to the "ideal calendar" of the MUL.APIN compendium. By the 4th century BC, Babylonian astronomy and omen traditions had influenced Greece. Egyptian influence had arrived by the late 2nd century BC, producing the individual birth chart, the Ascendant and the 12 houses. Ptolemy's 2nd-century *Tetrabiblos* recorded the Hellenistic tradition and stayed a reference for about 17 centuries. — [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign)
- **Tropical vs sidereal:** Axial precession has moved the signs out of line with their namesake constellations. Western astrology measures from the equinox and solstice points, which is the tropical zodiac. Hindu astrology corrects for precession, which is the sidereal zodiac. — [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign)
- **Ayanamsa:** The ayanamsa is the offset between the two zodiacs. The Lahiri ayanamsa, named after N. C. Lahiri (1906–1980), is "by far the most prevalent system in India". It puts Spica at 0° Libra and is presumed to be about 23.84° at J2000 and about 24.2° by 2026. Other ayanamsas include Raman, Krishnamurti, Fagan/Bradley and True Chitra Paksha. — [Wikipedia: Ayanamsa](https://en.wikipedia.org/wiki/Ayanamsa)
- **Thai context:** Traditional Thai astrology computed planetary positions with the คัมภีร์สุริยยาตร์ (Suriyayat). Interpretation depended on each school's own texts. — [TCI Thai journal (Veridian E-Journal)](https://he02.tci-thaijo.org/index.php/Veridian-E-Journal/article/download/170497/156529). Thai articles describe two systems, สายนะ (tropical) and นิรายนะ (sidereal). Each counts birthdays differently, which is why Thai fortune-tellers give different ราศี for the same person. Thai-style ราศี follow the real constellations, with เมษ starting around mid-April. — [KTC: Thai zodiac](https://www.ktc.co.th/article/lifestyle/misc/thai-zodiac); [Thairath](https://www.thairath.co.th/horoscope/belief/2707683)
- **Swiss Ephemeris licensing:** The developer has to pick one of two licenses. The AGPL requires the whole software project to be under the AGPL or a compatible license. The other option is the Professional License, bought from Astrodienst with a signed contract. The choice has to be made before distributing the software or launching a public service that uses it. Neither license allows the authors' or Astrodienst's names to be used for promotion. — [astro.com swephinfo](https://www.astro.com/swisseph/swephinfo_e.htm)
- **Swiss Ephemeris price:** Astrodienst's contract lists the Professional License at **CHF 700** for unlimited projects. — [Astrodienst contract PDF](https://www.astro.com/swisseph/secont_e.pdf). A third-party blog says the pricing is not public. — [RoxyAPI blog](https://roxyapi.com/blogs/swiss-ephemeris-agpl-licensing-saas). Check the current price with Astrodienst before relying on either.
- **Swiss Ephemeris accuracy:** It is based on JPL DE431, and on DE441 since May 2026. It covers 13201 BC to AD 17191 and reproduces JPL to 0.001″. The data files total about 97 MB. The built-in Moshier mode covers 3000 BC to AD 3000, is better than 0.1″ for planets and about 3″ for the Moon, and needs no files. — [astro.com swephinfo](https://www.astro.com/swisseph/swephinfo_e.htm)
- **`sweph` (npm):** Versions up to 2.10.0 are GPL-2.0. Versions from 2.10.1 on are AGPL-3.0. Holders of a Professional License may use it under LGPL-3.0. It is **Node-only**: it uses N-API native add-ons and "will not work in browsers". The current version is 2.10.3-7, and ephemeris files are not bundled. — [GitHub timotejroiko/sweph](https://github.com/timotejroiko/sweph)
- **`astronomy-engine` (npm):** MIT license, zero dependencies, computes the Sun, Moon and planets. — [Snyk advisor](https://snyk.io/advisor/npm-package/astronomy-engine); [DepScope](https://mcp.depscope.dev/pkg/npm/astronomy-engine)
- **`circular-natal-horoscope-js`:** The Unlicense (public-domain style). It provides seven house systems (Placidus, Koch, Topocentric, Regiomontanus, Campanus, Whole Sign, Equal), Ascendant and Midheaven, Sun through Pluto plus Nodes and Lilith, retrograde status, configurable aspects and orbs, a tropical/sidereal toggle, and multi-language labels. It uses the Moshier ephemeris through `ephemeris-moshier`. The page does not name its sidereal ayanamsa. — [GitHub 0xStarcat/CircularNatalHoroscopeJS](https://github.com/0xStarcat/CircularNatalHoroscopeJS)

### Inferences
- **Recommended stack:** Use `astronomy-engine` (MIT) on the client or server to get Sun and Moon ecliptic longitudes. Use `circular-natal-horoscope-js` (Unlicense) for houses and Ascendant, or compute the Ascendant yourself from local sidereal time with the standard formula: ASC = atan2(cos RAMC, −(sin RAMC·cos ε + tan φ·sin ε)). Avoid `sweph` and Swiss Ephemeris WASM ports unless the project is open-source under the AGPL or you buy the CHF 700 license. Note that the AGPL applies to network services, so serving pages from a server that uses AGPL code still triggers the source-sharing duty.
- **Sidereal positions:** Sidereal longitude = tropical longitude − ayanamsa. Lahiri is about 24.2° in 2026. A simple approximation is ayanamsa(year) ≈ 23.85° + (year − 2000) × 50.29″/3600. This is my linear approximation and has not been validated against Lahiri tables. Check it against a reference implementation before use.
- **Two ราศี side by side:** The site should label both clearly. "ราศีสากล (Tropical)" puts the Sun in Aries from about 21 March. "ราศีแบบไทย/อินเดีย (Sidereal)" puts it in เมษ from about 14 April (21 March plus about 24 days). Most Thai users will expect the sidereal one.
- **When birth time is unknown:** Compute the Moon at 12:00 local time and flag the result as uncertain if the Moon changes sign that day. The Moon moves about 13° a day. Hide the Ascendant entirely when there is no time or place.
- **Daily transit horoscope:** This is feasible. Compute today's planetary longitudes once a day on the server, then the aspects between transiting planets and the natal Sun and Moon, using templated Thai texts per aspect type and planet pair. It is cheap: a dozen longitudes per day plus per-user aspect checks.

### Gaps
- The Thai sources found do not say which ayanamsa traditional Suriyayat practice implies. Thai Suriyayat is a distinct computational tradition and is not identical to Lahiri. That belongs to the Thai-astrology researcher.
- I did not verify the ayanamsa used by `circular-natal-horoscope-js` for sidereal mode, or its last commit date.
- I did not check browser WASM ports of the Swiss Ephemeris (e.g., `swisseph-wasm`). They inherit the AGPL or Professional licensing, but their exact npm license fields were not verified.
- The npm `ephemeris` package and its license were not verified.
- The origins of the zodiac glyphs were not covered by the source fetched.

---

## 2. Vedic nakshatra (ฤกษ์ 27 / นักษัตรฤกษ์) from Moon longitude

### Takeaway
The nakshatra comes straight from the Moon's **sidereal** longitude. The ecliptic is split into 27 equal parts of 13°20′, each with 4 padas of 3°20′. You need an ephemeris for the Moon, a sidereal correction (Lahiri), and preferably a birth time.

### Cited Findings
- There are 27 equal divisions of 13°20′ each, starting at 0° sidereal Aries with Aśvinī. Each has four padas of 3°20′, making 108 padas. Abhijit appears as an extra mansion in the older 28-mansion system. The Atharvaveda lists 28 asterisms starting from Kṛttikā, while the Taittirīya Saṃhitā and Śatapatha Brāhmaṇa record 27. The Sūrya Siddhānta gives coordinates for the 27. — [Wikipedia: Nakshatra](https://en.wikipedia.org/wiki/Nakshatra)
- Table of start longitudes and Vimshottari lords. The lords cycle Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury three times. — [Wikipedia: Nakshatra](https://en.wikipedia.org/wiki/Nakshatra)

| # | Nakshatra | Start (sidereal) | Lord |
|---|---|---|---|
|1|Aśvinī|0°00′|Ketu|
|2|Bharaṇī|13°20′|Venus|
|3|Kṛttikā|26°40′|Sun|
|4|Rohiṇī|40°00′|Moon|
|5|Mṛgaśiras|53°20′|Mars|
|6|Ārdrā|66°40′|Rahu|
|7|Punarvasu|80°00′|Jupiter|
|8|Puṣya|93°20′|Saturn|
|9|Āśleṣā|106°40′|Mercury|
|10|Maghā|120°00′|Ketu|
|11|Pūrva Phālgunī|133°20′|Venus|
|12|Uttara Phālgunī|146°40′|Sun|
|13|Hasta|160°00′|Moon|
|14|Citrā|173°20′|Mars|
|15|Svātī|186°40′|Rahu|
|16|Viśākhā|200°00′|Jupiter|
|17|Anurādhā|213°20′|Saturn|
|18|Jyeṣṭhā|226°40′|Mercury|
|19|Mūla|240°00′|Ketu|
|20|Pūrva Āṣāḍhā|253°20′|Venus|
|21|Uttara Āṣāḍhā|266°40′|Sun|
|22|Śravaṇa|280°00′|Moon|
|23|Dhaniṣṭhā|293°20′|Mars|
|24|Śatabhiṣā|306°40′|Rahu|
|25|Pūrva Bhādrapadā|320°00′|Jupiter|
|26|Uttara Bhādrapadā|333°20′|Saturn|
|27|Revatī|346°40′|Mercury|

### Inferences
- **Formula:** λ_sid = λ_moon_tropical − ayanamsa, normalised to [0, 360). nakshatra = floor(λ_sid / 13.3333) + 1, and pada = floor((λ_sid mod 13.3333) / 3.3333) + 1. This is derived from the equal divisions above.
- **Thai naming:** Thai ฤกษ์ 27 names are Thai-ised forms such as อัศวินี, ภรณี, กฤติกา, โรหิณี, มฤคศิระ, อารทรา, ปุนพสุ, ปุษยะ, อาศเลษา, มฆะ, บุรพผลคุนี, อุตรผลคุนี, หัสตะ, จิตรา, สวาติ, วิศาขา, อนุราธะ, เชษฐา, มูละ, บุรพษาฒ, อุตราษาฒ, ศรวณะ, ธนิษฐา, ศตภิษัช, บุรพภัทรบท, อุตรภัทรบท and เรวดี. Spellings vary between Thai texts, so verify with the Thai-astrology researcher. In Thai practice, นักษัตรฤกษ์ is also used for auspicious timing (ฤกษ์ยาม), and Thai schools group the 27 into 9 ฤกษ์ categories (ทลิทโทฤกษ์, มหัทธโนฤกษ์, โจโรฤกษ์, ภูมิปาโลฤกษ์, เทศาตรีฤกษ์, เทวีฤกษ์, เพชฌฆาตฤกษ์, ราชาฤกษ์, สมโณฤกษ์). This is general knowledge and was **not verified by a fetched source**.
- **Uncertain results:** With no birth time, the Moon can cross a nakshatra boundary during the day, since it moves about 13°/day, roughly one nakshatra. Show the two possible ฤกษ์ with a note, or compute at noon and flag it.

### Gaps
- No fetched source covered the Thai names, the 9-ฤกษ์ grouping, or how Thai almanacs (ปฏิทินโหราศาสตร์) compute the Moon's ฤกษ์. Coordinate with the Thai-astrology researcher.

---

## 3. Numerology (Pythagorean): Life Path, Birthday, Personal Year; Chaldean briefly

### Takeaway
The Life Path number is the birth date reduced by digit-summing to 1–9, with 11/22/33 kept as master numbers. Several reduction methods exist and can give **different results**, as shown below. Pick one, document it, and optionally show the alternative. The modern Western "numerology" brand dates from around 1907. Linking it to Pythagoras is a later attribution.

### Cited Findings
- **Basic method:** Reduce the month, day and year separately, add them, and reduce again, stopping at 11, 22 or 33. The result is 1–9, 11, 22 or 33. — [101planners Life Path calculator](https://www.101planners.com/numerology/life-path-number-calculator/)
- **Where methods diverge:** some keep November as 11 while others reduce it to 2. Some reduce a day of 29 to 11 and keep a day of 22. Some carry master numbers from intermediate steps. One calculator reduces 33 to 6 unless an 11 or 22 contributed to it. One example treats 1984 as 22 and gets 5 + 6 + 22 = 33. — [Pardesco](https://numerology.pardesco.com/life-path/how-to-calculate/); [HowStuffWorks](https://people.howstuffworks.com/life-path-number.htm); [Bonnie Sorsby](https://bonniesorsby.com/life-path-number-meaning-calculator/)
- **Disagreement among practitioners:** Practitioners disagree about whether master numbers should ever be reduced. The disagreements are matters of convention. — [101planners](https://www.101planners.com/numerology/life-path-number-calculator/)
- **History:** Gematria is ancient; one example is Sargon II's 8th-century BC inscription linking a wall's length to his name. Aristotle attributes isopsephy to the Pythagoreans of the 6th century BCE. Agrippa applied arithmancy to the Latin alphabet in the 16th century. "Arithmancy" is attested from the 1570s, but **"numerology" is not recorded in English until about 1907** according to the OED. — [Wikipedia: Numerology](https://en.wikipedia.org/wiki/Numerology)
- **Scientific status:** Scientists use "numerology" dismissively for pattern-driven theories; Dirac's large-number coincidences are the classic case. — [Wikipedia: Numerology](https://en.wikipedia.org/wiki/Numerology)

**Worked examples (computed):**

| Birth date | Reduce each part (M + D + Y) | Sum all digits | Add whole numbers (M + D + YYYY) |
|---|---|---|---|
| 29 Nov 1990 | 2 + 11→2 … = **5** | **5** | 11 + 29 + 1990 = 2030 → **5** |
| 6 May 1984 | 5 + 6 + 22 = **33** | 1+9+8+4+0+5+0+6 = **33** | 5 + 6 + 1984 = 1995 → 24 → **6** |
| 24 Oct 1966 | 1 + 6 + 22 = 29 → **11** | **11** | 24 + 10 + 1966 = 2000 → **2** |

The table shows that the "add whole numbers" method often loses master numbers, while the "reduce each part" method keeps the most of them.

### Inferences
- **Recommended algorithm:** Use "reduce each part": r(month) + r(day) + r(year), then r(total). Here r() digit-sums until the value is ≤9 or equal to 11, 22 or 33. It is the most common method in calculators and keeps master numbers. Show the reduced form too, e.g. "33/6", which is a common display convention.
- **Birthday number:** r(day), so values 1–9, 11 or 22 (from the 29th, 11th and 22nd). Some systems display the raw day 1–31.
- **Personal Year:** r(r(birth month) + r(birth day) + r(current year)). It changes either on 1 January or on the birthday, depending on the school; let the GUI choose one. Personal Month = r(Personal Year + current month), and Personal Day = r(Personal Month + day).
- **Chaldean numerology:** It is mainly name-based (letters valued 1–8, with 9 considered sacred) and not used here. Its date-based part is just the birth day. Mention it only as history. This is general knowledge and was not verified by a fetched source.
- **Thai market:** In Thailand, numerology (เลขศาสตร์) is strongly tied to names and phone numbers (เบอร์มงคล, ชื่อมงคล), which the site excludes on purpose. Birth-date numerology is a smaller niche.

### Gaps
- I could not find reliable sources in this pass for **L. Dow Balliett** (early-1900s US "number vibration" books), **Juno Jordan** (who reportedly founded the California Institute of Numerical Research and wrote *Numerology: The Romance in Your Name*, 1965), or Florence Campbell. These are known from general background but are unverified here. The report writer should state them cautiously or leave them out.
- I found no authoritative source for the origin of master numbers (often attributed to Balliett and Jordan, unverified) or for the Chaldean letter table.

---

## 4. Tarot: birth cards, year card, daily draw, 78-card structure, Rider–Waite–Smith artwork copyright, history, Thai context

### Takeaway
The Greer-style birth card is day + month + birth year added as whole numbers, digit-summed until ≤22, which gives the Personality card; reducing further to 1–9 gives the Soul card. The year card uses the same formula with the current year. The original 1909 Pamela Colman Smith artwork is public domain in the US and UK, and in the EU and Thailand under life+70 or shorter terms. Avoid the "Rider-Waite" trademark and U.S. Games' 1971 recoloured scans.

### Cited Findings
- **Greer method:** Greer says the High Priestess corresponds to "birthdates that add up to 2000". Her example is someone born 24 October 1966 (24 + 10 + 1966 = 2000 → 2), who is "a Single 2", and who is in "an 11 Year (Justice)". Greer reduces that further to 2 (a "Shadow/Teacher" year). Her book (*Who Are You in the Tarot?*, reissued as *Archetypal Tarot*) groups the 22 Major Arcana into 9 Constellations. — [marykgreer.com](https://marykgreer.com/2011/08/17/who-are-you-in-the-tarot/); [Red Wheel/Weiser: Archetypal Tarot](https://redwheelweiser.com/book/archetypal-tarot-9781578637485/); [Global Spiritual Studies](https://globalspiritualstudies.com/sp/archetypal-tarot-birth-year-cards/)
  - Check (computed): if the post was written in 2011, the year card is 24 + 10 + 2011 = 2045 → 11 = Justice. This matches the "11 Year" and confirms that year card = birth day + birth month + current year.
- **Common calculator method:** Add month + day + full year, reduce to ≤22 for the first card, then reduce to a single digit. For example, 10 + 28 + 1994 = 2032 → 7 (The Chariot). Some sources treat 22 as The Fool (0) before reducing to 4 (The Emperor). — [Bustle 2026 tarot year](https://www.bustle.com/life/tarot-card-of-your-year-2026); [devcomma arcana calculator](https://tools.devcomma.com/en/calculators/arcana)
- **Deck structure:** 78 cards, made up of 22 Major Arcana (the Fool plus 21 numbered trumps) and 56 Minor Arcana in 4 suits of 14. — [Wikipedia: Tarot](https://en.wikipedia.org/wiki/Tarot)
- **History:** A lost Visconti pack is described around 1418–1425. The earliest *trionfi* record is from Florence in 1440, and decks are documented in Milan, Ferrara, Florence and Bologna from 1440 to 1450. The oldest surviving cards are the Visconti-Sforza decks from the mid-15th century. There is no evidence of significant divinatory use before the late 18th century. Court de Gébelin's "Du Jeu des Tarots" appeared in 1781. Court de Gébelin and Etteilla popularised occult tarot in Paris in the 1780s using the Tarot de Marseille, and Etteilla made the first deck designed for divination around 1789. Crowley's *Book of Thoth* with Frieda Harris art followed in 1944. — [Wikipedia: Tarot](https://en.wikipedia.org/wiki/Tarot)
- **Rider–Waite–Smith:** First published in December 1909 by William Rider & Son, London, with a roses-and-lilies back. A larger March 1910 printing has a "cracked mud" back and is often called the "A" deck. A. E. Waite designed the deck and wrote *The Key to the Tarot* (1909), revised as *The Pictorial Key to the Tarot* (1911). Pamela Colman Smith illustrated it. Both were members of the Hermetic Order of the Golden Dawn, and Waite swapped Strength (8) and Justice (11). Smith's Minor Arcana were the first to show full allegorical scenes. — [Wikipedia: Rider–Waite Tarot](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot)
- **Copyright:**
  - **US:** public domain since 1966.
  - **UK:** public domain, as is every country with a term of life+70 or shorter after the last co-author's death.
  - **U.S. Games:** claims copyright only on the new material in its 1971 edition, such as card backs and the box. — [Wikipedia: Rider–Waite Tarot](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot)
  - **UK/EU date:** public domain since 1 January 2022, 70 years after Smith died in 1951. U.S. Games holds trademarks on "Rider-Waite" and "Rider" and has claimed rights over exact reproductions of its recolouring. — [Global Spiritual Studies](https://globalspiritualstudies.com/is-rider-waite-smith-public-domain/); [The Wild Hunt (correction note)](https://wildhunt.org/2021/01/rider-waite-smith-tarot-deck-may-enter-public-domain.html)
  - **Litigation:** a 2024 lawsuit between publishers centred on copying "enhanced" artwork, not Smith's originals. — [Plagiarism Today](https://www.plagiarismtoday.com/2024/02/28/the-copyright-battle-over-a-tarot-card-deck/)
- **Thai context, name:** Thais commonly call tarot "ไพ่ยิปซี" because of the belief that Gypsies (Roma) spread it. — [Wikipedia ไทย: ไพ่ทาโรต์](https://th.wikipedia.org/wiki/%E0%B9%84%E0%B8%9E%E0%B9%88%E0%B8%97%E0%B8%B2%E0%B9%82%E0%B8%A3%E0%B8%95%E0%B9%8C); [Thairath](https://www.thairath.co.th/lifestyle/life/2955191). Tarotthailand.com says the name stuck when the cards reached Thailand and claims Thailand is probably the only country that uses this name. That claim is the author's opinion. — [ทาโรต์ไทยแลนด์](https://www.tarotthailand.com/2013/01/tarot-origin/)
- **Thai context, books:** Thai authors include อ.ณัชชา (สพรั่ง) ปราณีรัตนา with *ไพ่ยิปซี (ทาโร่ต์)* from สำนักพิมพ์แสงดาว, and อ.กามล แสงวงศ์ with *ตำราไพ่ยิปซี*. — [Saengdao](https://www.saengdao.com/product/9786163881151/); [สยามดวง](https://siamduang.com/product/%E0%B8%95%E0%B8%B3%E0%B8%A3%E0%B8%B2%E0%B9%84%E0%B8%9E%E0%B9%88%E0%B8%A2%E0%B8%B4%E0%B8%9B%E0%B8%8B%E0%B8%B5-1/)

### Inferences
- **Birth card algorithm:** s = day + month + year (whole numbers). While s > 22, replace s with its digit sum. That gives the Personality card. Then digit-sum to one digit for the Soul card. If s = 22, show The Fool (0), as the common convention. If Personality = Soul (e.g. 2, 7), it is a "single" card. Greer's 19/10/1 group (Sun/Wheel/Magician) is the one triple constellation. That last point is general knowledge of Greer's system and is unverified here.
- **Worked examples (computed):**
  - 24 Oct 1966 → Personality 2 (High Priestess) / Soul 2; 2026 year card 24 + 10 + 2026 = 2060 → 8 (Strength in RWS numbering).
  - 28 Oct 1994 → 7 / 7.
  - 29 Nov 1990 → 2030 → 5 (Hierophant).
- **Numbering:** Use the RWS numbering (8 = Strength, 11 = Justice) consistently, since the site will show RWS art.
- **Daily draw:** seed = hash(birthdate ISO + today's date in Asia/Bangkok), using a small deterministic PRNG such as mulberry32 or sfc32 seeded from a 32-bit FNV-1a or xmur3 hash. Then do a Fisher–Yates shuffle of 0..77 and take the first N. An optional reversal bit can come from the next PRNG output. The same user on the same day gets the same card on every device, which needs no storage and no personal data.
- **Artwork:** Use scans of early printings (the 1909 or 1910 "Pam-A" style) from Wikimedia Commons, which hosts public-domain RWS scans. Do not use the U.S. Games 1971 recoloured scans, and do not use "Rider-Waite" as a product name; say "ไพ่ทาโรต์ภาพต้นฉบับ Pamela Colman Smith (1909)" instead.
- **Thailand copyright:** Thailand's Copyright Act B.E. 2537 gives life+50 years, so Smith's 1909 art (she died in 1951) would have entered the Thai public domain around 2002. This is inferred from general knowledge of the Thai term and was **not verified by a fetched source**. Confirm with Thai counsel.

### Gaps
- Greer's own step-by-step text, including the exact rule for 22 and the 9 constellations, was not available online. It is in the book.
- No source found gives the **date tarot arrived in Thailand**, the first Thai tarot book or deck, or the history of Thai-made decks or magazine tarot columns. Several Thai searches found none. Treat this as a gap for the report.
- I found no source in this pass connecting the "Gypsy" association to Vaillant (1857) or Papus's *Tarot of the Bohemians* (1889). This is known background but unverified here.

---

## 5. Biorhythm

### Takeaway
There are three sine waves with periods of 23, 28 and 33 days, counted from birth. It is trivial to compute and makes an attractive chart. It is a debunked late-1800s / 1970s fad and should be labelled as entertainment.

### Cited Findings
- **Formula:** physical = sin(2πt/23), emotional = sin(2πt/28), intellectual = sin(2πt/33), where t is days since birth. The 23 and 28 cycles realign every 644 days, and all three every 21,252 days (about 58.18 years). — [Wikipedia: Biorhythm (pseudoscience)](https://en.wikipedia.org/wiki/Biorhythm_(pseudoscience))
- **History:**
  - Wilhelm Fliess, a Berlin physician and friend of Freud, proposed the 23-day "male" and 28-day "female" cycles in the late 19th century.
  - Hermann Swoboda reached similar conclusions in Vienna in 1904.
  - Alfred Teltscher of Innsbruck added the 33-day intellectual cycle in the early 1900s.
  - Nikolai Pärna published *Rhythm, Life and Creation* in 1923.
  - Bernard Gittelson popularised biorhythms in the 1970s.
  - Arcade machines and handheld devices such as the Casio Biolator and Kosmos 1 appeared in the late 1970s.

  — [Wikipedia](https://en.wikipedia.org/wiki/Biorhythm_(pseudoscience))
- **Evidence:** Studies found no effect: Persinger et al. (1978) on industrial accidents, Peveto (1980), and James (1984, 368 participants). Hines's 1998 review concluded the theory is not valid. — [Wikipedia](https://en.wikipedia.org/wiki/Biorhythm_(pseudoscience))

### Inferences
- **Worked example (computed):** born 29 Nov 1990, evaluated 11 Oct 2026, t = 13,100 days. Physical −0.398, emotional −0.782, intellectual −0.189.
- **Date handling:** Compute t from calendar dates in the user's timezone (Asia/Bangkok) using whole days, to avoid daylight-saving and UTC off-by-one errors. A "critical day" is when the value crosses zero; flag it when sign(sin t) ≠ sign(sin t+1). Some apps add secondary cycles (intuitive 38, aesthetic 43, spiritual 53), which are not part of the classic three.

### Gaps
- I found no data on biorhythm's popularity in Thailand.

---

## 6. Maya Tzolk'in day sign and Celtic tree (brief)

### Takeaway
The Tzolk'in can be computed exactly from the Julian Day Number using the GMT correlation (584283). The Celtic "tree calendar" is a 20th-century invention (from Robert Graves). Both have low recognition in Thailand, so treat them as optional extras.

### Cited Findings
- **Tzolk'in:** 13 numbers × 20 named days = 260 days. The day names in order are Imix, Ik', Ak'b'al, K'an, Chikchan, Kimi, Manik', Lamat, Muluk, Ok, Chuwen, Eb', B'en, Ix, Men, Kib', Kab'an, Etz'nab', Kawak, Ajaw. Wikipedia lists 11 October 2026 as **2 Ik'** (Long Count 13.0.14.0.2). — [Wikipedia: Tzolk'in](https://en.wikipedia.org/wiki/Tzolk%CA%BCin)

### Inferences
- **Algorithm:** d = JDN − 584283 (GMT correlation; day 0 = 4 Ajaw). number = ((d + 3) mod 13) + 1, and nameIndex = (d + 19) mod 20, where 0 = Imix and 19 = Ajaw. Check against the source: 11 October 2026 has JDN 2461325, so d = 1877042. That gives number = (1877045 mod 13) + 1 = 2 and nameIndex = 1877061 mod 20 = 1 (Ik'), which matches "2 Ik'". The correlation constant itself is from general knowledge, but the result agrees with Wikipedia's "Today" box.
- **"Dreamspell":** The popular Western "Galactic Signature" (José Argüelles, 1987) uses a different count that skips 29 February, so it does not match the traditional Maya count. Label which one you use. This is general knowledge and unverified here.
- **Celtic tree:** These are 13 lunar "months" with fixed date ranges, e.g. Birch from 24 Dec to 20 Jan. It is a simple lookup but is modern (Graves, *The White Goddess*, 1948) rather than ancient Celtic. Unverified here.

### Gaps
- No source fetched for the Celtic tree calendar dates or the Graves origin. No data on Thai popularity of either system; the low popularity is an assumption.

---

## 7. Visual motifs (cross-cutting, for the GUI)

### Takeaway
There is a rich, rights-safe set of public-domain visual material: the Smith 1909 tarot art in Art Nouveau / Arts-and-Crafts style, Babylonian and Hellenistic zodiac wheels, and nakshatra wheels.

### Cited Findings
- Smith's RWS art uses allegorical scenes on every card. Christian imagery was removed from some trumps; for example, the High Priestess has no papal tiara. — [Wikipedia: Rider–Waite Tarot](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_Tarot)
- The Visconti-Sforza hand-painted decks (gold leaf, mid-15th century) are the oldest surviving tarot. — [Wikipedia: Tarot](https://en.wikipedia.org/wiki/Tarot)
- The 12 signs combine the Babylonian MUL.APIN tradition with the Greek four elements. — [Wikipedia: Astrological sign](https://en.wikipedia.org/wiki/Astrological_sign)

### Inferences
- **Motif ideas:**
  - A circular natal wheel with 12 sectors coloured by element.
  - Unicode zodiac glyphs ♈–♓ and planet glyphs ☉☽☿♀♂♃♄.
  - An outer ring of 27 nakshatras in 13°20′ segments.
  - Astrolabe-style brass rings.
  - Old star-atlas engravings (Bayer's *Uranometria* 1603, Hevelius 1690, Cellarius's *Harmonia Macrocosmica* 1660, all public domain) as backgrounds.
  - Biorhythm as three coloured sine waves around a "today" marker.
  - Tzolk'in glyphs, which have public-domain line drawings on Wikimedia.

  Unicode glyph availability is standard. The star-atlas dates come from general knowledge and were not fetched in this pass.
- **Thai styling:** Pair the Western set with Thai จักรราศี mural styles so that ราศีไทย and ราศีสากล are visually distinct.

### Gaps
- I did not verify specific Wikimedia Commons files or their licence tags. Check each file's PD-old or PD-US tag before use.

---

## Licensing summary (flags)

| Item | License / status | Risk |
|---|---|---|
| Swiss Ephemeris / `sweph` ≥ 2.10.1 / WASM ports | AGPL-3.0, or Professional License (about CHF 700, signed contract) | **HIGH** for a closed-source web service |
| `sweph` ≤ 2.10.0 | GPL-2.0, Node-only | Medium: GPL obligations if distributed |
| `astronomy-engine` | MIT | Low |
| `circular-natal-horoscope-js` | Unlicense (Moshier ephemeris) | Low |
| RWS 1909 art (Smith) | PD in US (1966), UK/EU (2022), probably Thailand (life+50, unverified) | Low; avoid the "Rider-Waite" trademark and U.S. Games 1971 recolouring |
| Numerology, biorhythm, Tzolk'in formulas | Not copyrightable methods | None; write your own Thai interpretation texts |
| Interpretation texts from books (Greer, Waite's *Pictorial Key* 1911) | Greer is in copyright. Waite's 1911 text is PD (he died in 1942, so life+70 ended in 2012) | Write original Thai text, or adapt Waite's PD text |
