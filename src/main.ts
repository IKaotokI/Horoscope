import '@fontsource/chonburi/thai-400.css';
import '@fontsource/chonburi/latin-400.css';
import '@fontsource/sarabun/thai-400.css';
import '@fontsource/sarabun/latin-400.css';
import '@fontsource/sarabun/thai-600.css';
import '@fontsource/sarabun/latin-600.css';
import '@fontsource/mitr/thai-400.css';
import '@fontsource/mitr/latin-400.css';
import './styles.css';
import { PROVINCES } from './data/provinces';
import { esc } from './ui/components';
import { SCIENCES, scienceLevel } from './lib/sciences';
import { computeAll, filledFields, toBirthInput } from './ui/compute';
import { createGalaxy, type Galaxy } from './ui/galaxy';
import {
  type AppState, clearSaved, DEFAULT_CONVENTIONS, loadEffectsPref, loadSaved, saveEffectsPref, saveForm, type Tab,
} from './ui/state';
import { renderChinese } from './ui/tabChinese';
import { renderThai } from './ui/tabThai';
import { renderToday } from './ui/tabToday';
import { renderWestern } from './ui/tabWestern';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const saved = loadSaved();

const state: AppState = {
  form: saved?.form ?? { date: '', time: '', province: '', sex: '' },
  conv: saved?.conv ?? { ...DEFAULT_CONVENTIONS },
  tab: 'thai',
  wedChoice: 4,
  effects: loadEffectsPref() ?? !reducedMotion.matches,
  remember: !!saved,
};

const form = $<HTMLFormElement>('#birth-form');
const results = $<HTMLElement>('#results');
const panel = $<HTMLElement>('#tab-panel');
const provinceSel = $<HTMLSelectElement>('#f-province');
$<HTMLSelectElement>('#f-time').insertAdjacentHTML(
  'beforeend',
  Array.from({ length: 24 }, (_, h) => {
    const hh = String(h).padStart(2, '0');
    return `<option value="${hh}">${hh}:00 – ${hh}:59 น.</option>`;
  }).join(''),
);
provinceSel.insertAdjacentHTML(
  'beforeend',
  PROVINCES.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join(''),
);

function fillForm() {
  ($('#f-date') as HTMLInputElement).value = state.form.date;
  ($('#f-time') as HTMLSelectElement).value = state.form.time;
  provinceSel.value = state.form.province;
  ($('#f-sex') as HTMLSelectElement).value = state.form.sex;
  ($('#f-remember') as HTMLInputElement).checked = state.remember;
}

function readForm() {
  state.form = {
    date: ($('#f-date') as HTMLInputElement).value,
    time: ($('#f-time') as HTMLSelectElement).value,
    province: provinceSel.value,
    sex: ($('#f-sex') as HTMLSelectElement).value as AppState['form']['sex'],
  };
  state.remember = ($('#f-remember') as HTMLInputElement).checked;
}

// กาแล็กซี: สร้างหลัง first paint (lazy) — ระหว่างนั้นพื้นหลัง CSS ทำหน้าที่เป็นภาพนิ่ง
let galaxy: Galaxy | null = null;
const fxOn = () => state.effects && !reducedMotion.matches;

function updateStars() {
  const have = filledFields(state);
  const levels = Object.fromEntries(SCIENCES.map((s) => [s.id, scienceLevel(s, have)]));
  galaxy?.setLevels(levels);
  const full = Object.values(levels).filter((l) => l === 2).length;
  $<HTMLElement>('#galaxy-count').textContent = have.has('date')
    ? `ดาวสว่างเต็มที่ ${full}/${SCIENCES.length} ศาสตร์`
    : 'กรอกวันเกิดเพื่อจุดประกายดาว';
}

function pickScience(id: string, tab: Tab) {
  if (results.hidden) {
    $<HTMLInputElement>('#f-date').focus();
    return;
  }
  state.tab = tab;
  render();
  const target = document.getElementById(`card-${id}`) ?? results;
  target.scrollIntoView({ behavior: fxOn() ? 'smooth' : 'auto', block: 'start' });
}

const fxBtn = $<HTMLButtonElement>('#fx-toggle');
function applyEffects() {
  const on = state.effects && !reducedMotion.matches;
  document.documentElement.classList.toggle('fx-off', !on);
  fxBtn.setAttribute('aria-pressed', String(!state.effects));
  fxBtn.textContent = state.effects ? 'ปิดเอฟเฟกต์' : 'เปิดเอฟเฟกต์';
  galaxy?.setAnimated(on);
}
fxBtn.addEventListener('click', () => {
  state.effects = !state.effects;
  saveEffectsPref(state.effects);
  applyEffects();
});
reducedMotion.addEventListener('change', applyEffects);

const TABS: Record<Tab, (r: ReturnType<typeof computeAll>) => string> = {
  thai: (r) => renderThai(r, state),
  chinese: (r) => renderChinese(r, state),
  western: (r) => renderWestern(r),
  today: (r) => renderToday(r),
};

function render() {
  const input = toBirthInput(state);
  updateStars();
  const err = $<HTMLElement>('#form-error');
  if (!input) {
    results.hidden = true;
    err.textContent = state.form.date ? 'รองรับวันเกิดระหว่าง ค.ศ. 1900–2100' : '';
    return;
  }
  err.textContent = '';
  const r = computeAll(input, state);
  results.hidden = false;
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => {
    const on = b.dataset.tab === state.tab;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  panel.className = `tab-panel theme-${state.tab}`;
  panel.innerHTML = TABS[state.tab](r);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  readForm();
  saveForm(state);
  render();
  if (toBirthInput(state)) results.scrollIntoView({ behavior: fxOn() ? 'smooth' : 'auto' });
});

form.addEventListener('input', () => {
  readForm();
  updateStars();
});

form.addEventListener('change', (e) => {
  readForm();
  updateStars();
  if ((e.target as HTMLElement).id === 'f-remember') saveForm(state);
  if (!results.hidden) {
    saveForm(state);
    render();
  }
});

$('#clear-saved').addEventListener('click', () => {
  clearSaved();
  state.remember = false;
  state.form = { date: '', time: '', province: '', sex: '' };
  state.conv = { ...DEFAULT_CONVENTIONS };
  fillForm();
  render();
  $<HTMLElement>('#form-error').textContent = 'ลบข้อมูลที่จำไว้ในเครื่องนี้แล้ว';
});

document.querySelector('.tabs')!.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-tab]');
  if (!b) return;
  state.tab = b.dataset.tab as Tab;
  render();
});
document.querySelector('.tabs')!.addEventListener('keydown', (e) => {
  const k = (e as KeyboardEvent).key;
  if (k !== 'ArrowRight' && k !== 'ArrowLeft') return;
  const order: Tab[] = ['thai', 'chinese', 'western', 'today'];
  const i = order.indexOf(state.tab);
  state.tab = order[(i + (k === 'ArrowRight' ? 1 : 3)) % 4];
  render();
  document.querySelector<HTMLButtonElement>(`[data-tab="${state.tab}"]`)?.focus();
});

// ตัวควบคุมภายในผลลัพธ์ (สลับธรรมเนียม, พุธกลางวัน/คืน, พลิกไพ่)
panel.addEventListener('change', (e) => {
  const el = e.target as HTMLSelectElement;
  const key = el.dataset.conv as keyof AppState['conv'] | undefined;
  if (!key) return;
  if (key === 'trueSolarTime') state.conv.trueSolarTime = el.value === 'on';
  else (state.conv as unknown as Record<string, string>)[key] = el.value;
  saveForm(state);
  render();
});
panel.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const wed = t.closest<HTMLButtonElement>('[data-wed]');
  if (wed) {
    state.wedChoice = wed.dataset.wed === '8' ? 8 : 4;
    render();
    return;
  }
  const flip = t.closest<HTMLButtonElement>('[data-flip]');
  if (flip) flip.classList.toggle('is-flipped');
});

fillForm();
applyEffects();
render();
requestAnimationFrame(() =>
  setTimeout(() => {
    galaxy = createGalaxy($<HTMLElement>('#galaxy'), SCIENCES, (s) => pickScience(s.id, s.tab));
    applyEffects();
    updateStars();
  }, 0),
);
