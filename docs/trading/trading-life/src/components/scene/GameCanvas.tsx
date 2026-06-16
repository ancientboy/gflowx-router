import { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_META } from '../../lib/zones';
import { ZoneScene } from './zones/ZoneScenes';
import { CharacterSim } from './CharacterSim';

/** 固定 2.5D 俯视，始终对准分区中心 */
const CAM = { x: 0, y: 22, z: 12, zoom: 42 };

function createOrthoCamera(size: { width: number; height: number }) {
  const cam = new THREE.OrthographicCamera(
    -size.width / 2, size.width / 2,
    size.height / 2, -size.height / 2,
    0.1, 300,
  );
  cam.position.set(CAM.x, CAM.y, CAM.z);
  cam.zoom = CAM.zoom;
  cam.lookAt(0, 0, 0);
  cam.updateProjectionMatrix();
  return cam;
}

function FixedCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    const ortho = camera as THREE.OrthographicCamera;
    if (!ortho.isOrthographicCamera) return;
    ortho.position.set(CAM.x, CAM.y, CAM.z);
    ortho.left = -size.width / 2;
    ortho.right = size.width / 2;
    ortho.top = size.height / 2;
    ortho.bottom = -size.height / 2;
    ortho.zoom = CAM.zoom;
    ortho.near = 0.1;
    ortho.far = 300;
    ortho.lookAt(0, 0, 0);
    ortho.updateProjectionMatrix();
    ortho.updateMatrixWorld(true);
  });

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
    ? '#f0e8dc'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  return (
    <>
      <FixedCamera />
      <SceneBackground color={bg} />
      <ambientLight intensity={dayMode === 'day' ? 0.7 : 0.4} />
      <hemisphereLight args={[dayMode === 'day' ? '#fff8f0' : '#607090', dayMode === 'day' ? '#d8d0c8' : '#1a1520', 0.5]} />
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
    ? '#f0e8dc'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  return (
    <div className={`canvas-wrap${zoneAnim ? ' zone-fade' : ''}`}>
      <div className="zone-title-badge">{ZONE_META[activeZone]?.label ?? '交易大厅'}</div>
      <Canvas
        frameloop="always"
        shadows={quality !== 'low'}
        dpr={quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: quality !== 'low', alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', background: bgColor, display: 'block' }}
        onCreated={({ set, size, gl, scene }) => {
          const ortho = createOrthoCamera(size);
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
