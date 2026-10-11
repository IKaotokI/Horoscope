// ชิ้นส่วน HTML ที่ใช้ร่วมกัน — ทุกค่าที่ไม่ใช่ HTML ต้องผ่าน esc()
import type { Convention } from '../lib/core';

export const esc = (v: unknown): string =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const unverifiedBadge = () =>
  '<span class="badge badge-warn" title="ข้อมูลส่วนนี้ยังไม่ได้ตรวจกับตำราต้นฉบับ">ยังไม่ยืนยัน</span>';

export function conventionLine(c: Convention, extra = ''): string {
  return `<p class="convention"><span class="convention-label">ธรรมเนียมที่ใช้</span> ${esc(c.label)}${
    c.unverified ? ` ${unverifiedBadge()}` : ''
  }${extra}</p>`;
}

export interface CardOpts {
  id?: string;
  kicker?: string;
  convention?: Convention;
  conventionExtra?: string;
  /** เกร็ดประวัติสำหรับเล่าเรื่อง (CLAUDE.md §6) */
  story?: string;
  className?: string;
  locked?: string;
}

export function card(title: string, body: string, o: CardOpts = {}): string {
  return `<section class="card ${o.className ?? ''}"${o.id ? ` id="${o.id}"` : ''}>
    <header class="card-head">${o.kicker ? `<p class="kicker">${esc(o.kicker)}</p>` : ''}<h3>${esc(title)}</h3></header>
    <div class="card-body">${body}</div>
    ${o.convention ? conventionLine(o.convention, o.conventionExtra ?? '') : ''}
    ${o.story ? `<details class="story"><summary>เกร็ดประวัติ</summary><p>${esc(o.story)}</p></details>` : ''}
  </section>`;
}

/** การ์ดที่ยังล็อกอยู่ เพราะต้องกรอกข้อมูลเพิ่ม (progressive unlock) */
export function lockedCard(title: string, need: string): string {
  return `<section class="card card-locked"><header class="card-head"><h3>${esc(title)}</h3></header>
    <p class="locked-msg"><span aria-hidden="true">🔒</span> กรอก${esc(need)}เพื่อปลดล็อก</p></section>`;
}

export function select<T extends string>(
  name: string,
  value: T,
  options: [T, string][],
  label: string,
): string {
  return `<label class="inline-select"><span>${esc(label)}</span><select data-conv="${esc(name)}">${options
    .map(([v, t]) => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(t)}</option>`)
    .join('')}</select></label>`;
}

export const swatch = (hex: string, name: string, sub = '') =>
  `<span class="swatch"><span class="swatch-dot" style="background:${esc(hex)}"></span><span>${esc(name)}${
    sub ? `<small>${esc(sub)}</small>` : ''
  }</span></span>`;
