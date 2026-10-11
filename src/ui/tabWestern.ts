import { BIORHYTHM_CYCLES, biorhythm } from '../lib/western/cycles';
import { LIFE_PATH_MEANING, PERSONAL_YEAR_MEANING } from '../lib/western/numerology';
import type { TarotCard } from '../lib/western/tarot';
import { SIGN_GLYPHS, SIGN_KEYWORDS, SIGNS_EN, SIGNS_TH } from '../lib/western/zodiac';
import { biorhythmChart, chartWheel } from './charts';
import { card, esc, lockedCard } from './components';
import type { Results } from './compute';

/** การ์ดทาโรต์พลิก 3D — ยังไม่ใช้ภาพ RWS จนกว่าจะตรวจลิขสิทธิ์ในไทย (CLAUDE.md §8) */
export function tarotCard(c: TarotCard, label: string, flipped = false): string {
  return `<button type="button" class="tarot${flipped ? ' is-flipped' : ''}" data-flip aria-label="พลิกไพ่ ${esc(label)}">
    <span class="tarot-inner">
      <span class="tarot-back" aria-hidden="true"><span>✦</span></span>
      <span class="tarot-front">
        <span class="tarot-num">${esc(c.numeral)}</span>
        <span class="tarot-name">${esc(c.en)}</span>
        <span class="tarot-th">${esc(c.th)}</span>
        <span class="tarot-kw">${esc(c.keywords)}</span>
      </span>
    </span>
    <span class="tarot-label">${esc(label)}</span>
  </button>`;
}

export function renderWestern(r: Results): string {
  const w = r.western;
  const signLine = (sign: number) => `${SIGN_GLYPHS[sign]} ${SIGNS_TH[sign]} (${SIGNS_EN[sign]})`;

  const sunCard = card(
    `${SIGN_GLYPHS[w.sun.sign]} ราศี${SIGNS_TH[w.sun.sign]}`,
    `<div class="compare">
       <div class="is-on"><small>ราศีสากล (Tropical)</small><b>${esc(signLine(w.sun.sign))}</b></div>
       <div><small>ราศีไทย (Sidereal ลาหิรี)</small><b>${esc(signLine(r.thai.sunSign.sign))}</b></div>
     </div>
     <p>${esc(SIGN_KEYWORDS[w.sun.sign])}</p>
     ${w.sun.alternatives.length ? `<p class="note">วันเกิดตรงกับวันที่ดวงอาทิตย์ย้ายราศี ถ้าไม่รู้เวลาอาจเป็น${w.sun.alternatives.map((a) => esc(signLine(a))).join(' / ')}</p>` : ''}
     <p class="note">ราศีสากลกับราศีไทยเป็นคนละระบบ ต่างกันราว 24° จึงมักต่างกันหนึ่งราศี</p>`,
    {
      id: 'card-zodiac',
      kicker: 'Sun sign',
      convention: w.sun.convention,
      story: '12 ราศีเริ่มจากแผ่นดินเหนียว MUL.APIN ของบาบิโลน ต่อมาชาวกรีก-อียิปต์เพิ่มดวงชะตาส่วนบุคคล ลัคนา และ 12 ภพ และ Tetrabiblos ของปโตเลมี (ศตวรรษที่ 2) เป็นตำราอ้างอิงอยู่ราว 17 ศตวรรษ',
    },
  );

  const moonCard = card(
    `☽ จันทร์ราศี${SIGNS_TH[w.moon.sign]}`,
    `<p class="lead">Moon sign: <b>${esc(signLine(w.moon.sign))}</b></p>
     ${w.moon.alternatives.length ? `<p class="warn">ดวงจันทร์ย้ายราศีในวันเกิด อาจเป็น${w.moon.alternatives.map((a) => esc(signLine(a))).join(' / ')} กรอกเวลาเกิดเพื่อให้แน่นอน</p>` : ''}`,
    { kicker: 'อารมณ์และโลกภายใน', convention: w.moon.convention },
  );

  const asc = w.chart.ascendant;
  const ascCard = asc
    ? card(
        `ASC ${SIGN_GLYPHS[asc.sign]} ${SIGNS_TH[asc.sign]}`,
        `<p class="lead">ลัคนาสากล (Rising): <b>${esc(signLine(asc.sign))}</b> ${(asc.lon % 30).toFixed(1)}°</p>`,
        { kicker: 'Rising sign', convention: { label: 'ASC = atan2(cos RAMC, −(sin RAMC·cos ε + tan φ·sin ε)) แบบ Tropical' } },
      )
    : lockedCard('ลัคนาสากล (Rising)', 'เวลาและจังหวัดเกิด');

  const wheelCard = card('วงล้อ 12 ราศี', chartWheel(w.chart, 'western'), { kicker: 'ตำแหน่งดาวขณะเกิด', convention: w.chart.convention });

  const lp = w.lifePath;
  const numCard = card(
    `Life Path ${lp.display}`,
    `<p class="big-num">${esc(lp.display)}</p>
     <p>${esc(LIFE_PATH_MEANING[lp.value])}</p>
     <ul class="facts">
       <li><span>Birthday number</span><b>${w.birthday}</b></li>
       <li><span>Personal Year ${r.today.date.y}</span><b>${w.personalYear} — ${esc(PERSONAL_YEAR_MEANING[w.personalYear])}</b></li>
     </ul>`,
    {
      id: 'card-numerology',
      kicker: 'เลขศาสตร์จากวันเกิด',
      convention: lp.convention,
      conventionExtra: ' · Personal Year = r(r(เดือน) + r(วัน) + r(ปีปัจจุบัน)) เปลี่ยนวันที่ 1 ม.ค.',
      story: 'การแปลงตัวอักษรเป็นตัวเลข (gematria/isopsephy) เป็นของโบราณ แต่คำว่า "numerology" เพิ่งปรากฏในภาษาอังกฤษราวปี 1907 การโยงกับพีทาโกรัสเป็นการอ้างย้อนหลัง',
    },
  );

  const tarot = card(
    'ไพ่ทาโรต์ประจำวันเกิด',
    `<div class="tarot-row">
       ${tarotCard(w.tarot.personality, 'Personality')}
       ${w.tarot.soul.index !== w.tarot.personality.index ? tarotCard(w.tarot.soul, 'Soul') : ''}
       ${tarotCard(w.yearCard, `ไพ่ประจำปี ${r.today.date.y}`)}
     </div>
     <p class="note">แตะไพ่เพื่อพลิก</p>`,
    {
      id: 'card-tarot',
      kicker: 'ไพ่ยิปซี Major Arcana',
      convention: w.tarot.convention,
      story: 'ไพ่ทาโรต์เริ่มจากไพ่ trionfi ของอิตาลีราวปี 1440 (ชุด Visconti-Sforza ปิดทอง) เพิ่งใช้ทำนายในปารีสช่วงทศวรรษ 1780 ส่วนชุดปี 1909 ภาพของ Pamela Colman Smith เป็นชุดแรกที่ไพ่ Minor มีภาพเล่าเรื่องครบทุกใบ',
    },
  );

  const bio = biorhythm(w.biorhythmDays);
  const bioCard = card(
    'ไบโอริทึม',
    `${biorhythmChart(w.biorhythmDays)}
     <ul class="bio-legend">${bio
       .map((b) => `<li class="bio-${b.key}"><span></span>${esc(b.th)} (${b.days} วัน) <b>${b.value >= 0 ? '+' : ''}${Math.round(b.value * 100)}%</b></li>`)
       .join('')}</ul>
     <p class="note">ไบโอริทึมเป็น pseudoscience งานวิจัยหลายชิ้นหักล้างแล้ว ดูเพื่อความบันเทิงเท่านั้น</p>`,
    {
      id: 'card-cycles',
      kicker: `วันที่ ${w.biorhythmDays.toLocaleString('th-TH')} นับจากวันเกิด`,
      convention: { label: `sin(2πt / ${BIORHYTHM_CYCLES.map((c) => c.days).join(' | ')}) โดย t = จำนวนวันเต็มตามปฏิทิน Asia/Bangkok` },
      story: 'Wilhelm Fliess เพื่อนของฟรอยด์เสนอรอบ 23/28 วัน ต่อมา Teltscher เพิ่มรอบ 33 วัน และกลายเป็นแฟชั่นในทศวรรษ 1970',
    },
  );

  const tz = w.tzolkin;
  const tzCard = card(
    `${tz.num} ${tz.name}`,
    `<p class="lead">วันเกิดในปฏิทิน Tzolk'in ของมายา: <b>${tz.num} ${esc(tz.name)}</b></p>`,
    { kicker: "Tzolk'in 260 วัน", convention: { label: 'GMT correlation 584283 · d = JDN − 584283' } },
  );

  return [sunCard, moonCard, ascCard, wheelCard, numCard, tarot, bioCard, tzCard].join('');
}
