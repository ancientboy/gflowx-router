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

export function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, monitorActive = false) {
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
  const mw = 42 * s, mh = 26 * s;
  ctx.fillStyle = '#2a2a2a';
  rrect(ctx, x - mw / 2, y - dh / 2 - mh - 4 * s, mw, mh, 4 * s); ctx.fill();
  ctx.fillStyle = monitorActive ? '#4285F4' : '#1a1a1a';
  rrect(ctx, x - mw / 2 + 3, y - dh / 2 - mh - 1, mw - 6, mh - 6, 3 * s); ctx.fill();
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

export function drawAgentTop(
  ctx: CanvasRenderingContext2D, x: number, y: number, color: string,
  opts: { selected?: boolean; trading?: boolean; resting?: boolean; walking?: boolean; t?: number },
) {
  const t = opts.t ?? 0;
  const bob = opts.walking ? Math.abs(Math.sin(t * 10)) * 3 : opts.trading ? Math.sin(t * 4) * 2 : 0;
  const py = y + bob;
  if (opts.selected) {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, py, 22, 0, Math.PI * 2); ctx.stroke();
  }
  dropShadow(ctx, x, py + 4, 28, 28, 0.12);
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(x, py, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, py - 6, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  if (opts.trading) {
    ctx.fillStyle = '#4285F4';
    ctx.fillRect(x + 10, py - 14, 10, 7);
  }
  if (opts.resting) {
    ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('💤', x + 14, py - 16);
  }
}

export function drawNavArrow(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, dir: 'n' | 's' | 'e' | 'w', bob: number) {
  const py = y + Math.sin(bob * 2.5) * 4;
  ctx.fillStyle = 'rgba(255,252,247,0.96)';
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
  rrect(ctx, x - 52, py - 28, 104, 56, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  const ax = x, ay = py - 6;
  if (dir === 's') { ctx.moveTo(ax, ay + 14); ctx.lineTo(ax - 12, ay - 4); ctx.lineTo(ax + 12, ay - 4); }
  else if (dir === 'n') { ctx.moveTo(ax, ay - 14); ctx.lineTo(ax - 12, ay + 4); ctx.lineTo(ax + 12, ay + 4); }
  else if (dir === 'e') { ctx.moveTo(ax + 14, ay); ctx.lineTo(ax - 4, ay - 12); ctx.lineTo(ax - 4, ay + 12); }
  else { ctx.moveTo(ax - 14, ay); ctx.lineTo(ax + 4, ay - 12); ctx.lineTo(ax + 4, ay + 12); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3d3530'; ctx.font = '600 13px Inter,sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(label, x, py + 22);
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
