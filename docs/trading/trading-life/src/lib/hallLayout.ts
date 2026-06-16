import { p2 } from './constants';

/** 交易大厅工位布局 — 多行带屏操作台 */
export const HALL_DESK_ROWS: { id: string; label?: string }[][] = [
  [
    { id: 'desk_xau' }, { id: 'desk_maj' }, { id: 'desk_alt' },
    { id: 'desk_new' }, { id: 'desk_mom' },
  ],
  [
    { id: 'desk_r2_a' }, { id: 'desk_r2_b' }, { id: 'desk_r2_c' },
    { id: 'desk_r2_d' }, { id: 'desk_r2_e' },
  ],
];

/** 第二排工位（视觉 + 扩展 Agent 可用） */
export const HALL_ROW2_NODES: Record<string, { x: number; z: number }> = {
  desk_r2_a: p2(420, 680),
  desk_r2_b: p2(700, 680),
  desk_r2_c: p2(980, 680),
  desk_r2_d: p2(1260, 680),
  desk_r2_e: p2(1540, 680),
};

/** 咖啡区世界坐标 */
export const HALL_COFFEE = { x: 3.8, z: 9.2 };

export function ensureHallRow2Nodes(nodes: Record<string, { x: number; z: number }>) {
  Object.assign(nodes, HALL_ROW2_NODES);
}

/** 工位 K 线风格 seed（按 Agent / 工位区分动画） */
export function deskChartSeed(deskId: string, agentId?: string): number {
  let h = 0;
  const s = agentId || deskId;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
