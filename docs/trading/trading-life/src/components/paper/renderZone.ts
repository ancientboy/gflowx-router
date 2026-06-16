import type { ZoneId } from '../../store/useGameStore';
import type { CharState } from '../../lib/constants';
import { OfficePath } from '../../lib/pathfinding';
import { ZONE_LAYOUTS } from '../../lib/zoneLayouts';
import { PAPER, worldToPaper } from '../../lib/zoneProjection';
import {
  rrect, dropShadow, drawDesk, drawBooth, drawAgentTop, drawNavArrow,
  drawDiningTable, drawMassageBed, drawRoundTable,
} from './paperDraw';

export interface PaperCamera {
  cw: number;
  ch: number;
  scale: number;
  panX: number;
  panY: number;
}

export function makePaperCamera(
  cw: number, ch: number, zoom: number, defaultZoom: number,
  panX: number, panY: number,
): PaperCamera {
  const base = Math.min(cw / PAPER.zoneW, ch / PAPER.zoneH) * 0.92;
  const scale = base * (zoom / defaultZoom);
  return { cw, ch, scale, panX, panY };
}

export function camToScreen(cam: PaperCamera, px: number, py: number) {
  const cx = PAPER.zoneW / 2 + cam.panX;
  const cy = PAPER.zoneH / 2 + cam.panY;
  return {
    x: cam.cw / 2 + (px - cx) * cam.scale,
    y: cam.ch / 2 + (py - cy) * cam.scale,
  };
}

export function screenToPaper(cam: PaperCamera, sx: number, sy: number) {
  const cx = PAPER.zoneW / 2 + cam.panX;
  const cy = PAPER.zoneH / 2 + cam.panY;
  return {
    x: cx + (sx - cam.cw / 2) / cam.scale,
    y: cy + (sy - cam.ch / 2) / cam.scale,
  };
}

function ws(cam: PaperCamera, v: number) {
  return v * cam.scale;
}

function drawTicker(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId, active: boolean) {
  const p = worldToPaper(zone, OfficePath.nodes.scr_ctr.x, OfficePath.nodes.scr_ctr.z);
  const s = camToScreen(cam, p.x, p.y);
  const w = ws(cam, 200), h = ws(cam, 36);
  dropShadow(ctx, s.x, s.y, w, h, 0.08);
  ctx.fillStyle = '#2a2a2a';
  rrect(ctx, s.x - w / 2, s.y - h / 2, w, h, ws(cam, 6));
  ctx.fill();
  ctx.fillStyle = active ? '#4285F4' : '#1a2535';
  rrect(ctx, s.x - w / 2 + ws(cam, 4), s.y - h / 2 + ws(cam, 4), w - ws(cam, 8), h - ws(cam, 8), ws(cam, 4));
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 ${Math.max(10, ws(cam, 11))}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('行情大屏', s.x, s.y + ws(cam, 4));
}

function drawCoffeeBar(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId) {
  const p = worldToPaper(zone, 22, 8.5);
  const s = camToScreen(cam, p.x, p.y);
  const w = ws(cam, 90), h = ws(cam, 40);
  dropShadow(ctx, s.x, s.y, w, h);
  ctx.fillStyle = '#fafafa';
  rrect(ctx, s.x - w / 2, s.y - h / 2, w, h, ws(cam, 8));
  ctx.fill();
  ctx.strokeStyle = '#e0d8cc'; ctx.lineWidth = 1; ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#8B6914';
    ctx.beginPath();
    ctx.ellipse(s.x - ws(cam, 20) + i * ws(cam, 20), s.y, ws(cam, 5), ws(cam, 4), 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawReceptionDesk(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId) {
  const p = worldToPaper(zone, OfficePath.nodes.recv_ctr.x, OfficePath.nodes.recv_ctr.z);
  const s = camToScreen(cam, p.x, p.y);
  const w = ws(cam, 160), h = ws(cam, 48);
  dropShadow(ctx, s.x, s.y, w, h);
  ctx.fillStyle = '#e8e0d4';
  rrect(ctx, s.x - w / 2, s.y - h / 2, w, h, ws(cam, 8));
  ctx.fill();
  ctx.fillStyle = '#3d3530';
  ctx.font = `600 ${Math.max(10, ws(cam, 12))}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('接待台', s.x, s.y + ws(cam, 4));
}

function drawHallScene(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId, agents: Record<string, CharState>) {
  const layout = ZONE_LAYOUTS.hall;
  const cx = cam.cw / 2, cy = cam.ch / 2;
  const hw = ws(cam, PAPER.zoneW * 0.48), hh = ws(cam, PAPER.zoneH * 0.42);
  ctx.fillStyle = layout.accent;
  rrect(ctx, cx - hw, cy - hh, hw * 2, hh * 2, ws(cam, 16));
  ctx.fill();

  drawTicker(ctx, cam, zone, Object.values(agents).some(a => a.state === 'trading' || a.state === 'scanning'));
  drawCoffeeBar(ctx, cam, zone);

  const deskIds = ['desk_xau', 'desk_maj', 'desk_alt', 'desk_new', 'desk_mom'];
  deskIds.forEach(id => {
    const n = OfficePath.nodes[id];
    const p = worldToPaper(zone, n.x, n.z);
    const s = camToScreen(cam, p.x, p.y + 20);
    const agent = Object.values(agents).find(a => OfficePath.deskByAgent[a.agentId] === id);
    const trading = agent?.state === 'trading' || agent?.state === 'scanning';
    drawDesk(ctx, s.x, s.y, cam.scale / 28, trading);
  });

  ['rest_l_1', 'rest_l_2'].forEach(id => {
    const n = OfficePath.nodes[id];
    const p = worldToPaper(zone, n.x, n.z);
    const s = camToScreen(cam, p.x, p.y);
    drawBooth(ctx, s.x, s.y, cam.scale / 28);
  });
}

function drawRestaurantScene(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId) {
  const layout = ZONE_LAYOUTS.restaurant;
  layout.facilities.forEach(f => {
    const s = camToScreen(cam, f.x, f.y);
    drawDiningTable(ctx, s.x, s.y, cam.scale / 28);
  });
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.font = `600 ${Math.max(10, ws(cam, 13))}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('点击餐桌派遣 Agent 用餐', cam.cw / 2, cam.ch - ws(cam, 24));
}

function drawSpaScene(ctx: CanvasRenderingContext2D, cam: PaperCamera) {
  ZONE_LAYOUTS.spa.facilities.forEach(f => {
    const s = camToScreen(cam, f.x, f.y);
    drawMassageBed(ctx, s.x, s.y, cam.scale / 28);
  });
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.font = `600 ${Math.max(10, ws(cam, 13))}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('点击按摩床派遣 Agent 放松', cam.cw / 2, cam.ch - ws(cam, 24));
}

function drawCasinoScene(ctx: CanvasRenderingContext2D, cam: PaperCamera) {
  const f = ZONE_LAYOUTS.casino.facilities[0];
  const s = camToScreen(cam, f.x, f.y);
  drawRoundTable(ctx, s.x, s.y, cam.scale / 28);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.font = `600 ${Math.max(10, ws(cam, 13))}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('点击牌桌派遣 Agent 打牌', cam.cw / 2, cam.ch - ws(cam, 24));
}

function drawReceptionScene(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId) {
  drawReceptionDesk(ctx, cam, zone);
}

export function renderZone(
  ctx: CanvasRenderingContext2D,
  zone: ZoneId,
  cam: PaperCamera,
  agents: Record<string, CharState>,
  opts: { selectedId: string | null; bob: number; dayMode: 'day' | 'night' },
) {
  const layout = ZONE_LAYOUTS[zone];
  ctx.fillStyle = opts.dayMode === 'day' ? layout.floorColor : '#2a2838';
  ctx.fillRect(0, 0, cam.cw, cam.ch);

  ctx.save();
  switch (zone) {
    case 'hall': drawHallScene(ctx, cam, zone, agents); break;
    case 'restaurant': drawRestaurantScene(ctx, cam, zone); break;
    case 'spa': drawSpaScene(ctx, cam); break;
    case 'casino': drawCasinoScene(ctx, cam); break;
    case 'reception': drawReceptionScene(ctx, cam, zone); break;
  }

  layout.navArrows.forEach(a => {
    const s = camToScreen(cam, a.x, a.y);
    drawNavArrow(ctx, s.x, s.y, a.label, a.dir, opts.bob);
  });

  layout.facilities.forEach(f => {
    const s = camToScreen(cam, f.x, f.y);
    if (opts.selectedId) {
      ctx.strokeStyle = 'rgba(212,175,55,0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(s.x, s.y, ws(cam, f.r), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  ctx.restore();
}

export function renderAgents(
  ctx: CanvasRenderingContext2D,
  zone: ZoneId,
  cam: PaperCamera,
  agents: Record<string, CharState>,
  visible: (c: CharState) => boolean,
  opts: { selectedId: string | null; bob: number; t: number },
) {
  Object.values(agents).forEach(char => {
    if (!visible(char)) return;
    const p = worldToPaper(zone, char.x, char.z);
    const s = camToScreen(cam, p.x, p.y);
    drawAgentTop(ctx, s.x, s.y, char.data.color, {
      selected: char.agentId === opts.selectedId,
      trading: char.state === 'trading' || char.state === 'scanning',
      resting: char.activity === 'rest' || char.activity === 'massage' || char.activity === 'dine' || char.activity === 'poker',
      walking: char.isWalking,
      t: opts.t,
    });
    if (char.agentId === opts.selectedId || char.isWalking) {
      ctx.fillStyle = '#3d3530';
      ctx.font = `600 ${Math.max(9, ws(cam, 10))}px Inter,sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(char.data.name.split(' ')[0], s.x, s.y - ws(cam, 22));
    }
  });
}
