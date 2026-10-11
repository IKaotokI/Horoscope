import { beYear, formatThaiDate } from '../lib/core';
import type { Pillar } from '../lib/chinese/bazi';
import {
  BRANCH_ANIMAL_TH, BRANCH_EMOJI, BRANCHES, branchElement, chongKindFor, chongOfYear, ELEMENT_TH, ELEMENT_ZH,
  type Element, isYang, liuhai, liuhe, sanhe, STEMS, stemElement, yearElementByLastDigit, yearStem,
} from '../lib/chinese/ganzhi';
import { KUA_TRIGRAM, kuaGroup } from '../lib/chinese/kua';
import { baguaSvg } from './charts';
import { card, esc, lockedCard, select } from './components';
import type { Results } from './compute';
import type { AppState } from './state';

const animal = (b: number) => `${BRANCH_EMOJI[b]} ${BRANCH_ANIMAL_TH[b]}`;

const CHONG_LABEL = { direct: 'ชงตรง', self: 'ชงตัวเอง', shared: 'ชงร่วม' } as const;

function pillarCol(title: string, p: Pillar | undefined, alt?: Pillar): string {
  if (!p) return `<div class="pillar is-empty"><p class="pillar-title">${esc(title)}</p><p class="pillar-lock">ต้องมีเวลาเกิด</p></div>`;
  const se = stemElement(p.stem);
  const be = branchElement(p.branch);
  return `<div class="pillar">
    <p class="pillar-title">${esc(title)}</p>
    <p class="glyph el-${se}" title="${esc(ELEMENT_TH[se])} ${isYang(p.stem) ? 'หยาง' : 'หยิน'}">${STEMS[p.stem]}</p>
    <p class="glyph el-${be}" title="${esc(ELEMENT_TH[be])}">${BRANCHES[p.branch]}</p>
    <p class="pillar-sub">${esc(ELEMENT_TH[se])}/${esc(ELEMENT_TH[be])}</p>
    ${alt ? `<p class="pillar-alt">หรือ ${STEMS[alt.stem]}${BRANCHES[alt.branch]}</p>` : ''}
  </div>`;
}

export function renderChinese(r: Results, s: AppState): string {
  const c = r.chinese;
  const z = c.zodiac;
  const el = yearElementByLastDigit(z.year);

  const zodiacCard = card(
    BRANCH_ANIMAL_TH[z.branch],
    `<p class="zodiac-big" aria-hidden="true">${BRANCH_EMOJI[z.branch]}</p>
     <p class="lead">ปีนักษัตรจีน: <b>${esc(BRANCH_ANIMAL_TH[z.branch])}</b> ธาตุ${esc(ELEMENT_TH[el])} (${STEMS[yearStem(z.year)]}${BRANCHES[z.branch]} ปี ${z.year})</p>
     ${z.byLichun !== z.byCny || z.explain
       ? `<div class="compare">
           <div class="${z.boundary === 'lichun' ? 'is-on' : ''}"><small>ตามลิบชุน ${esc(formatThaiDate(z.lichunDate))}</small><b>${esc(animal(z.byLichun))}</b></div>
           <div class="${z.boundary === 'cny' ? 'is-on' : ''}"><small>ตามตรุษจีน ${esc(formatThaiDate(z.cnyDate))}</small><b>${esc(animal(z.byCny))}</b></div>
         </div>`
       : ''}
     ${z.explain ? `<p class="note">${esc(z.explain)}</p>` : ''}`,
    {
      id: 'card-naksat',
      kicker: '12 นักษัตรและธาตุ',
      convention: z.convention,
      conventionExtra: select('chineseYear', s.conv.chineseYear, [
        ['lichun', 'ลิบชุน 立春 (ค่าตั้งต้น)'],
        ['cny', 'ตรุษจีน'],
      ], 'เปลี่ยนปีที่'),
      story: 'ตำนานการแข่งขันของเง็กเซียน: หนูขี่หลังวัวเข้าเส้นชัยก่อน แล้วผลักแมวตกน้ำ สัตว์ทั้ง 12 ถูกใช้เป็นสัญลักษณ์ของกิ่งดินเป็นมาตรฐานในสมัยฮั่น',
    },
  );

  const cy = c.currentYear;
  const ch = chongOfYear(cy.branch);
  const mine = chongKindFor(z.branch, cy.branch);
  const chongCard = card(
    `ปีชง ${beYear(cy.year)}`,
    `<p class="lead">ปี ${beYear(cy.year)} เป็นปี${esc(BRANCH_ANIMAL_TH[cy.branch])} — คุณ${mine ? `อยู่ในกลุ่ม <b>${CHONG_LABEL[mine]}</b>` : '<b>ไม่อยู่ในกลุ่มปีชง</b>'}</p>
     <ul class="chong-list">
       <li><span class="tag tag-direct">ชงตรง</span> ${esc(animal(ch.direct))}</li>
       <li><span class="tag tag-self">ชงตัวเอง</span> ${esc(animal(ch.self))} <small>(บางสื่อนับเป็นชงร่วม)</small></li>
       <li><span class="tag tag-shared">ชงร่วม</span> ${ch.shared.map((b) => esc(animal(b))).join(' · ')}</li>
     </ul>
     <p class="note">ปีชงเป็นความเชื่อ ไม่จำเป็นต้องซื้อของหรือจ่ายเงินแก้ชง ใช้เป็นเครื่องเตือนใจให้ใช้ชีวิตไม่ประมาทก็พอ</p>`,
    {
      kicker: 'ปีชงแบบไทย',
      convention: { label: 'ชงตรง = กิ่งตรงข้าม, ชงร่วม = กลุ่ม 子午卯酉 / 寅申巳亥 / 辰戌丑未 เดียวกัน (อนุมานจากรายการที่สื่อไทยเผยแพร่)', unverified: true },
    },
  );

  const b = z.branch;
  const relCard = card(
    'คู่สัมพันธ์นักษัตร',
    `<ul class="facts">
      <li><span>三合 สามประสาน</span><b>${sanhe(b).map((x) => esc(animal(x))).join(' · ')}</b></li>
      <li><span>六合 คู่มิตร</span><b>${esc(animal(liuhe(b)))}</b></li>
      <li><span>六害 คู่ขัด</span><b>${esc(animal(liuhai(b)))}</b></li>
      <li><span>冲 คู่ชง</span><b>${esc(animal((b + 6) % 12))}</b></li>
    </ul>`,
    { kicker: 'ตารางมาตรฐาน', convention: { label: '三合 (b±4), 六合 (13−b) mod 12, 六害 (19−b) mod 12 ตามตารางมาตรฐาน' } },
  );

  const bz = c.bazi;
  const total = Object.values(bz.elements).reduce((a, v) => a + v, 0);
  const elOrder: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const dm = bz.dayMaster;
  const baziCard = card(
    r.input.time ? 'ปาจื้อ 4 เสา 8 อักษร' : 'ปาจื้อ 3 เสา',
    `<div class="pillars" dir="rtl">
      ${pillarCol('ปี 年', bz.year, bz.yearAlt)}
      ${pillarCol('เดือน 月', bz.month, bz.monthAlt)}
      ${pillarCol('วัน 日', bz.day)}
      ${pillarCol('ยาม 時', bz.hour)}
    </div>
    <p class="lead">ธาตุประจำตัว (Day Master): <b class="el-text-${stemElement(dm)}">${STEMS[dm]} ${esc(ELEMENT_TH[stemElement(dm)])}${isYang(dm) ? 'หยาง' : 'หยิน'}</b></p>
    <div class="element-bars">${elOrder
      .map(
        (e) => `<div class="el-row"><span>${ELEMENT_ZH[e]} ${esc(ELEMENT_TH[e])}</span><span class="bar"><span class="fill el-bg-${e}" style="width:${total ? (bz.elements[e] / total) * 100 : 0}%"></span></span><b>${bz.elements[e]}</b></div>`,
      )
      .join('')}</div>
    ${bz.yearAlt || bz.monthAlt ? '<p class="note">วันเกิดตรงกับวันเปลี่ยน 節 เสาที่มี "หรือ" จะชัดเมื่อกรอกเวลาเกิด</p>' : ''}
    ${bz.usedTime?.solarOffsetMin !== undefined ? `<p class="note">เวลาสุริยะจริง ${String(bz.usedTime.time.h).padStart(2, '0')}:${String(bz.usedTime.time.mi).padStart(2, '0')} (ต่างจากนาฬิกา ${bz.usedTime.solarOffsetMin} นาที)</p>` : ''}
    <p class="note">สมดุลธาตุนับจากอักษรที่เห็น (ยังไม่รวมก้านแฝง 藏干)</p>`,
    {
      id: 'card-bazi',
      kicker: 'เรียงขวาไปซ้าย ลงสีตามธาตุ',
      className: 'card-cinnabar',
      convention: bz.convention,
      conventionExtra:
        select('ziHour', s.conv.ziHour, [
          ['nextDay', '23:00 = วันถัดไป (ค่าตั้งต้น)'],
          ['sameDay', '23:00–24:00 = วันเดิม'],
        ], 'ยามจื่อ') +
        (r.input.place
          ? select('trueSolarTime', s.conv.trueSolarTime ? 'on' : 'off', [
              ['on', 'ใช้ true solar time'],
              ['off', 'ใช้เวลานาฬิกา'],
            ], 'เวลา')
          : ''),
      story: 'ก้านฟ้ากิ่งดินปรากฏบนกระดูกเสี่ยงทายสมัยซาง หลี่ซวีจง (ถัง) ดูดวงด้วย 3 เสา ต่อมาสวีจื่อผิง (ซ่ง) เพิ่มยามเกิดเป็น 4 เสา 8 อักษร จึงเรียกวิชานี้ว่า 子平法',
    },
  );

  const kuaBody = (k: number, who: string) => {
    const t = KUA_TRIGRAM[k];
    return `<div class="kua-item">${baguaSvg(k)}<p class="lead">${esc(who)} Kua <b>${k}</b> ${t.zh} · กลุ่ม${kuaGroup(k) === 'east' ? 'ตะวันออก (1 3 4 9)' : 'ตะวันตก (2 6 7 8)'}</p><p class="note">ทิศประจำตรีแกรม: ${esc(t.direction)}</p></div>`;
  };
  const sex = r.input.sex;
  const kuaCard = card(
    'เลข Kua 八宅',
    sex
      ? kuaBody(sex === 'male' ? c.kua.male : c.kua.female, sex === 'male' ? 'เพศชาย' : 'เพศหญิง')
      : `<p class="note">ไม่ได้ระบุเพศกำเนิด จึงแสดงทั้งสองแบบ</p><div class="kua-pair">${kuaBody(c.kua.male, 'ถ้าเป็นชาย')}${kuaBody(c.kua.female, 'ถ้าเป็นหญิง')}</div>`,
    {
      id: 'card-kua',
      kicker: 'ฮวงจุ้ยแปดทิศ',
      convention: { label: `r = ปีลิบชุน (${c.kua.lichunYear}) mod 9; ชาย (11−r) mod 9, หญิง (r+4) mod 9; ได้ 5 → ชาย 2 / หญิง 8 · ตารางทิศดี/ร้ายทั้ง 8 ยังรอตรวจ จึงยังไม่แสดง` },
    },
  );

  const dy = bz.daYun;
  const daYunCard = dy
    ? card(
        '大運 วัยจรสิบปี',
        `<p class="lead">นับ${dy.forward ? 'เดินหน้า' : 'ถอยหลัง'} · เริ่มวัยจรแรกเมื่ออายุ ${dy.startYears} ปี ${dy.startMonths} เดือน ${dy.startDays} วัน</p>
         <ol class="dayun">${dy.periods
           .map((p) => {
             const st = STEMS.indexOf(p.ganzhi[0]);
             const br = BRANCHES.indexOf(p.ganzhi[1]);
             return `<li><span class="el-text-${stemElement(st)}">${esc(p.ganzhi[0])}</span><span class="el-text-${branchElement(br)}">${esc(p.ganzhi[1])}</span><small>${p.startYear}</small></li>`;
           })
           .join('')}</ol>
         ${!r.input.time ? '<p class="note">ไม่มีเวลาเกิด อายุเริ่มวัยจรคลาดเคลื่อนได้ราว 2 เดือน</p>' : ''}`,
        {
          kicker: 'ต้องรู้เพศกำเนิด',
          className: 'card-cinnabar',
          convention: { label: 'ชายปีหยางหรือหญิงปีหยินนับเดินหน้า · อายุเริ่ม = จำนวนวันถึง 節 ÷ 3 (lunar-javascript)' },
        },
      )
    : lockedCard('大運 วัยจรสิบปี', 'เพศกำเนิด');

  return [
    zodiacCard,
    chongCard,
    relCard,
    baziCard,
    r.input.time ? '' : lockedCard('เสายาม (เสาที่ 4)', 'เวลาเกิด'),
    kuaCard,
    daYunCard,
  ].join('');
}
