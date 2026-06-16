import { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_META } from '../../lib/zones';
import { ZoneScene } from './zones/ZoneScenes';
import { CharacterSim } from './CharacterSim';

/** 固定 2.5D 俯视 — 类似灵犀云办公区，始终对准当前分区中心 */
const CAM = { x: 0, y: 22, z: 12, zoom: 42 };

function CameraRig() {
  const { camera } = useThree();

  // 必须在 drei OrthographicCamera 更新之后执行
  useFrame(() => {
    camera.position.set(CAM.x, CAM.y, CAM.z);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  }, 999);

  return null;
}

function SceneBackground({ color }: { color: string }) {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(color);
    gl.setClearColor(new THREE.Color(color), 1);
  }, [scene, gl, color]);
  return null;
}

function SceneContent() {
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const dayMode = useGameStore(s => s.dayMode);
  const activeZone = useGameStore(s => s.activeZone);
  const bg = activeZone === 'casino'
    ? '#1e2838'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  const ambIntensity = dayMode === 'day' ? 0.7 : 0.4;
  const hemiTop = dayMode === 'day' ? '#fff8f0' : '#607090';
  const hemiBot = dayMode === 'day' ? '#d8d0c8' : '#1a1520';

  return (
    <>
      <CameraRig />
      <SceneBackground color={bg} />
      <ambientLight intensity={ambIntensity} />
      <hemisphereLight args={[hemiTop, hemiBot, 0.5]} />
      <directionalLight position={[8, 16, 6]} intensity={1} castShadow={quality !== 'low'} />
      {effectsOn && <directionalLight position={[-6, 8, -4]} intensity={0.3} />}
      <Suspense fallback={null}>
        <CharacterSim />
      </Suspense>
      <ZoneScene zone={activeZone} />
    </>
  );
}

export function GameCanvas() {
  const quality = useGameStore(s => s.quality);
  const dayMode = useGameStore(s => s.dayMode);
  const activeZone = useGameStore(s => s.activeZone);
  const [zoneAnim, setZoneAnim] = useState(false);

  useEffect(() => {
    setZoneAnim(true);
    const t = window.setTimeout(() => setZoneAnim(false), 400);
    return () => window.clearTimeout(t);
  }, [activeZone]);

  const bgColor = activeZone === 'casino'
    ? '#1e2838'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  return (
    <div className={`canvas-wrap${zoneAnim ? ' zone-fade' : ''}`}>
      <div className="zone-title-badge">{ZONE_META[activeZone]?.label ?? '交易大厅'}</div>
      <Canvas
        shadows={quality !== 'low'}
        dpr={quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: quality !== 'low', alpha: false, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', background: bgColor }}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color(bgColor);
          gl.setClearColor(new THREE.Color(bgColor), 1);
        }}
      >
        <OrthographicCamera makeDefault position={[CAM.x, CAM.y, CAM.z]} zoom={CAM.zoom} near={0.1} far={300} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
