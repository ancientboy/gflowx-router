import type { ZoneId } from '../store/useGameStore';

/** 大地图中心与默认视角 */
export const WORLD_MAP = {
  centerX: 28,
  centerZ: 15,
  overviewZoom: 30,
  zoneZoom: 48,
  minZoom: 22,
  maxZoom: 72,
  panBounds: { minX: -4, maxX: 60, minZ: -2, maxZ: 32 },
};

export const ZONE_CAMERA: Record<ZoneId, { x: number; z: number; label: string }> = {
  hall: { x: 14, z: 7.5, label: '交易大厅' },
  reception: { x: 14, z: 26, label: '前厅接待' },
  spa: { x: 42, z: 7.5, label: '按摩放松区' },
  restaurant: { x: 14, z: 20, label: '餐厅' },
  casino: { x: 42, z: 20, label: '德州扑克' },
};

/** 世界坐标休息包厢（更大卡座） */
export const WORLD_BOOTHS = [
  { id: 'rest_l_1', x: 4.2, z: 12.65, flip: false },
  { id: 'rest_l_2', x: 8.2, z: 12.78, flip: true },
];
