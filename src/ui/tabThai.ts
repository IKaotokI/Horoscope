import { formatThaiDate, toThaiDigits } from '../lib/core';
import { ROW_POSITIONS } from '../lib/thai/lek7';
import { formatThaiLunar } from '../lib/thai/lunar';
import { NAKSAT_ANIMALS, NAKSAT_NAMES, BOUNDARY_LABEL } from '../lib/thai/naksat';
import {
  BHUMI_MEANING, DAY_COLOR_CONVENTION, MAHATAKSA_CONVENTION, PLANET_COLOR, PLANET_VEHICLE,
} from '../lib/thai/taksa';
import { PLANET_DAY_NAME, PLANET_NAME, THAI_WEEKDAYS } from '../lib/thai/thaiDay';
import { NAKSHATRA_NAMES, SIGN_KEYWORDS, SIGNS_TH } from '../lib/western/zodiac';
import { chartWheel, taksaGrid } from './charts';
import { card, esc, lockedCard, select, swatch, unverifiedBadge } from './components';
import type { Results } from './compute';
import type { AppState } from './state';

export function renderThai(r: Results, s: AppState): string {
  const t = r.thai;
  const color = PLANET_COLOR[t.planet];
  const wedToggle =
    t.day.planets.length > 1
      ? `<div class="seg" role="group" aria-label="เลือกพุธกลางวันหรือกลางคืน">
          <button type="button" data-wed="4" aria-pressed="${t.planet === 4}">พุธกลางวัน</button>
          <button type="button" data-wed="8" aria-pressed="${t.planet === 8}">พุธกลางคืน</button>
        </div>`
      : '';

  const hero = card(
    PLANET_DAY_NAME[t.planet],
    `<div class="birth-hero" style="--aura:${color.hex}">
      <div class="aura" aria-hidden="true"></div>
      <p class="big-num">${toThaiDigits(t.planet)}</p>
      <p class="hero-sub">ดาวประจำวันเกิด: <b>${esc(PLANET_NAME[t.planet])}</b> · พาหนะเทพ: ${esc(PLANET_VEHICLE[t.planet])}</p>
      <p>สีประจำวันเกิด ${swatch(color.hex, color.name)}</p>
      <ul class="facts">
        <li><span>วันเกิดแบบไทย</span><b>วัน${esc(THAI_WEEKDAYS[t.day.weekday])}ที่ ${esc(formatThaiDate(t.day.thaiDate))}</b></li>
        <li><span>จันทรคติ</span><b>${t.lunar ? esc(formatThaiLunar(t.lunar)) : 'นอกช่วงตาราง'}</b></li>
        <li><span>ปีนักษัตร</span><b>ปี${esc(NAKSAT_NAMES[t.naksat.index - 1])}</b></li>
        <li><span>อายุ</span><b>${t.age} ปี</b></li>
      </ul>
      ${wedToggle}
      ${t.day.note ? `<p class="note">${esc(t.day.note)}</p>` : ''}
    </div>`,
    {
      kicker: 'วันเกิดและเทวดาประจำวัน',
      convention: t.day.convention,
      conventionExtra: select('dayBoundary', s.conv.dayBoundary, [
        ['fixed0600', 'พระอาทิตย์ขึ้น 06:00'],
        ['sunrise', 'พระอาทิตย์ขึ้นจริง (ต้องเลือกจังหวัด)'],
      ], 'ขอบวัน'),
      story:
        'ตำนานเทวดานพเคราะห์เล่าว่าพระอิศวรสร้างเทพแต่ละองค์จากสัตว์ เช่น พระอาทิตย์จากราชสีห์ 6 ตัว พระอังคารจากกระบือ 8 ตัว จำนวนนี้กลายเป็น "กำลังวัน" ซึ่งรวมกันได้ 108',
      className: 'card-hero',
    },
  );

  const taksaCard = card(
    'ทักษา 8 ภูมิ',
    `${taksaGrid(t.taksa)}
     <dl class="bhumi-list">${t.taksa
       .map(
         (x) => `<div><dt>${esc(x.bhumi)} <small>${esc(PLANET_NAME[x.planet])} ${toThaiDigits(x.planet)}</small></dt><dd>${esc(BHUMI_MEANING[x.bhumi])}</dd></div>`,
       )
       .join('')}</dl>
     <p class="note">ทิศของดาวบนผัง ยืนยันแล้วเฉพาะอาทิตย์ = อีสาน และอังคาร = อาคเนย์ ${unverifiedBadge()}</p>`,
    {
      kicker: 'วงแหวนทักษาเริ่มจากดาววันเกิด',
      convention: { label: 'วงแหวน อา→จ→อ→พ→ส→พฤ→รา→ศ ไล่ภูมิ บริวาร อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี' },
      story: 'ทักษาปรับมาจากมหาทักษา ตำราหลักคือ "มหาทักษาพยากรณ์" ของ อ.เทพย์ สาริกบุตร (2507) ส่วน "ทักษาปกรณ์" กลายเป็นตำราตั้งชื่อที่คนไทยนิยมที่สุด',
    },
  );

  const colorsCard = card(
    'สีมงคลและสีที่ควรเลี่ยง',
    `<div class="swatches">${t.lucky.good
      .map((g) => swatch(g.color.hex, g.color.name, `${g.bhumi} (${PLANET_NAME[g.planet]})`))
      .join('')}</div>
     <p class="kala">สีกาลกิณี ${swatch(t.lucky.kalakini.color.hex, t.lucky.kalakini.color.name, PLANET_NAME[t.lucky.kalakini.planet])}</p>
     <p class="note">สีเป็นเพียงความเชื่อเพื่อความสบายใจ ใส่สีไหนก็ได้ตามที่ชอบ</p>`,
    { kicker: 'จากทักษา', convention: t.lucky.convention, conventionExtra: ` · ${esc(DAY_COLOR_CONVENTION.label)}` },
  );

  const sunSign = t.sunSign;
  const signCard = card(
    `ราศี${SIGNS_TH[sunSign.sign]}`,
    `<p class="lead">ดวงอาทิตย์อยู่ราศี<b>${esc(SIGNS_TH[sunSign.sign])}</b> ${sunSign.degree.toFixed(1)}°</p>
     <p>${esc(SIGN_KEYWORDS[sunSign.sign])}</p>
     ${sunSign.alternatives.length ? `<p class="note">วันนี้ดวงอาทิตย์ย้ายราศี ถ้าไม่รู้เวลาเกิดอาจเป็นราศี${sunSign.alternatives.map((a) => esc(SIGNS_TH[a])).join(' / ')}</p>` : ''}
     <p class="note">ราศีไทยนับแบบนิรายนะ จึงต่างจากราศีสากลในนิตยสาร (ดูแท็บสากล)</p>`,
    {
      kicker: 'ราศีเกิดแบบไทย',
      convention: sunSign.convention,
      story: 'โหราศาสตร์ไทยใช้คัมภีร์สุริยยาตร์มาตั้งแต่สุโขทัย กรมโหรหลวงใช้ทำปฏิทิน และโหรไทยเคยผูกดวงถวายมกุฎราชกุมารรัสเซียที่เสด็จเยือนสยามในปี 1891',
    },
  );

  const ch = t.chart;
  const chartCard = card(
    'ดวงชะตา',
    `${chartWheel(ch, 'thai')}
     <ul class="planet-list">${ch.planets
       .map((p) => `<li><b>${esc(p.num)}</b> ${esc(p.name)} <span>${esc(SIGNS_TH[p.sign])} ${(p.lon % 30).toFixed(1)}°</span></li>`)
       .join('')}${ch.ascendant ? `<li class="is-asc"><b>ลั</b> ลัคนา <span>${esc(SIGNS_TH[ch.ascendant.sign])} ${(ch.ascendant.lon % 30).toFixed(1)}°</span></li>` : ''}</ul>
     ${!ch.ascendant ? '<p class="note">ลัคนาและภพต้องใช้ทั้งเวลาและจังหวัดเกิด จึงยังซ่อนไว้</p>' : ''}
     <p class="note">ผังช่องสี่เหลี่ยมแบบดั้งเดิมยังรอตรวจกับตำรา จึงแสดงเป็นวงล้อก่อน ${unverifiedBadge()}</p>`,
    {
      kicker: `ayanamsa ${ch.ayanamsa.toFixed(2)}°`,
      convention: ch.convention,
    },
  );

  const nk = t.naksat;
  const naksatCard = card(
    `ปี${NAKSAT_NAMES[nk.index - 1]}`,
    `<p class="lead">นักษัตรไทย: <b>ปี${esc(NAKSAT_NAMES[nk.index - 1])}</b> (${esc(NAKSAT_ANIMALS[nk.index - 1])}) · ลำดับ ${toThaiDigits(nk.index)}</p>
     ${nk.warning ? `<p class="warn">${esc(nk.warning)}</p>` : ''}
     <ul class="alt-list">${nk.alternatives
       .map((a) => `<li>ถ้านับเปลี่ยนปีที่ ${esc(BOUNDARY_LABEL[a.boundary])}: ปี${esc(NAKSAT_NAMES[a.index - 1])}</li>`)
       .join('')}</ul>`,
    {
      kicker: 'ปีนักษัตรแบบไทย',
      convention: nk.convention,
      conventionExtra: select('thaiYear', s.conv.thaiYear, [
        ['lunar5', 'ขึ้น 1 ค่ำ เดือน 5 (ค่าตั้งต้น)'],
        ['songkran', 'สงกรานต์'],
        ['jan1', '1 มกราคม'],
      ], 'เปลี่ยนปีที่'),
      story: 'ศิลปวัฒนธรรมยืนยันว่าตามประเพณีไทย ปีนักษัตรเปลี่ยนที่ขึ้น 1 ค่ำ เดือน 5 และ "สงกรานต์ไม่ใช่วันเปลี่ยนนักษัตร" ไทยใช้นาคแทนมังกรในปีมะโรง',
    },
  );

  const lk = t.lek7;
  const lekCard = lk
    ? card(
        'เลข 7 ตัว 4 ฐาน',
        `<div class="table-scroll"><table class="lek7">
          <thead><tr><th></th>${ROW_POSITIONS.day.map((_, j) => `<th>${j + 1}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><th>ฐาน ๑ วัน</th>${lk.day.map((v, j) => `<td title="${esc(ROW_POSITIONS.day[j])}">${toThaiDigits(v)}<small>${esc(ROW_POSITIONS.day[j])}</small></td>`).join('')}</tr>
            <tr><th>ฐาน ๒ เดือน</th>${lk.month.map((v, j) => `<td>${toThaiDigits(v)}<small>${esc(ROW_POSITIONS.month[j])}</small></td>`).join('')}</tr>
            <tr><th>ฐาน ๓ ปี</th>${lk.year.map((v, j) => `<td>${toThaiDigits(v)}<small>${esc(ROW_POSITIONS.year[j])}</small></td>`).join('')}</tr>
            <tr class="sum"><th>ฐาน ๔ รวม</th>${lk.sum.map((v) => `<td>${toThaiDigits(v)}</td>`).join('')}</tr>
          </tbody></table></div>
         <p class="note">ฐาน 5–9 ยังไม่มีแหล่งยืนยัน จึงยังไม่คำนวณ</p>`,
        { kicker: 'ใช้เดือนจันทรคติ ไม่ใช่เดือนสากล', convention: lk.convention },
      )
    : '';

  const mt = t.mahataksa;
  const mahaCard = card(
    'ดาวเสวยอายุ (มหาทักษา)',
    `<p class="lead">อายุ ${t.age} ปี ดาว<b>${esc(PLANET_NAME[mt.now.planet])}</b>เสวยอายุ (ช่วงอายุ ${mt.now.fromAge}–${mt.now.toAge} ในรอบ 108 ปี)</p>
     <ol class="timeline">${mt.periods
       .map((p) => {
         const w = ((p.toAge - p.fromAge) / 108) * 100;
         const cur = p.planet === mt.now.planet;
         return `<li class="${cur ? 'is-now' : ''}" style="--w:${w.toFixed(2)}%;--c:${PLANET_COLOR[p.planet].hex}"><span>${esc(PLANET_NAME[p.planet])}</span><small>${p.fromAge}–${p.toAge}</small></li>`;
       })
       .join('')}</ol>`,
    { kicker: 'ดาวที่ครองช่วงอายุ', convention: MAHATAKSA_CONVENTION },
  );

  const nak = t.nakshatra;
  const nakCard = card(
    'ฤกษ์ 27 (นักษัตรฤกษ์)',
    nak.candidates.length === 1
      ? `<p class="lead">ฤกษ์ที่ ${toThaiDigits(nak.candidates[0].n)}: <b>${esc(NAKSHATRA_NAMES[nak.candidates[0].n - 1])}</b>${r.input.time ? ` · บาทที่ ${toThaiDigits(nak.candidates[0].pada)}` : ''}</p>`
      : `<p class="lead">ไม่มีเวลาเกิด วันนั้นดวงจันทร์ผ่าน ${nak.candidates.length} ฤกษ์</p><ul class="alt-list">${nak.candidates
          .map((c) => `<li>ฤกษ์ที่ ${toThaiDigits(c.n)}: ${esc(NAKSHATRA_NAMES[c.n - 1])}</li>`)
          .join('')}</ul><p class="note">กรอกเวลาเกิดเพื่อให้ได้ฤกษ์เดียว</p>`,
    {
      kicker: 'จากตำแหน่งดวงจันทร์',
      convention: nak.convention,
      conventionExtra: ` · ชื่อฤกษ์ภาษาไทยและ 9 หมู่ฤกษ์ยังรอตรวจ ${unverifiedBadge()}`,
      story: 'นักษัตรฤกษ์ 27–28 กลุ่มดาวปรากฏในคัมภีร์อาถรรพเวทและไตตติรียสัมหิตาของอินเดียโบราณ',
    },
  );

  return [
    hero,
    taksaCard,
    colorsCard,
    signCard,
    chartCard,
    naksatCard,
    lekCard,
    mahaCard,
    r.input.time ? nakCard : nakCard + lockedCard('ฤกษ์ 27 แบบละเอียด (บาท)', 'เวลาเกิด'),
  ].join('');
}
