import type { ZoneId } from '../store/useGameStore';

/** 各分区独立场景 — 本地坐标系，原点在房间中心 */
export const ZONE_META: Record<ZoneId, { label: string; floorColor: string; w: number; d: number }> = {
  hall: { label: '交易大厅', floorColor: '#f5f0e8', w: 22, d: 14 },
  reception: { label: '前厅接待', floorColor: '#faf6ef', w: 18, d: 10 },
  restaurant: { label: '餐厅', floorColor: '#fff8eb', w: 20, d: 14 },
  spa: { label: '按摩放松区', floorColor: '#f5eef8', w: 20, d: 14 },
  casino: { label: '德州扑克', floorColor: '#1e2838', w: 20, d: 14 },
};

export const HALL_DESKS: [number, number, number][] = [
  [-6, 0.5, -2], [-3, 0.5, -2], [0, 0.5, -2], [3, 0.5, -2], [6, 0.5, -2],
];

export const HALL_AGENT_START: Record<string, { x: number; z: number }> = {
  xau: { x: -6, z: -2 }, major: { x: -3, z: -2 }, altcoin: { x: 0, z: -2 },
  newcoin: { x: 3, z: -2 }, momentum: { x: 6, z: -2 },
};

/** 大厅休息包厢（本地坐标） */
export const HALL_BOOTHS: { id: string; x: number; z: number; label: string }[] = [
  { id: 'rest_l_1', x: -5.8, z: 5.15, label: '休息包厢 A' },
  { id: 'rest_l_2', x: 5.8, z: 5.15, label: '休息包厢 B' },
];

export const HALL_COFFEE = { x: 9, z: 1 };

export function agentDisplayZone(char: { activity: string | null }): ZoneId {
  if (char.activity === 'dine') return 'restaurant';
  if (char.activity === 'massage') return 'spa';
  if (char.activity === 'poker') return 'casino';
  return 'hall';
}

/** 休闲区展示位 */
export const LEISURE_SPOTS: Record<ZoneId, Record<string, { x: number; z: number }>> = {
  hall: {},
  reception: {},
  restaurant: {
    xau: { x: -4, z: 1 }, major: { x: 0, z: 1 }, altcoin: { x: 4, z: 1 },
    newcoin: { x: -4, z: 4 }, momentum: { x: 4, z: 4 },
  },
  spa: {
    xau: { x: -5, z: 0 }, major: { x: 0, z: 0 }, altcoin: { x: 5, z: 0 },
    newcoin: { x: -2.5, z: 3 }, momentum: { x: 2.5, z: 3 },
  },
  casino: {
    xau: { x: -3, z: -2 }, major: { x: 3, z: -2 }, altcoin: { x: -3, z: 2 },
    newcoin: { x: 3, z: 2 }, momentum: { x: 0, z: 3 },
  },
};

export const SIDEBAR_TO_ZONE: Partial<Record<string, ZoneId>> = {
  hall: 'hall',
  restaurant: 'restaurant',
  spa: 'spa',
  casino: 'casino',
};

export const ZONE_TO_RIGHT_TAB: Record<ZoneId, import('../store/useGameStore').RightTab> = {
  hall: 'hall',
  reception: 'npc',
  restaurant: 'facility',
  spa: 'facility',
  casino: 'facility',
};
