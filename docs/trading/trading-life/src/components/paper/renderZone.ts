import type { ZoneId } from '../../store/useGameStore';
import type { CharState } from '../../lib/constants';
import { OfficePath } from '../../lib/pathfinding';
import { ZONE_LAYOUTS, type FacilityDef } from '../../lib/zoneLayouts';
import { PAPER, worldToPaper } from '../../lib/zoneProjection';
import {
  rrect, dropShadow, drawDesk, drawBooth, drawAgentTop, drawNavArrow,
  drawDiningTable, drawMassageBed, drawRoundTable, drawFacilityLabel,
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

function drawZoneAccent(ctx: CanvasRenderingContext2D, cam: PaperCamera, color: string) {
  const cx = cam.cw / 2, cy = cam.ch / 2;
  const hw = ws(cam, PAPER.zoneW * 0.46), hh = ws(cam, PAPER.zoneH * 0.4);
  ctx.fillStyle = color;
  rrect(ctx, cx - hw, cy - hh, hw * 2, hh * 2, ws(cam, 14));
  ctx.fill();
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
  const w = ws(cam, 100), h = ws(cam, 44);
  dropShadow(ctx, s.x, s.y, w, h);
  ctx.fillStyle = '#fafafa';
  rrect(ctx, s.x - w / 2, s.y - h / 2, w, h, ws(cam, 8));
  ctx.fill();
  ctx.strokeStyle = '#e0d8cc'; ctx.lineWidth = 1; ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#8B6914';
    ctx.beginPath();
    ctx.ellipse(s.x - ws(cam, 22) + i * ws(cam, 22), s.y, ws(cam, 6), ws(cam, 5), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  drawFacilityLabel(ctx, s.x, s.y + ws(cam, 32), '咖啡区', cam.scale);
}

function facilityPaperPos(zone: ZoneId, f: FacilityDef) {
  const n = OfficePath.nodes[f.nodeId];
  if (!n) return null;
  return worldToPaper(zone, n.x, n.z);
}

function drawFacility(
  ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId, f: FacilityDef,
  opts: { hoverId: string | null; occupied: boolean },
) {
  const p = facilityPaperPos(zone, f);
  if (!p) return;
  const s = camToScreen(cam, p.x, p.y);
  const sc = cam.scale;
  const hover = opts.hoverId === f.id;

  if (hover) {
    ctx.strokeStyle = 'rgba(212,175,55,0.55)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(s.x, s.y, ws(cam, f.r), 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  switch (f.action) {
    case 'dine': drawDiningTable(ctx, s.x, s.y, sc); break;
    case 'massage': drawMassageBed(ctx, s.x, s.y, sc); break;
    case 'poker': drawRoundTable(ctx, s.x, s.y, sc); break;
    case 'rest':
      if (f.nodeId.startsWith('rest_l')) drawBooth(ctx, s.x, s.y, sc);
      else {
        dropShadow(ctx, s.x, s.y, ws(cam, 140), ws(cam, 44));
        ctx.fillStyle = '#e8e0d4';
        rrect(ctx, s.x - ws(cam, 70), s.y - ws(cam, 22), ws(cam, 140), ws(cam, 44), ws(cam, 8));
        ctx.fill();
      }
      break;
  }

  if (opts.occupied) {
    ctx.fillStyle = 'rgba(72,208,147,0.25)';
    ctx.beginPath();
    ctx.arc(s.x + ws(cam, f.r * 0.6), s.y - ws(cam, f.r * 0.5), ws(cam, 6), 0, Math.PI * 2);
    ctx.fill();
  }
  drawFacilityLabel(ctx, s.x, s.y + ws(cam, f.r * 0.85), f.label, cam.scale, hover);
}

function drawHallScene(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId, agents: Record<string, CharState>) {
  drawZoneAccent(ctx, cam, ZONE_LAYOUTS.hall.accent);
  drawTicker(ctx, cam, zone, Object.values(agents).some(a => a.state === 'trading' || a.state === 'scanning'));
  drawCoffeeBar(ctx, cam, zone);

  const deskIds = Object.values(OfficePath.deskByAgent);
  const uniqueDesks = [...new Set(deskIds)];
  uniqueDesks.forEach(id => {
    const n = OfficePath.nodes[id];
    if (!n) return;
    const p = worldToPaper(zone, n.x, n.z);
    const s = camToScreen(cam, p.x, p.y + 18);
    const agent = Object.values(agents).find(a => OfficePath.deskByAgent[a.agentId] === id);
    const trading = agent?.state === 'trading' || agent?.state === 'scanning';
    drawDesk(ctx, s.x, s.y, cam.scale, trading);
  });
}

function drawLeisureScene(ctx: CanvasRenderingContext2D, cam: PaperCamera, zone: ZoneId, layout: typeof ZONE_LAYOUTS.restaurant, agents: Record<string, CharState>, hoverId: string | null) {
  drawZoneAccent(ctx, cam, layout.accent);
  layout.facilities.forEach(f => {
    const occupied = Object.values(agents).some(a =>
      a.activity === f.action && (
        OfficePath.dineByAgent[a.agentId] === f.nodeId
        || OfficePath.massageByAgent[a.agentId] === f.nodeId
        || OfficePath.pokerByAgent[a.agentId] === f.nodeId
        || OfficePath.boothByAgent[a.agentId] === f.nodeId
      ));
    drawFacility(ctx, cam, zone, f, { hoverId, occupied });
  });
}

function countInZone(agents: Record<string, CharState>, zone: ZoneId) {
  return Object.values(agents).filter(a => {
    if (a.activity === 'dine' && zone === 'restaurant') return true;
    if (a.activity === 'massage' && zone === 'spa') return true;
    if (a.activity === 'poker' && zone === 'casino') return true;
    if (a.activity === 'rest' && zone === 'hall') return true;
    return false;
  }).length;
}

export function renderZone(
  ctx: CanvasRenderingContext2D,
  zone: ZoneId,
  cam: PaperCamera,
  agents: Record<string, CharState>,
  opts: { hoverFacilityId: string | null; bob: number; dayMode: 'day' | 'night' },
) {
  const layout = ZONE_LAYOUTS[zone];
  ctx.fillStyle = opts.dayMode === 'day' ? layout.floorColor : '#2a2838';
  ctx.fillRect(0, 0, cam.cw, cam.ch);

  switch (zone) {
    case 'hall':
      drawHallScene(ctx, cam, zone, agents);
      drawLeisureScene(ctx, cam, zone, layout, agents, opts.hoverFacilityId);
      break;
    case 'restaurant':
    case 'spa':
    case 'casino':
    case 'reception':
      drawLeisureScene(ctx, cam, zone, layout, agents, opts.hoverFacilityId);
      break;
  }

  layout.navArrows.forEach(a => {
    const s = camToScreen(cam, a.x, a.y);
    drawNavArrow(ctx, s.x, s.y, a.label, a.dir, opts.bob);
  });

  const n = countInZone(agents, zone);
  if (n > 0) {
    ctx.fillStyle = 'rgba(61,53,48,0.45)';
    ctx.font = `600 ${Math.max(10, ws(cam, 11))}px Inter,sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`${n} 位 Agent 在此活动`, ws(cam, 12), cam.ch - ws(cam, 10));
  }
}

export function renderAgents(
  ctx: CanvasRenderingContext2D,
  zone: ZoneId,
  cam: PaperCamera,
  agents: Record<string, CharState>,
  visible: (c: CharState) => boolean,
  opts: { selectedId: string | null; t: number },
) {
  Object.values(agents).forEach(char => {
    if (!visible(char)) return;
    const p = worldToPaper(zone, char.x, char.z);
    const s = camToScreen(cam, p.x, p.y);
    drawAgentTop(ctx, s.x, s.y, char.data.color, {
      selected: char.agentId === opts.selectedId,
      trading: char.state === 'trading' || char.state === 'scanning',
      walking: char.isWalking,
      activity: char.activity,
      icon: char.data.icon,
      t: opts.t,
    });
    const showName = char.agentId === opts.selectedId || char.activity || char.isWalking;
    if (showName) {
      ctx.fillStyle = '#3d3530';
      ctx.font = `600 ${Math.max(9, ws(cam, 10))}px Inter,sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(char.data.name.split(' ')[0], s.x, s.y - ws(cam, 24));
    }
  });
}

/** 设施纸面坐标（供命中检测） */
export function getFacilityPaperPos(zone: ZoneId, f: FacilityDef) {
  return facilityPaperPos(zone, f);
}
