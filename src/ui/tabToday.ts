import { formatThaiDate } from '../lib/core';
import { PLANET_COLOR } from '../lib/thai/taksa';
import { THAI_WEEKDAYS, type ThaiPlanet } from '../lib/thai/thaiDay';
import { card, esc, swatch } from './components';
import type { Results } from './compute';
import { tarotCard } from './tabWestern';

export function renderToday(r: Results): string {
  const td = r.today;
  const dayPlanet = (td.weekday + 1) as ThaiPlanet;
  const c = PLANET_COLOR[dayPlanet];
  const kala = r.thai.lucky.kalakini;
  const isKalaToday = kala.planet === dayPlanet;

  const colorCard = card(
    `วัน${THAI_WEEKDAYS[td.weekday]}ที่ ${formatThaiDate(td.date)}`,
    `<p class="lead">สีประจำวันนี้ ${swatch(c.hex, c.name)}</p>
     <p>สีมงคลของคุณ: ${r.thai.lucky.good.map((g) => swatch(g.color.hex, g.color.name, g.bhumi)).join(' ')}</p>
     <p class="${isKalaToday ? 'warn' : 'note'}">สีกาลกิณีของคุณคือ${esc(kala.color.name)}${isKalaToday ? ' ซึ่งตรงกับสีประจำวันนี้ ถ้าอยากสบายใจลองเลือกสีมงคลแทน' : ''}</p>`,
    { kicker: 'สีเสื้อวันนี้', convention: r.thai.lucky.convention },
  );

  const daily = card(
    'ไพ่รายวัน 3 ใบ',
    `<div class="tarot-row">${td.cards.map((x, i) => tarotCard(x, ['อดีต', 'ปัจจุบัน', 'อนาคต'][i])).join('')}</div>
     <p class="note">ไพ่ชุดเดียวกันทั้งวันในทุกอุปกรณ์ โดยไม่ต้องเก็บข้อมูลใดๆ เปลี่ยนใหม่หลังเที่ยงคืนเวลาไทย</p>`,
    { kicker: 'แตะเพื่อพลิก', convention: { label: 'seed = hash(วันเกิด + วันนี้ Asia/Bangkok) → mulberry32 → สับไพ่ 78 ใบด้วย Fisher–Yates' } },
  );

  const al = td.almanac;
  const list = (xs: { zh: string; en: string }[]) =>
    xs.length ? xs.map((x) => `<li><span lang="zh">${esc(x.zh)}</span><small>${esc(x.en)}</small></li>`).join('') : '<li>—</li>';
  const almanacCard = card(
    'ปฏิทินจีนวันนี้',
    `<p class="lead" lang="zh">${esc(al.lunarText)} · 日 ${esc(al.dayGanzhi)} · ${esc(al.zhiXing)}日</p>
     <div class="yiji">
       <div><h4>宜 ควรทำ</h4><ul>${list(al.yi)}</ul></div>
       <div><h4>忌 ควรเลี่ยง</h4><ul>${list(al.ji)}</ul></div>
     </div>
     <p class="note" lang="zh">冲 ${esc(al.chong)} · 煞${esc(al.sha)}</p>`,
    { kicker: '宜忌 冲煞 建除', className: 'card-cinnabar', convention: { label: 'ปฏิทินจีนแบบ 黃曆 จาก lunar-javascript (คำแปลภาษาอังกฤษจากไลบรารี)' } },
  );

  return [colorCard, daily, almanacCard].join('');
}
