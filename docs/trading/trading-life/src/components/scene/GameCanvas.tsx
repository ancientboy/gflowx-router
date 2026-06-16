import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_CAMERA } from '../../lib/worldMap';
import { WorldScene } from './WorldScene';
import { CharacterSim } from './CharacterSim';
import { WorldMapCamera, createWorldOrthoCamera } from './WorldMapCamera';

function SceneContent() {
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const dayMode = useGameStore(s => s.dayMode);

  return (
    <>
      <WorldMapCamera />
      <ambientLight intensity={dayMode === 'day' ? 0.85 : 0.45} />
      <hemisphereLight args={[dayMode === 'day' ? '#fff8f0' : '#607090', dayMode === 'day' ? '#d8d0c8' : '#1a1520', 0.55]} />
      <directionalLight position={[8, 16, 6]} intensity={0.9} castShadow={quality !== 'low'} />
      {effectsOn && <directionalLight position={[-6, 8, -4]} intensity={0.25} />}
      <Suspense fallback={null}>
        <CharacterSim />
      </Suspense>
      <WorldScene />
    </>
  );
}

export function GameCanvas() {
  const quality = useGameStore(s => s.quality);
  const dayMode = useGameStore(s => s.dayMode);
  const activeZone = useGameStore(s => s.activeZone);
  const mapOverview = useGameStore(s => s.mapOverview);
  const [zoneAnim, setZoneAnim] = useState(false);

  useEffect(() => {
    setZoneAnim(true);
    const t = window.setTimeout(() => setZoneAnim(false), 400);
    return () => window.clearTimeout(t);
  }, [activeZone]);

  const bgColor = dayMode === 'day' ? '#e8e4dc' : '#2a2838';
  const badge = mapOverview ? '全景地图 · 拖拽移动 · 滚轮缩放' : (ZONE_CAMERA[activeZone]?.label ?? '交易大厅');

  return (
    <div className={`canvas-wrap${zoneAnim ? ' zone-fade' : ''}`}>
      <div className="zone-title-badge">{badge}</div>
      <Canvas
        frameloop="always"
        shadows={quality !== 'low'}
        dpr={quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', background: bgColor, display: 'block' }}
        onCreated={({ set, size, gl, scene }) => {
          const ortho = createWorldOrthoCamera(size);
          set({ camera: ortho });
          scene.background = new THREE.Color(bgColor);
          gl.setClearColor(new THREE.Color(bgColor), 1);
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
