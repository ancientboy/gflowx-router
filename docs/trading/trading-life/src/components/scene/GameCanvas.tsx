import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_META } from '../../lib/zones';
import { ZoneScene } from './zones/ZoneScenes';
import { CharacterSim } from './CharacterSim';

function SceneLights() {
  const dayMode = useGameStore(s => s.dayMode);
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  return (
    <>
      <ambientLight intensity={dayMode === 'day' ? 0.7 : 0.4} />
      <hemisphereLight args={['#fff8f0', '#d8d0c8', 0.5]} />
      <directionalLight position={[8, 16, 6]} intensity={1} castShadow={quality !== 'low'} />
      {effectsOn && <directionalLight position={[-6, 8, -4]} intensity={0.3} />}
    </>
  );
}

function SceneBackground({ color }: { color: string }) {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(color);
    gl.setClearColor(new THREE.Color(color), 1);
  }, [scene, gl, color]);
  return null;
}

function ActiveZoneScene() {
  const activeZone = useGameStore(s => s.activeZone);
  const dayMode = useGameStore(s => s.dayMode);
  const bg = activeZone === 'casino'
    ? '#1e2838'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  return (
    <>
      <SceneBackground color={bg} />
      <OrthographicCamera makeDefault position={[0, 18, 14]} zoom={48} near={0.1} far={200} />
      <SceneLights />
      <Suspense fallback={null}>
        <CharacterSim />
      </Suspense>
      <ZoneScene zone={activeZone} />
    </>
  );
}

export function GameCanvas() {
  const quality = useGameStore(s => s.quality);
  const activeZone = useGameStore(s => s.activeZone);

  return (
    <div className="canvas-wrap">
      <div className="zone-title-badge">{ZONE_META[activeZone]?.label ?? '交易大厅'}</div>
      <Canvas
        shadows={quality !== 'low'}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ActiveZoneScene />
      </Canvas>
    </div>
  );
}
