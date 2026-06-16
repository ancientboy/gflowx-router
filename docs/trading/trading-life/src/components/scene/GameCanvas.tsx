import { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_META } from '../../lib/zones';
import { ZoneScene } from './zones/ZoneScenes';
import { CharacterSim } from './CharacterSim';

const ZONE_ZOOM = 42;

function CameraRig() {
  const cameraMode = useGameStore(s => s.cameraMode);
  const followAgentId = useGameStore(s => s.followAgentId);
  const activeZone = useGameStore(s => s.activeZone);
  const agents = useGameStore(s => s.agents);
  const { camera } = useThree();

  useFrame(() => {
    const target = new THREE.Vector3(0, 0, 0);
    if (activeZone === 'hall' && followAgentId && agents[followAgentId]) {
      const a = agents[followAgentId];
      target.set(a.x - 10, 0, a.z - 7.5);
    }
    if (cameraMode === 'perspective') {
      camera.position.set(0, 18, 14);
    } else {
      camera.position.set(0, 22, 12);
      const ortho = camera as THREE.OrthographicCamera;
      if (ortho.isOrthographicCamera) {
        ortho.zoom = ZONE_ZOOM;
        ortho.updateProjectionMatrix();
      }
    }
    camera.lookAt(target);
  }, 1);

  return null;
}

function SceneContent() {
  const cameraMode = useGameStore(s => s.cameraMode);
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const dayMode = useGameStore(s => s.dayMode);
  const activeZone = useGameStore(s => s.activeZone);

  const ambIntensity = dayMode === 'day' ? 0.7 : 0.4;
  const hemiTop = dayMode === 'day' ? '#fff8f0' : '#607090';
  const hemiBot = dayMode === 'day' ? '#d8d0c8' : '#1a1520';

  return (
    <>
      {cameraMode === 'ortho' ? (
        <OrthographicCamera makeDefault position={[0, 22, 12]} zoom={ZONE_ZOOM} near={0.1} far={200} />
      ) : (
        <PerspectiveCamera makeDefault position={[0, 18, 14]} fov={42} near={0.1} far={200} />
      )}
      <CameraRig />
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
  const bgColor = activeZone === 'casino'
    ? '#1e2838'
    : (dayMode === 'day' ? '#e8e4dc' : '#2a2838');

  return (
    <div className="canvas-wrap">
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
        <SceneContent />
      </Canvas>
    </div>
  );
}
