import { create } from 'zustand';
import type { AgentData, CameraMode, CharState, QualityTier, TradeRecord } from '../lib/constants';
import { AGENT_META } from '../lib/constants';
import { OfficePath } from '../lib/pathfinding';

export type RightTab = 'hall' | 'object' | 'agent' | 'npc' | 'facility' | 'assets' | 'strategy' | 'messages';
export type SidebarAction = 'hall' | 'agents' | 'strategy' | 'positions' | 'restaurant' | 'spa' | 'casino' | 'warehouse' | 'social' | 'logs';
export type ModalId = 'workshop' | 'strategy' | 'market' | 'rank' | 'settings' | 'help' | 'dine' | 'massage' | 'poker' | null;
export type ZoneId = 'hall' | 'reception' | 'spa' | 'restaurant' | 'casino';

const ZONE_CAMERA: Record<ZoneId, { x: number; z: number; zoom: number }> = {
  hall: { x: 14, z: 7.5, zoom: 38 },
  reception: { x: 14, z: 24, zoom: 42 },
  spa: { x: 42, z: 7.5, zoom: 38 },
  restaurant: { x: 14, z: 20, zoom: 40 },
  casino: { x: 42, z: 20, zoom: 40 },
};

interface GameStore {
  cameraMode: CameraMode;
  quality: QualityTier;
  effectsOn: boolean;
  simSpeed: 1 | 5 | 20;
  paused: boolean;
  dayMode: 'day' | 'night';
  selectedAgentId: string | null;
  selectedNpcId: string | null;
  selectedFacility: string | null;
  panelTab: 'overview' | 'config' | 'soul';
  rightTab: RightTab;
  rightPanelCollapsed: boolean;
  leftSidebarExpanded: boolean;
  minimalUi: boolean;
  sidebarActive: string;
  activeModal: ModalId;
  cameraFocus: { x: number; z: number; zoom: number } | null;
  followAgentId: string | null;
  agents: Record<string, CharState>;
  ticker: Record<string, number>;
  overview: {
    total_pnl?: number; total_wr?: number; total_capital?: number;
    total_initial?: number; total_pnl_pct?: number; total_trades?: number;
    runner?: { running: boolean };
  };
  tradeFeed: { agentId: string; agentName: string; trade: TradeRecord }[];
  profileSchema: { key: string; label: string; type: string; min?: number; max?: number; step?: number }[];
  profileConfig: Record<string, unknown>;
  soulMd: string;
  messages: { text: string; time: string }[];

  setCameraMode: (m: CameraMode) => void;
  setQuality: (q: QualityTier) => void;
  setEffectsOn: (v: boolean) => void;
  setSimSpeed: (s: 1 | 5 | 20) => void;
  togglePause: () => void;
  setDayMode: (d: 'day' | 'night') => void;
  selectAgent: (id: string | null) => void;
  selectNpc: (id: string | null) => void;
  selectFacility: (f: string | null) => void;
  setPanelTab: (t: 'overview' | 'config' | 'soul') => void;
  setRightTab: (t: RightTab) => void;
  toggleRightPanel: () => void;
  setLeftSidebarExpanded: (v: boolean) => void;
  toggleMinimalUi: () => void;
  setSidebarActive: (id: string) => void;
  navigateSidebar: (action: SidebarAction) => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  flyToZone: (zone: ZoneId) => void;
  resetCamera: () => void;
  setFollowAgent: (id: string | null) => void;
  initAgents: () => void;
  updateFromOverview: (data: {
    agents?: AgentData[];
    total_pnl?: number; total_wr?: number; total_capital?: number;
    total_initial?: number; total_pnl_pct?: number; total_trades?: number;
    runner?: { running: boolean };
  }) => void;
  setTicker: (t: Record<string, number>) => void;
  setProfile: (schema: GameStore['profileSchema'], config: Record<string, unknown>, soul: string) => void;
  patchChar: (id: string, patch: Partial<CharState>) => void;
  addMessage: (text: string) => void;
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
  paused: false,
  dayMode: 'day',
  selectedAgentId: null,
  selectedNpcId: null,
  selectedFacility: null,
  panelTab: 'overview',
  rightTab: 'hall',
  rightPanelCollapsed: false,
  leftSidebarExpanded: false,
  minimalUi: false,
  sidebarActive: 'hall',
  activeModal: null,
  cameraFocus: null,
  followAgentId: null,
  agents: {},
  ticker: {},
  overview: {},
  tradeFeed: [],
  profileSchema: [],
  profileConfig: {},
  soulMd: '',
  messages: [],

  setCameraMode: (m) => set({ cameraMode: m }),
  setQuality: (q) => set({ quality: q }),
  setEffectsOn: (v) => set({ effectsOn: v }),
  setSimSpeed: (s) => set({ simSpeed: s }),
  togglePause: () => set(s => ({ paused: !s.paused })),
  setDayMode: (d) => set({ dayMode: d }),
  selectAgent: (id) => set({ selectedAgentId: id, selectedNpcId: null, selectedFacility: null, rightTab: 'agent', panelTab: 'overview', rightPanelCollapsed: false }),
  selectNpc: (id) => set({ selectedNpcId: id, selectedAgentId: null, selectedFacility: null, rightTab: 'npc', rightPanelCollapsed: false }),
  selectFacility: (f) => set({ selectedFacility: f, selectedAgentId: null, selectedNpcId: null, rightTab: 'facility', rightPanelCollapsed: false }),
  setPanelTab: (t) => set({ panelTab: t }),
  setRightTab: (t) => set({ rightTab: t }),
  toggleRightPanel: () => set(s => ({ rightPanelCollapsed: !s.rightPanelCollapsed })),
  setLeftSidebarExpanded: (v) => set({ leftSidebarExpanded: v }),
  toggleMinimalUi: () => set(s => ({ minimalUi: !s.minimalUi })),
  setSidebarActive: (id) => set({ sidebarActive: id }),

  navigateSidebar: (action) => {
    const s = get();
    const expand = { rightPanelCollapsed: false };
    switch (action) {
      case 'hall':
        set({ ...expand, sidebarActive: 'hall', rightTab: 'hall', cameraFocus: ZONE_CAMERA.hall, followAgentId: null });
        break;
      case 'agents': {
        const firstId = s.selectedAgentId || Object.keys(s.agents)[0] || null;
        set({ ...expand, sidebarActive: 'agents', rightTab: 'agent', selectedAgentId: firstId, activeModal: 'workshop' });
        break;
      }
      case 'strategy':
        set({ ...expand, sidebarActive: 'strategy', rightTab: 'strategy', activeModal: 'strategy' });
        break;
      case 'positions':
        set({ ...expand, sidebarActive: 'positions', rightTab: 'assets' });
        break;
      case 'restaurant':
        set({ ...expand, sidebarActive: 'restaurant', cameraFocus: ZONE_CAMERA.restaurant, followAgentId: null });
        break;
      case 'spa':
        set({ ...expand, sidebarActive: 'spa', cameraFocus: ZONE_CAMERA.spa, followAgentId: null });
        break;
      case 'casino':
        set({ ...expand, sidebarActive: 'casino', cameraFocus: ZONE_CAMERA.casino, followAgentId: null });
        break;
      case 'logs':
        set({ ...expand, sidebarActive: 'logs', rightTab: 'messages' });
        break;
      case 'warehouse':
        set({ ...expand, sidebarActive: 'warehouse', rightTab: 'assets' });
        break;
      case 'social':
        set({ ...expand, sidebarActive: 'social', rightTab: 'hall' });
        break;
      default:
        break;
    }
  },
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  flyToZone: (zone) => set({ cameraFocus: ZONE_CAMERA[zone], sidebarActive: zone, followAgentId: null }),
  resetCamera: () => set({ cameraFocus: ZONE_CAMERA.hall, followAgentId: null }),
  setFollowAgent: (id) => set({ followAgentId: id, selectedAgentId: id, rightPanelCollapsed: false }),

  initAgents: () => {
    const agents: Record<string, CharState> = {};
    Object.entries(starts).forEach(([id, pos]) => {
      agents[id] = {
        agentId: id, x: pos.x, z: pos.z,
        pathQueue: [], pathIndex: 0, isWalking: false, destNode: null,
        activity: null, activityUntil: 0, state: 'idle', stress: 0,
        moveTimer: 0, nextMoveTime: 3000 + Math.random() * 5000,
        data: { ...AGENT_META[id] },
      };
    });
    set({ agents });
  },

  updateFromOverview: (data) => {
    const prev = get();
    const agents = { ...prev.agents };
    const tradeFeed: GameStore['tradeFeed'] = [];

    (data.agents || []).forEach((a) => {
      if (!agents[a.id]) return;
      const stress = Math.min(100, Math.max(0, -(a.pnl || 0) / 20 + (a.is_circuit_break ? 40 : 0)));
      let state: CharState['state'] = 'idle';
      if (a.is_circuit_break) state = 'panic';
      else if (a.positions?.length) state = 'trading';
      else if (a.running) state = 'scanning';
      agents[a.id] = { ...agents[a.id], data: { ...agents[a.id].data, ...a }, stress, state };
      (a.trades_history || []).slice(0, 20).forEach(trade => {
        tradeFeed.push({ agentId: a.id, agentName: a.name || agents[a.id].data.name, trade });
      });
    });

    tradeFeed.sort((a, b) => {
      const ta = a.trade.closed_at || a.trade.opened_at || '';
      const tb = b.trade.closed_at || b.trade.opened_at || '';
      return tb.localeCompare(ta);
    });

    const selectedAgentId = prev.selectedAgentId || Object.keys(agents)[0] || null;

    set({
      agents,
      selectedAgentId,
      tradeFeed: tradeFeed.slice(0, 80),
      overview: {
        total_pnl: data.total_pnl,
        total_wr: data.total_wr,
        total_capital: data.total_capital,
        total_initial: (data as { total_initial?: number }).total_initial,
        total_pnl_pct: (data as { total_pnl_pct?: number }).total_pnl_pct,
        total_trades: (data as { total_trades?: number }).total_trades,
        runner: data.runner,
      },
    });
  },

  setTicker: (t) => set({ ticker: t }),
  setProfile: (schema, config, soul) => set({ profileSchema: schema, profileConfig: config, soulMd: soul }),
  patchChar: (id, patch) => set(s => ({ agents: { ...s.agents, [id]: { ...s.agents[id], ...patch } } })),
  addMessage: (text) => set(s => ({ messages: [...s.messages.slice(-49), { text, time: new Date().toLocaleTimeString() }] })),
}));

export function assignPath(char: CharState, nodeId: string): CharState {
  const pts = OfficePath.pathToNode(char.x, char.z, nodeId);
  if (pts.length < 2) return char;
  return { ...char, activity: null, activityUntil: 0, destNode: nodeId, pathQueue: pts.slice(1), pathIndex: 0, isWalking: true };
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
    rest: OfficePath.boothByAgent, massage: OfficePath.massageByAgent,
    dine: OfficePath.dineByAgent, poker: OfficePath.pokerByAgent,
  };
  const nodeId = seatMap[activity!]?.[char.agentId];
  const pos = nodeId ? OfficePath.nodes[nodeId] : null;
  return {
    ...char, activity, activityUntil: now + dur + Math.random() * 5000,
    isWalking: false, pathQueue: [], destNode: null,
    x: pos?.x ?? char.x, z: pos?.z ?? char.z,
    stress: activity === 'massage' ? Math.max(0, char.stress - 50) :
            activity === 'dine' ? Math.max(0, char.stress - 30) :
            activity === 'poker' ? 0 : char.stress,
  };
}
