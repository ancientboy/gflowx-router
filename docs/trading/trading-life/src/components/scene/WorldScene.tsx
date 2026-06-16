import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { ZONES } from '../../lib/pathfinding';
import { InstancedBoxes, InstancedBeds } from './furniture/InstancedFurniture';
import { Gugugaga } from './characters/Gugugaga';
import { useGameStore } from '../../store/useGameStore';
import type { CharState } from '../../lib/constants';

function Wall({ x, z, w, d, h = 1.8 }: { x: number; z: number; w: number; d: number; h?: number }) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshToonMaterial color="#c8baa8" />
    </mesh>
  );
}

function BigScreen({ ticker }: { ticker: Record<string, number> }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    return c;
  }, []);

  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [canvas]);

  useMemo(() => {
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a1520';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#4a90c8';
    ctx.font = 'bold 22px Inter,sans-serif';
    ctx.fillText('📊 实时行情', 16, 32);
    const syms = [
      { k: 'BTC/USDT', f: 'BTCUSDT' }, { k: 'ETH/USDT', f: 'ETHUSDT' },
      { k: 'XAU/USDT', f: 'XAUUSDT' }, { k: 'SOL/USDT', f: 'SOLUSDT' },
    ];
    syms.forEach((s, i) => {
      const y = 62 + i * 36;
      ctx.fillStyle = '#8aa8c8'; ctx.font = '18px Inter,sans-serif';
      ctx.fillText(s.k, 16, y);
      const p = ticker[s.f];
      const txt = p != null ? (s.f === 'XAUUSDT' ? '$' + p.toFixed(2) : '$' + Math.round(p).toLocaleString()) : '--';
      ctx.fillStyle = '#e8f0ff'; ctx.font = 'bold 18px Inter,sans-serif';
      ctx.fillText(txt, 512 - 16 - ctx.measureText(txt).width, y);
    });
    tex.needsUpdate = true;
  }, [canvas, tex, ticker]);

  return (
    <group position={[14, 0, 1.3]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[6, 2.2, 0.15]} />
        <meshToonMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 1.1, 0.09]}>
        <planeGeometry args={[5.4, 1.8]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
}

export function WorldScene() {
  const agents = useGameStore(s => s.agents);
  const ticker = useGameStore(s => s.ticker);
  const selected = useGameStore(s => s.selectedAgentId);
  const selectAgent = useGameStore(s => s.selectAgent);
  const selectNpc = useGameStore(s => s.selectNpc);
  const selectFacility = useGameStore(s => s.selectFacility);
  const effectsOn = useGameStore(s => s.effectsOn);

  const deskPos: [number, number, number][] = [
    [4.2, 0.5, 5.6], [7, 0.5, 5.6], [9.8, 0.5, 5.6], [12.6, 0.5, 5.6], [15.4, 0.5, 5.6],
  ];
  const bedPos: [number, number, number][] = [
    [27, 0.2, 11.8], [30, 0.2, 11.8], [33, 0.2, 11.8],
  ];

  return (
    <group>
      {/* 地板分区 */}
      {ZONES.map(z => (
        <group key={z.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[z.x, 0, z.z]} receiveShadow>
            <planeGeometry args={[z.w, z.d]} />
            <meshToonMaterial color={z.color} />
          </mesh>
          <Text
            position={[z.x, 0.05, z.z - z.d / 2 + 0.8]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.45}
            color={z.id === 'casino' ? '#d4af37' : '#6b5e4e'}
            anchorX="center"
            fontWeight={700}
          >
            {z.label}
          </Text>
        </group>
      ))}

      {/* 墙体 */}
      <Wall x={28} z={3.65} w={0.25} d={7.3} />
      <Wall x={28} z={10.15} w={0.25} d={7.3} />
      <Wall x={5.75} z={15} w={11.5} d={0.25} />
      <Wall x={18.25} z={15} w={11.5} d={0.25} />
      <Wall x={42.25} z={15} w={11.5} d={0.25} />
      <Wall x={28} z={23} w={0.25} d={6} />

      {/* 前厅接待台 */}
      <mesh position={[14, 0.6, 25.5]} castShadow>
        <boxGeometry args={[4, 1.2, 1]} />
        <meshToonMaterial color="#d4c8b8" />
      </mesh>

      <InstancedBoxes positions={deskPos} />
      <InstancedBeds positions={bedPos} />

      {/* 德州桌 */}
      <mesh position={[36, 0.55, 21]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.12, 24]} />
        <meshToonMaterial color="#1a5c3a" />
      </mesh>

      <BigScreen ticker={ticker} />

      {/* NPC — 可点击 */}
      <group position={[14, 0, 25]} onClick={(e) => { e.stopPropagation(); selectNpc('reception'); }}>
        <Gugugaga role="reception" accentColor="#d4af37" label="迎宾 Gugu" status="欢迎光临交易人生" onClick={() => selectNpc('reception')} />
      </group>
      <group position={[30, 0, 8.2]} onClick={(e) => { e.stopPropagation(); selectNpc('masseur'); }}>
        <Gugugaga role="masseur" accentColor="#c8a8e8" label="技师 Gaga" status="按摩放松" scale={1.05} onClick={() => selectNpc('masseur')} />
      </group>
      <group position={[36, 0, 20.4]} onClick={(e) => { e.stopPropagation(); selectNpc('dealer'); }}>
        <Gugugaga role="dealer" accentColor="#d4af37" label="荷官 Jack" status="德州扑克" scale={1.05} onClick={() => selectNpc('dealer')} />
      </group>
      <group position={[10, 0, 18.5]} onClick={(e) => { e.stopPropagation(); selectNpc('lily'); }}>
        <Gugugaga role="waiter" accentColor="#e879a9" label="服务员 Lily" status="餐厅服务" scale={1.05} onClick={() => selectNpc('lily')} />
      </group>

      {/* 可点击设施 */}
      <mesh position={[12, 0.3, 18.5]} onClick={(e) => { e.stopPropagation(); selectFacility('table'); }}>
        <boxGeometry args={[2, 0.1, 2]} /><meshBasicMaterial visible={false} />
      </mesh>
      <mesh position={[30, 0.3, 11.8]} onClick={(e) => { e.stopPropagation(); selectFacility('bed'); }}>
        <boxGeometry args={[2, 0.1, 1]} /><meshBasicMaterial visible={false} />
      </mesh>
      <mesh position={[36, 0.3, 21]} onClick={(e) => { e.stopPropagation(); selectFacility('poker'); }}>
        <cylinderGeometry args={[2, 2, 0.1, 16]} /><meshBasicMaterial visible={false} />
      </mesh>

      {/* Agents */}
      {(Object.values(agents) as CharState[]).map(char => {
        const meta = char.data;
        const status = char.activity === 'massage' ? '按摩中' :
          char.activity === 'dine' ? '就餐中' :
          char.activity === 'poker' ? '打德州' :
          char.activity === 'rest' ? '休息中' :
          char.state === 'trading' ? '交易中' :
          char.state === 'panic' ? '熔断!' :
          char.state === 'scanning' ? '扫描中' : '空闲';
        return (
          <group key={char.agentId} position={[char.x, char.activity === 'massage' ? 0.35 : 0, char.z]}>
            <Gugugaga
              accentColor={meta.color}
              label={meta.name}
              status={status + (meta.pnl != null ? ` · ${meta.pnl >= 0 ? '+' : ''}$${Math.round(meta.pnl)}` : '')}
              stress={char.stress}
              selected={selected === char.agentId}
              onClick={() => selectAgent(char.agentId)}
            />
            {effectsOn && char.stress > 70 && (
              <pointLight color="#888888" intensity={0.3} distance={2} position={[0, 1, 0]} />
            )}
            {effectsOn && char.activity && char.stress < 30 && (
              <pointLight color="#48d093" intensity={0.4} distance={2} position={[0, 1, 0]} />
            )}
          </group>
        );
      })}
    </group>
  );
}
