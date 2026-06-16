import { create } from 'zustand';
import type { AgentData, CameraMode, CharState, Personality, QualityTier } from '../lib/constants';
import { AGENT_META } from '../lib/constants';
import { OfficePath } from '../lib/pathfinding';

interface GameStore {
  cameraMode: CameraMode;
  quality: QualityTier;
  effectsOn: boolean;
  simSpeed: 1 | 5 | 20;
  selectedAgentId: string | null;
  panelTab: 'overview' | 'config' | 'soul';
  sidebarOpen: boolean;
  agents: Record<string, CharState>;
  ticker: Record<string, number>;
  overview: { total_pnl?: number; total_wr?: number; runner?: { running: boolean } };
  profileSchema: { key: string; label: string; type: string; min?: number; max?: number; step?: number }[];
  profileConfig: Record<string, unknown>;
  soulMd: string;
  setCameraMode: (m: CameraMode) => void;
  setQuality: (q: QualityTier) => void;
  setEffectsOn: (v: boolean) => void;
  setSimSpeed: (s: 1 | 5 | 20) => void;
  selectAgent: (id: string | null) => void;
  setPanelTab: (t: 'overview' | 'config' | 'soul') => void;
  toggleSidebar: () => void;
  initAgents: () => void;
  updateFromOverview: (data: { agents?: AgentData[]; total_pnl?: number; total_wr?: number; runner?: { running: boolean } }) => void;
  setTicker: (t: Record<string, number>) => void;
  setProfile: (schema: GameStore['profileSchema'], config: Record<string, unknown>, soul: string) => void;
  patchChar: (id: string, patch: Partial<CharState>) => void;
}

const starts: Record<string, { x: number; z: number }> = {
  xau: { x: 4.2, z: 5.6 }, major: { x: 7, z: 5.6 }, altcoin: { x: 9.8, z: 5.6 },
  newcoin: { x: 12.6, z: 5.6 }, momentum: { x: 15.4, z: 5.6 },
};

export const useGameStore = create<GameStore>((set, get) => ({
  cameraMode: 'ortho',
  quality: 'medium',
  effectsOn: true,
  simSpeed: 1,
  selectedAgentId: null,
  panelTab: 'overview',
  sidebarOpen: false,
  agents: {},
  ticker: {},
  overview: {},
  profileSchema: [],
  profileConfig: {},
  soulMd: '',

  setCameraMode: (m) => set({ cameraMode: m }),
  setQuality: (q) => set({ quality: q }),
  setEffectsOn: (v) => set({ effectsOn: v }),
  setSimSpeed: (s) => set({ simSpeed: s }),
  selectAgent: (id) => set({ selectedAgentId: id, panelTab: 'overview' }),
  setPanelTab: (t) => set({ panelTab: t }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  initAgents: () => {
    const agents: Record<string, CharState> = {};
    Object.entries(starts).forEach(([id, pos]) => {
      agents[id] = {
        agentId: id,
        x: pos.x, z: pos.z,
        pathQueue: [], pathIndex: 0, isWalking: false, destNode: null,
        activity: null, activityUntil: 0, state: 'idle', stress: 0,
        moveTimer: 0, nextMoveTime: 3000 + Math.random() * 5000,
        data: { ...AGENT_META[id] },
      };
    });
    set({ agents });
  },

  updateFromOverview: (data) => {
    const agents = { ...get().agents };
    (data.agents || []).forEach((a) => {
      if (!agents[a.id]) return;
      const stress = Math.min(100, Math.max(0, -(a.pnl || 0) / 20 + (a.is_circuit_break ? 40 : 0)));
      let state: CharState['state'] = 'idle';
      if (a.is_circuit_break) state = 'panic';
      else if (a.positions?.length) state = 'trading';
      else if (a.running) state = 'scanning';
      agents[a.id] = { ...agents[a.id], data: { ...agents[a.id].data, ...a }, stress, state };
    });
    set({ agents, overview: { total_pnl: data.total_pnl, total_wr: data.total_wr, runner: data.runner } });
  },

  setTicker: (t) => set({ ticker: t }),
  setProfile: (schema, config, soul) => set({ profileSchema: schema, profileConfig: config, soulMd: soul }),
  patchChar: (id, patch) => set(s => ({ agents: { ...s.agents, [id]: { ...s.agents[id], ...patch } } })),
}));

export function assignPath(char: CharState, nodeId: string): CharState {
  const pts = OfficePath.pathToNode(char.x, char.z, nodeId);
  if (pts.length < 2) return char;
  return {
    ...char,
    activity: null,
    activityUntil: 0,
    destNode: nodeId,
    pathQueue: pts.slice(1),
    pathIndex: 0,
    isWalking: true,
  };
}

export function pickWanderTarget(char: CharState): string {
  const desk = OfficePath.deskByAgent[char.agentId];
  if (char.state === 'trading') return desk;
  if (char.state === 'panic') return 'scr_ctr';
  if (char.stress > 60) {
    const r = Math.random();
    if (r > 0.5) return OfficePath.massageByAgent[char.agentId];
    if (r > 0.25) return OfficePath.dineByAgent[char.agentId];
    return OfficePath.pokerByAgent[char.agentId];
  }
  if (char.state === 'idle') {
    const r = Math.random();
    if (r > 0.7) return OfficePath.boothByAgent[char.agentId];
    if (r > 0.5) return OfficePath.massageByAgent[char.agentId];
    if (r > 0.3) return OfficePath.dineByAgent[char.agentId];
    if (r > 0.15) return OfficePath.pokerByAgent[char.agentId];
    if (r > 0.05) return 'recv_ctr';
    return desk;
  }
  return OfficePath.wanderTargets[Math.floor(Math.random() * OfficePath.wanderTargets.length)];
}

export function onPathComplete(char: CharState, now: number): CharState {
  const node = char.destNode;
  if (node === OfficePath.boothByAgent[char.agentId]) return startActivity(char, 'rest', now, 9000);
  if (node === OfficePath.massageByAgent[char.agentId]) return startActivity(char, 'massage', now, 10000);
  if (node === OfficePath.dineByAgent[char.agentId]) return startActivity(char, 'dine', now, 9000);
  if (node === OfficePath.pokerByAgent[char.agentId]) return startActivity(char, 'poker', now, 12000);
  return { ...char, destNode: null, isWalking: false, pathQueue: [] };
}

function startActivity(char: CharState, activity: CharState['activity'], now: number, dur: number): CharState {
  const seatMap: Record<string, Record<string, string>> = {
    rest: OfficePath.boothByAgent,
    massage: OfficePath.massageByAgent,
    dine: OfficePath.dineByAgent,
    poker: OfficePath.pokerByAgent,
  };
  const nodeId = seatMap[activity!]?.[char.agentId];
  const pos = nodeId ? OfficePath.nodes[nodeId] : null;
  return {
    ...char,
    activity,
    activityUntil: now + dur + Math.random() * 5000,
    isWalking: false,
    pathQueue: [],
    destNode: null,
    x: pos?.x ?? char.x,
    z: pos?.z ?? char.z,
    stress: activity === 'massage' ? Math.max(0, char.stress - 50) :
            activity === 'dine' ? Math.max(0, char.stress - 30) :
            activity === 'poker' ? 0 : char.stress,
  };
}
