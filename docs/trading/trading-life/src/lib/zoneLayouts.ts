import type { ZoneId } from '../store/useGameStore';

export interface NavArrowDef {
  x: number;
  y: number;
  dir: 'n' | 's' | 'e' | 'w';
  label: string;
  target: ZoneId;
}

export interface FacilityDef {
  id: string;
  /** 纸面坐标 */
  x: number;
  y: number;
  r: number;
  label: string;
  leisure?: 'dine' | 'massage' | 'poker';
}

export interface ZoneLayout {
  floorColor: string;
  accent: string;
  navArrows: NavArrowDef[];
  facilities: FacilityDef[];
}

/** 各分区纸面布局 — 仅渲染 activeZone 对应地图 */
export const ZONE_LAYOUTS: Record<ZoneId, ZoneLayout> = {
  hall: {
    floorColor: '#f5f0e8',
    accent: 'rgba(66,133,244,0.06)',
    navArrows: [
      { x: 360, y: 580, dir: 's', label: '餐厅', target: 'restaurant' },
      { x: 680, y: 280, dir: 'e', label: '按摩区', target: 'spa' },
      { x: 680, y: 420, dir: 'e', label: '德州扑克', target: 'casino' },
      { x: 360, y: 60, dir: 'n', label: '前厅', target: 'reception' },
    ],
    facilities: [],
  },
  reception: {
    floorColor: '#faf6ef',
    accent: 'rgba(180,160,120,0.08)',
    navArrows: [
      { x: 360, y: 560, dir: 's', label: '交易大厅', target: 'hall' },
    ],
    facilities: [],
  },
  restaurant: {
    floorColor: '#fff8eb',
    accent: 'rgba(255,180,80,0.08)',
    navArrows: [
      { x: 360, y: 80, dir: 'n', label: '交易大厅', target: 'hall' },
    ],
    facilities: [
      { id: 'dine_1', x: 200, y: 320, r: 44, label: '餐桌 A', leisure: 'dine' },
      { id: 'dine_2', x: 360, y: 320, r: 44, label: '餐桌 B', leisure: 'dine' },
      { id: 'dine_3', x: 520, y: 320, r: 44, label: '餐桌 C', leisure: 'dine' },
    ],
  },
  spa: {
    floorColor: '#f0ebf8',
    accent: 'rgba(155,89,182,0.08)',
    navArrows: [
      { x: 40, y: 320, dir: 'w', label: '交易大厅', target: 'hall' },
    ],
    facilities: [
      { id: 'bed_1', x: 180, y: 360, r: 50, label: '按摩床 1', leisure: 'massage' },
      { id: 'bed_2', x: 360, y: 360, r: 50, label: '按摩床 2', leisure: 'massage' },
      { id: 'bed_3', x: 540, y: 360, r: 50, label: '按摩床 3', leisure: 'massage' },
    ],
  },
  casino: {
    floorColor: '#f5efe6',
    accent: 'rgba(26,21,32,0.06)',
    navArrows: [
      { x: 40, y: 320, dir: 'w', label: '交易大厅', target: 'hall' },
    ],
    facilities: [
      { id: 'poker', x: 360, y: 340, r: 72, label: '德州牌桌', leisure: 'poker' },
    ],
  },
};
