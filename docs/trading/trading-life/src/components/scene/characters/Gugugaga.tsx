import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export interface GugugagaProps {
  accentColor?: string;
  scale?: number;
  role?: 'agent' | 'reception' | 'waiter' | 'dealer' | 'masseur';
  label?: string;
  status?: string;
  stress?: number;
  selected?: boolean;
  activity?: 'idle' | 'rest' | 'massage' | 'dine' | 'poker' | null;
  onClick?: () => void;
}

const MAT_CACHE = new Map<string, THREE.MeshToonMaterial>();
function toon(color: string | number) {
  const key = String(color);
  if (!MAT_CACHE.has(key)) MAT_CACHE.set(key, new THREE.MeshToonMaterial({ color }));
  return MAT_CACHE.get(key)!;
}

export function Gugugaga({
  accentColor = '#FFD700',
  scale = 1,
  role = 'agent',
  label,
  status,
  stress = 0,
  selected,
  activity,
  onClick,
}: GugugagaProps) {
  const g = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    if (wingL.current && wingR.current) {
      const flap = activity === 'massage' ? 0.05 : activity === 'dine' ? 0.08 : 0.15;
      wingL.current.rotation.z = 0.5 + Math.sin(t.current * 6) * flap;
      wingR.current.rotation.z = -0.5 - Math.sin(t.current * 6) * flap;
    }
    if (g.current && activity === 'dine') {
      g.current.position.y = Math.sin(t.current * 3) * 0.02;
    }
  });

  const roleAcc: Record<string, { extra?: JSX.Element }> = {
    reception: { extra: <mesh position={[0, 1.05, 0.35]}><boxGeometry args={[0.5, 0.08, 0.02]} /><primitive object={toon('#d4af37')} attach="material" /></mesh> },
    waiter: { extra: <mesh position={[0.35, 0.55, 0.2]} rotation={[0.3,0,0]}><boxGeometry args={[0.25, 0.02, 0.18]} /><primitive object={toon('#ffffff')} attach="material" /></mesh> },
    masseur: { extra: <mesh position={[0, 0.9, 0.3]}><boxGeometry args={[0.45, 0.5, 0.05]} /><primitive object={toon('#c8a8e8')} attach="material" /></mesh> },
    dealer: { extra: <><mesh position={[0, 1.12, 0.2]}><boxGeometry args={[0.28, 0.06, 0.22]} /><primitive object={toon('#1a1a1a')} attach="material" /></mesh></> },
  };

  return (
    <group ref={g} scale={scale} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      {/* 选中环 */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
        </mesh>
      )}
      {/* 压力雾气 */}
      {stress > 50 && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshBasicMaterial color="#888888" transparent opacity={0.08 + stress * 0.001} />
        </mesh>
      )}
      {/* 企鹅白肚 */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <primitive object={toon('#f8f8f8')} attach="material" />
      </mesh>
      {/* 黑色背部/帽 */}
      <mesh position={[0, 0.58, -0.06]} castShadow>
        <sphereGeometry args={[0.44, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <primitive object={toon('#1a1a1a')} attach="material" />
      </mesh>
      {/* 脸 */}
      <mesh position={[0, 0.82, 0.18]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <primitive object={toon('#ffdfc8')} attach="material" />
      </mesh>
      {/* 黑发 */}
      <mesh position={[-0.2, 0.95, 0.08]} scale={[0.8, 1, 0.7]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <primitive object={toon('#1a1a1a')} attach="material" />
      </mesh>
      {/* 银发夹 */}
      <mesh position={[0.18, 1.0, 0.2]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.1, 0.03, 0.04]} />
        <primitive object={toon('#c0c8d0')} attach="material" />
      </mesh>
      {/* 异色瞳 */}
      <mesh position={[-0.09, 0.84, 0.38]}><sphereGeometry args={[0.045, 8, 8]} /><primitive object={toon('#4a9eff')} attach="material" /></mesh>
      <mesh position={[0.09, 0.84, 0.38]}><sphereGeometry args={[0.045, 8, 8]} /><primitive object={toon('#ffaa33')} attach="material" /></mesh>
      {/* 黄喙 */}
      <mesh position={[0, 0.76, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.14, 8]} />
        <primitive object={toon('#ffc832')} attach="material" />
      </mesh>
      {/* 徽章 */}
      <mesh position={[0, 0.55, 0.38]}>
        <circleGeometry args={[0.08, 12]} />
        <primitive object={toon(accentColor)} attach="material" />
      </mesh>
      {/* 翅膀 */}
      <group ref={wingL} position={[-0.42, 0.55, 0.05]}>
        <mesh rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.07, 0.18, 4, 8]} /><primitive object={toon('#1a1a1a')} attach="material" /></mesh>
      </group>
      <group ref={wingR} position={[0.42, 0.55, 0.05]}>
        <mesh rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.07, 0.18, 4, 8]} /><primitive object={toon('#1a1a1a')} attach="material" /></mesh>
      </group>
      {/* 蹼足 */}
      <mesh position={[-0.14, 0.06, 0.06]} scale={[1.3, 0.35, 1.5]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <primitive object={toon('#ffc832')} attach="material" />
      </mesh>
      <mesh position={[0.14, 0.06, 0.06]} scale={[1.3, 0.35, 1.5]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <primitive object={toon('#ffc832')} attach="material" />
      </mesh>
      {roleAcc[role]?.extra}
      {label && (
        <Html center position={[0, 1.55, 0]} distanceFactor={12} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            background: 'rgba(255,252,247,0.95)', border: '1px solid #e0d8cc',
            color: accentColor, whiteSpace: 'nowrap', textAlign: 'center',
          }}>
            {label}
            {status && <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>{status}</div>}
          </div>
        </Html>
      )}
    </group>
  );
}
