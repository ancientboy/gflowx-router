/** Canvas 2D 剪纸绘制工具 — 对齐灵犀 144 office-engine.js */

export function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function dropShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, a = 0.1) {
  ctx.fillStyle = `rgba(0,0,0,${a})`;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, w / 2, h / 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawDesk(
  ctx: CanvasRenderingContext2D, x: number, y: number, s: number,
  opts: { active?: boolean; chartSeed?: number; t?: number } = {},
) {
  const monitorActive = opts.active ?? false;
  const t = opts.t ?? 0;
  const seed = opts.chartSeed ?? 1;
  const dw = 118 * s, dh = 72 * s, r = 8 * s, side = 6 * s;
  dropShadow(ctx, x, y + side / 2, dw, dh);
  ctx.fillStyle = '#e2e2e2';
  ctx.beginPath();
  ctx.moveTo(x + dw / 2, y - dh / 2);
  ctx.lineTo(x + dw / 2, y + dh / 2);
  ctx.lineTo(x + dw / 2, y + dh / 2 + side);
  ctx.lineTo(x - dw / 2, y + dh / 2 + side);
  ctx.lineTo(x - dw / 2, y + dh / 2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fafafa';
  rrect(ctx, x - dw / 2, y - dh / 2, dw, dh, r); ctx.fill();
  ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1; ctx.stroke();

  const mw = 48 * s, mh = 30 * s;
  const mx = x - mw / 2, my = y - dh / 2 - mh - 5 * s;
  ctx.fillStyle = '#2a2a2a';
  rrect(ctx, mx, my, mw, mh, 4 * s); ctx.fill();
  ctx.fillStyle = monitorActive ? '#0a1520' : '#141820';
  rrect(ctx, mx + 2 * s, my + 2 * s, mw - 4 * s, mh - 4 * s, 3 * s); ctx.fill();
  drawMiniChart(ctx, mx + 3 * s, my + 3 * s, mw - 6 * s, mh - 6 * s, seed, t, monitorActive);
}

export function drawBooth(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const w = 200 * s, h = 130 * s;
  dropShadow(ctx, x, y, w, h, 0.08);
  ctx.fillStyle = '#c8baa8';
  rrect(ctx, x - w / 2, y - h / 2 - 20 * s, w, 28 * s, 6 * s); ctx.fill();
  ctx.fillStyle = '#8b7355';
  rrect(ctx, x - w / 2 + 12 * s, y - h / 2 + 20 * s, w - 24 * s, 36 * s, 8 * s); ctx.fill();
  ctx.fillStyle = '#d4c8b8';
  rrect(ctx, x - w / 2 + 20 * s, y - h / 2 + 8 * s, w - 40 * s, 14 * s, 4 * s); ctx.fill();
}

export type AgentFacing = 'n' | 's' | 'e' | 'w';
export type AgentActivity = 'rest' | 'massage' | 'dine' | 'poker' | null;

function drawMiniChart(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  seed: number, t: number, active: boolean,
) {
  const n = Math.max(6, Math.floor(w / 5));
  const scroll = active ? Math.floor(t * 3) % 3 : 0;
  for (let i = 0; i < n; i++) {
    const idx = i + scroll;
    const bull = ((seed + idx * 7) % 5) > 1;
    const bodyH = (3 + ((seed + idx * 13) % 7)) * (h / 14);
    const cx = x + (i + 0.5) * (w / n);
    const base = y + h * (0.35 + ((seed + idx) % 5) * 0.08) + Math.sin(t * 2 + idx + seed) * (active ? 1.2 : 0);
    ctx.strokeStyle = bull ? '#48D093' : '#56A3FF';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, base - bodyH);
    ctx.lineTo(cx, base + bodyH * 0.3);
    ctx.stroke();
    ctx.fillRect(cx - 1.2, base - bodyH, 2.4, bodyH);
  }
  if (active) {
    ctx.strokeStyle = 'rgba(72,208,147,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath();
    let ly = y + h * 0.5;
    for (let i = 0; i < n; i++) {
      const cx = x + (i + 0.5) * (w / n);
      const ny = y + h * (0.3 + ((seed + i * 3) % 4) * 0.12) + Math.sin(t * 4 + i) * 2;
      if (i === 0) ctx.moveTo(cx, ny); else ctx.lineTo(cx, ny);
      ly = ny;
    }
    ctx.stroke();
  }
}

/** 角色统一入口 — 根据朝向渲染正/背/侧面 */
export function drawAgent(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: {
    selected?: boolean; trading?: boolean; walking?: boolean; t?: number;
    activity?: AgentActivity; icon?: string; facing?: AgentFacing;
  },
) {
  const act = opts.activity;
  if (act === 'massage') {
    drawAgentTop(ctx, x, y, color, { ...opts, facing: 's' });
    return;
  }
  const facing = opts.facing ?? 's';
  if (facing === 'n') drawAgentBack(ctx, x, y, color, opts);
  else if (facing === 's') drawAgentFront(ctx, x, y, color, opts);
  else drawAgentSide(ctx, x, y, color, opts, facing);
}

/** 背面 — 圆头 + 后脑围巾横条 */
function drawAgentBack(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: { selected?: boolean; walking?: boolean; t?: number; activity?: AgentActivity },
) {
  const t = opts.t ?? 0;
  let bob = opts.walking ? Math.abs(Math.sin(t * 10)) * 3 : 0;
  const py = y + bob;
  if (opts.selected) {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, py, 18, 22, 0, 0, Math.PI * 2); ctx.stroke();
  }
  dropShadow(ctx, x, py + 6, 32, 36, 0.12);
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x, py + 2, 15, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, py - 10, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  drawActivityBadge(ctx, x, py, opts.activity, t);
}

/** 正面 — 圆脸 + 双眼 + 围巾 */
function drawAgentFront(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: {
    selected?: boolean; trading?: boolean; walking?: boolean; t?: number;
    activity?: AgentActivity; icon?: string;
  },
) {
  const t = opts.t ?? 0;
  let bob = 0;
  if (opts.walking) bob = Math.abs(Math.sin(t * 10)) * 3;
  else if (opts.trading) bob = Math.sin(t * 4) * 1.5;
  else if (opts.activity === 'dine') bob = Math.abs(Math.sin(t * 3)) * 1.5;
  const py = y + bob;

  if (opts.selected) {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, py, 18, 22, 0, 0, Math.PI * 2); ctx.stroke();
  }
  dropShadow(ctx, x, py + 6, 32, 36, 0.12);
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x, py + 2, 15, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x - 5, py - 2, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 5, py - 2, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(x - 5, py - 2, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, py - 2, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, py + 8, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
  if (opts.icon && !opts.activity) {
    ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(opts.icon, x, py + 12);
  }
  if (opts.trading) {
    ctx.fillStyle = '#4285F4';
    ctx.fillRect(x + 12, py - 12, 9, 6);
  }
  drawActivityBadge(ctx, x, py, opts.activity, t);
}

/** 侧面 */
function drawAgentSide(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: { selected?: boolean; walking?: boolean; t?: number; activity?: AgentActivity; icon?: string },
  facing: 'e' | 'w',
) {
  const t = opts.t ?? 0;
  const flip = facing === 'w' ? -1 : 1;
  const bob = opts.walking ? Math.abs(Math.sin(t * 10)) * 3 : 0;
  const py = y + bob;
  if (opts.selected) {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, py, 16, 22, 0, 0, Math.PI * 2); ctx.stroke();
  }
  dropShadow(ctx, x, py + 6, 28, 34, 0.12);
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x + flip * 2, py + 2, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x + flip * 6, py - 2, 2.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(x + flip * 6, py - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x + flip * 4, py + 6, 8, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  drawActivityBadge(ctx, x, py, opts.activity, t);
}

function drawActivityBadge(ctx: CanvasRenderingContext2D, x: number, py: number, act: AgentActivity | undefined, t: number) {
  ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  if (act === 'rest') ctx.fillText('💤', x + 14, py - 18 + Math.sin(t * 2) * 2);
  if (act === 'dine') ctx.fillText('🍽️', x + 15, py - 16 + Math.sin(t * 4) * 2);
  if (act === 'poker') {
    const chip = Math.floor(t * 2) % 3;
    ctx.fillText(['🃏', '🎲', '♠️'][chip], x + 14, py - 17);
  }
}

/** 俯视（按摩等） */
export function drawAgentTop(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: {
    selected?: boolean; walking?: boolean; t?: number;
    activity?: AgentActivity; facing?: AgentFacing;
  },
) {
  const t = opts.t ?? 0;
  const bob = opts.walking ? Math.abs(Math.sin(t * 10)) * 3 : Math.sin(t * 1.5) * 1;
  const py = y + bob;
  if (opts.selected) {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, py, 22, 0, Math.PI * 2); ctx.stroke();
  }
  dropShadow(ctx, x, py + 4, 28, 28, 0.12);
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x, py + 2, 18, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, py - 2, 12, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('✨', x + 14, py - 10 + Math.sin(t * 5) * 2);
}

/** 大型滚动行情屏 */
export function drawMarketBigScreen(
  ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  items: { label: string; price: string; up?: boolean }[], t: number, s: number,
) {
  dropShadow(ctx, x, y, w, h, 0.1);
  ctx.fillStyle = '#1e1e22';
  rrect(ctx, x - w / 2, y - h / 2, w, h, 10 * s); ctx.fill();
  ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#4285F4';
  rrect(ctx, x - w / 2, y - h / 2, w, 22 * s, 10 * s); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${Math.max(11, 13 * s)}px Inter,sans-serif`; ctx.textAlign = 'left';
  ctx.fillText('实时行情', x - w / 2 + 12 * s, y - h / 2 + 15 * s);

  const rowH = 26 * s;
  const innerH = h - 28 * s;
  const totalH = items.length * rowH;
  const scroll = totalH > innerH ? (t * 28) % totalH : 0;

  ctx.save();
  rrect(ctx, x - w / 2 + 6 * s, y - h / 2 + 24 * s, w - 12 * s, innerH, 6 * s);
  ctx.clip();

  for (let pass = 0; pass < 2; pass++) {
    items.forEach((item, i) => {
      const ry = y - h / 2 + 28 * s + i * rowH - scroll + pass * totalH;
      if (ry < y - h / 2 + 20 * s || ry > y + h / 2 - 4 * s) return;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent';
      ctx.fillRect(x - w / 2 + 8 * s, ry - rowH * 0.35, w - 16 * s, rowH);
      ctx.fillStyle = '#9ab0c8';
      ctx.font = `600 ${Math.max(10, 12 * s)}px Inter,sans-serif`; ctx.textAlign = 'left';
      ctx.fillText(item.label, x - w / 2 + 14 * s, ry + 4 * s);
      ctx.fillStyle = item.up === false ? '#56A3FF' : '#48D093';
      ctx.font = `700 ${Math.max(10, 12 * s)}px monospace`; ctx.textAlign = 'right';
      ctx.fillText(item.price, x + w / 2 - 14 * s, ry + 4 * s);
    });
  }
  ctx.restore();
}

/** 咖啡休息区 */
export function drawCoffeeZone(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, t: number) {
  const cw = 130 * s, ch = 52 * s;
  dropShadow(ctx, x, y, cw, ch, 0.09);
  ctx.fillStyle = '#f5f0e8';
  rrect(ctx, x - cw / 2, y - ch / 2, cw, ch, 10 * s); ctx.fill();
  ctx.strokeStyle = '#ddd4c8'; ctx.lineWidth = 1; ctx.stroke();
  // 咖啡机
  ctx.fillStyle = '#4a4a4a';
  rrect(ctx, x - cw / 2 + 8 * s, y - 16 * s, 28 * s, 32 * s, 4 * s); ctx.fill();
  ctx.fillStyle = '#666';
  rrect(ctx, x - cw / 2 + 12 * s, y - 12 * s, 20 * s, 8 * s, 2 * s); ctx.fill();
  // 杯列
  for (let i = 0; i < 4; i++) {
    const cx = x - cw / 2 + 48 * s + i * 18 * s;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(cx, y + 4 * s, 6 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8B6914';
    ctx.beginPath(); ctx.ellipse(cx, y + 2 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();
    if (i === 0) {
      ctx.strokeStyle = 'rgba(180,180,180,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, y - 4 * s);
      ctx.quadraticCurveTo(cx + 3 * s, y - 10 * s - Math.sin(t * 3) * 2, cx - 2 * s, y - 12 * s);
      ctx.stroke();
    }
  }
  drawFacilityLabel(ctx, x, y + ch / 2 + 14 * s, '☕ 咖啡区', s);
}

/** 紧凑型分区导航箭头 */
export function drawNavArrow(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, dir: 'n' | 's' | 'e' | 'w', bob: number) {
  const py = y + Math.sin(bob * 2.5) * 2;
  const w = 68, h = 26;
  ctx.fillStyle = 'rgba(255,252,247,0.92)';
  ctx.strokeStyle = 'rgba(212,175,55,0.75)'; ctx.lineWidth = 1;
  rrect(ctx, x - w / 2, py - h / 2, w, h, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  const ax = x - 22, ay = py;
  const s = 5;
  if (dir === 's') { ctx.moveTo(ax, ay + s); ctx.lineTo(ax - s, ay - s); ctx.lineTo(ax + s, ay - s); }
  else if (dir === 'n') { ctx.moveTo(ax, ay - s); ctx.lineTo(ax - s, ay + s); ctx.lineTo(ax + s, ay + s); }
  else if (dir === 'e') { ctx.moveTo(ax + s, ay); ctx.lineTo(ax - s, ay - s); ctx.lineTo(ax - s, ay + s); }
  else { ctx.moveTo(ax - s, ay); ctx.lineTo(ax + s, ay - s); ctx.lineTo(ax + s, ay + s); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a5048'; ctx.font = '600 11px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(label, x + 6, py + 4);
}

export function drawFacilityLabel(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, scale: number, hover = false) {
  ctx.font = `600 ${Math.max(9, 10 * scale)}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = hover ? '#3d3530' : 'rgba(61,53,48,0.55)';
  ctx.fillText(label, x, y);
}

export function drawRoundTable(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  dropShadow(ctx, x, y, 80 * s, 80 * s);
  ctx.fillStyle = '#c9b896';
  ctx.beginPath(); ctx.ellipse(x, y, 55 * s, 38 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a8f62';
  ctx.beginPath(); ctx.ellipse(x, y, 38 * s, 26 * s, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawMassageBed(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  dropShadow(ctx, x, y, 90 * s, 40 * s);
  ctx.fillStyle = '#c4a882';
  rrect(ctx, x - 45 * s, y - 12 * s, 90 * s, 24 * s, 5 * s); ctx.fill();
  ctx.fillStyle = '#fff';
  rrect(ctx, x - 40 * s, y - 9 * s, 80 * s, 18 * s, 4 * s); ctx.fill();
}

export function drawDiningTable(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  dropShadow(ctx, x, y, 60 * s, 60 * s);
  ctx.fillStyle = '#d4c8b8';
  ctx.beginPath(); ctx.ellipse(x, y, 28 * s, 28 * s, 0, 0, Math.PI * 2); ctx.fill();
}
