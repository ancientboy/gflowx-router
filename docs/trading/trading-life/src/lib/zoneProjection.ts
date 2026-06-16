import type { ZoneId } from '../store/useGameStore';
import { ZONE_CAMERA } from './worldMap';
import { ZONES } from './pathfinding';

/** 纸面分区画布尺寸（对齐 office-engine 比例） */
export const PAPER = {
  zoneW: 720,
  zoneH: 640,
  /** 世界单位 → 纸面像素 */
  ppu: 28,
};

export function worldToPaper(zone: ZoneId, wx: number, wz: number) {
  const cam = ZONE_CAMERA[zone];
  return {
    x: PAPER.zoneW / 2 + (wx - cam.x) * PAPER.ppu,
    y: PAPER.zoneH / 2 + (wz - cam.z) * PAPER.ppu,
  };
}

export function localToPaper(lx: number, lz: number) {
  return {
    x: PAPER.zoneW / 2 + lx * PAPER.ppu,
    y: PAPER.zoneH / 2 + lz * PAPER.ppu,
  };
}

export function paperToWorld(zone: ZoneId, px: number, py: number) {
  const cam = ZONE_CAMERA[zone];
  return {
    x: cam.x + (px - PAPER.zoneW / 2) / PAPER.ppu,
    z: cam.z + (py - PAPER.zoneH / 2) / PAPER.ppu,
  };
}

const INTENT_ZONE: Record<string, ZoneId> = {
  dine: 'restaurant',
  massage: 'spa',
  poker: 'casino',
  rest: 'hall',
};

/** Agent 是否应在当前分区画布中显示 */
export function agentVisibleInZone(
  char: { x: number; z: number; activity: string | null; travelIntent?: string | null },
  zone: ZoneId,
): boolean {
  if (char.activity === 'dine' && zone === 'restaurant') return true;
  if (char.activity === 'massage' && zone === 'spa') return true;
  if (char.activity === 'poker' && zone === 'casino') return true;
  if (char.activity === 'rest' && zone === 'hall') return true;
  if (char.travelIntent && INTENT_ZONE[char.travelIntent] === zone) return true;
  const meta = ZONES.find(z => z.id === zone);
  if (!meta) return false;
  const hw = meta.w / 2, hd = meta.d / 2;
  return char.x >= meta.x - hw && char.x <= meta.x + hw
    && char.z >= meta.z - hd && char.z <= meta.z + hd;
}
