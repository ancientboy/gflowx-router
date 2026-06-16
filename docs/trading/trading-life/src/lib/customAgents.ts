import { p2 } from './constants';
import type { AgentMeta } from './constants';

/** 自定义 Agent 可分配的额外工位 */
export const EXTRA_DESK_NODES = ['desk_extra_1', 'desk_extra_2', 'desk_extra_3'] as const;
const LEISURE_POOL = {
  booth: ['rest_l_1', 'rest_l_2'],
  massage: ['bed_1', 'bed_2', 'bed_3'],
  dine: ['dine_1', 'dine_2', 'dine_3'],
  poker: ['poker_1', 'poker_2', 'poker_3'],
};

const CUSTOM_KEY = 'trading-life-custom-agents';

export interface CustomAgentDraft {
  name: string;
  icon: string;
  color: string;
  desc: string;
  strategy: string;
  market: string;
  interval: string;
  risk: string;
}

export function loadCustomAgentMeta(): Record<string, AgentMeta> {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomAgentMeta(all: Record<string, AgentMeta>) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
}

/** 注册自定义 Agent 到寻路图（工位 + 休闲位） */
export function registerCustomAgentSlots(
  OfficePath: {
    nodes: Record<string, { x: number; z: number }>;
    deskByAgent: Record<string, string>;
    boothByAgent: Record<string, string>;
    massageByAgent: Record<string, string>;
    dineByAgent: Record<string, string>;
    pokerByAgent: Record<string, string>;
    _edges: Record<string, string[]> | null;
  },
  agentId: string,
  index: number,
): string | null {
  const deskNode = EXTRA_DESK_NODES.find(n => !Object.values(OfficePath.deskByAgent).includes(n));
  if (!deskNode) return null;

  if (!OfficePath.nodes.desk_extra_1) {
    OfficePath.nodes.desk_extra_1 = p2(1820, 560);
    OfficePath.nodes.desk_extra_2 = p2(1960, 560);
    OfficePath.nodes.desk_extra_3 = p2(2100, 560);
    OfficePath._edges = null;
  }

  const i = index % 3;
  OfficePath.deskByAgent[agentId] = deskNode;
  OfficePath.boothByAgent[agentId] = LEISURE_POOL.booth[i];
  OfficePath.massageByAgent[agentId] = LEISURE_POOL.massage[i];
  OfficePath.dineByAgent[agentId] = LEISURE_POOL.dine[i];
  OfficePath.pokerByAgent[agentId] = LEISURE_POOL.poker[i];
  return deskNode;
}

export function ensureExtraDeskEdges(
  OfficePath: {
    nodes: Record<string, { x: number; z: number }>;
    _edges: Record<string, string[]> | null;
    _buildEdges: () => Record<string, string[]>;
  },
) {
  if (!OfficePath.nodes.desk_extra_1) return;
  const edges = OfficePath._buildEdges();
  const pairs: [string, string][] = [
    ['a_mom', 'desk_extra_1'], ['desk_extra_1', 'desk_extra_2'], ['desk_extra_2', 'desk_extra_3'],
    ['desk_extra_3', 'a_e'], ['desk_extra_1', 'u_ctr'],
  ];
  pairs.forEach(([a, b]) => {
    if (edges[a] && !edges[a].includes(b)) edges[a].push(b);
    if (edges[b] && !edges[b].includes(a)) edges[b].push(a);
  });
}

export function nextCustomAgentId(existing: Record<string, unknown>): string {
  let n = 1;
  while (existing[`custom_${n}`]) n++;
  return `custom_${n}`;
}

export const APPEARANCE_PRESETS = {
  icons: ['🤖', '🦊', '🐧', '🚀', '⚡', '🎯', '💎', '🌟', '🎲', '🧠'],
  colors: ['#FFD700', '#3B82F6', '#F59E0B', '#A855F7', '#EF4444', '#10B981', '#EC4899', '#06B6D4', '#6366F1', '#E67E22'],
};
