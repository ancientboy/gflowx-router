import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera, MapControls } from '@react-three/drei';
import * as THREE from 'three';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import { WorldScene } from './WorldScene';
import { useGameStore, assignPath, pickWanderTarget, onPathComplete } from '../../store/useGameStore';
import { OfficePath } from '../../lib/pathfinding';

const WALK_SPEED = 2.8;

function CharacterSim({ simSpeed }: { simSpeed: number }) {
  const patchChar = useGameStore(s => s.patchChar);
  const agents = useGameStore(s => s.agents);
  const paused = useGameStore(s => s.paused);
  const addMessage = useGameStore(s => s.addMessage);

  useFrame((_, dt) => {
    if (paused) return;
    const now = performance.now();
    Object.values(agents).forEach(char => {
      let c = { ...char };
      if (c.activity && now < c.activityUntil) return;
      if (c.activity && now >= c.activityUntil) {
        c = { ...c, activity: null, activityUntil: 0, moveTimer: 0, nextMoveTime: 2000 };
        c = assignPath(c, OfficePath.deskByAgent[c.agentId]);
        addMessage(`${c.data.name} 结束休闲，返回工位`);
        patchChar(c.agentId, c);
        return;
      }
      c.moveTimer += dt * 1000 * simSpeed;
      if (!c.isWalking && c.state !== 'trading' && c.moveTimer > c.nextMoveTime) {
        c.moveTimer = 0;
        c.nextMoveTime = 4000 + Math.random() * 6000;
        c = assignPath(c, pickWanderTarget(c));
      }
      if (c.state === 'panic' && !c.isWalking) c = assignPath(c, 'scr_ctr');
      if (c.isWalking && c.pathQueue.length) {
        const wp = c.pathQueue[c.pathIndex];
        if (wp) {
          const dx = wp.x - c.x, dz = wp.z - c.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const step = WALK_SPEED * dt * simSpeed;
          if (dist <= step) {
            c.x = wp.x; c.z = wp.z;
            c.pathIndex++;
            if (c.pathIndex >= c.pathQueue.length) c = onPathComplete(c, now);
          } else {
            c.x += (dx / dist) * step;
            c.z += (dz / dist) * step;
          }
        }
      }
      if (c.x !== char.x || c.z !== char.z || c.isWalking !== char.isWalking || c.activity !== char.activity) {
        patchChar(c.agentId, c);
      }
    });
  });
  return null;
}

function CameraRig() {
  const controlsRef = useRef<MapControlsImpl>(null);
  const cameraFocus = useGameStore(s => s.cameraFocus);
  const followAgentId = useGameStore(s => s.followAgentId);
  const agents = useGameStore(s => s.agents);
  const cameraMode = useGameStore(s => s.cameraMode);
  const { camera } = useThree();

  useEffect(() => {
    if (!cameraFocus || !controlsRef.current) return;
    controlsRef.current.target.set(cameraFocus.x, 0, cameraFocus.z);
    if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      (camera as THREE.OrthographicCamera).zoom = cameraFocus.zoom;
      (camera as THREE.OrthographicCamera).updateProjectionMatrix();
    }
    camera.position.set(cameraFocus.x, 22, cameraFocus.z + 12);
    controlsRef.current.update();
  }, [cameraFocus, camera]);

  useFrame(() => {
    if (!followAgentId || !controlsRef.current) return;
    const a = agents[followAgentId];
    if (!a) return;
    controlsRef.current.target.lerp(new THREE.Vector3(a.x, 0, a.z), 0.08);
    controlsRef.current.update();
  });

  return (
    <MapControls
      ref={controlsRef}
      target={[14, 0, 10]}
      enableRotate={cameraMode === 'perspective'}
      maxPolarAngle={Math.PI / 2.2}
      minZoom={20}
      maxZoom={80}
    />
  );
}

function SceneContent() {
  const cameraMode = useGameStore(s => s.cameraMode);
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const simSpeed = useGameStore(s => s.simSpeed);
  const dayMode = useGameStore(s => s.dayMode);

  const ambIntensity = dayMode === 'day' ? 0.65 : 0.35;
  const ambColor = dayMode === 'day' ? '#fff8f0' : '#8090b0';
  const hemiTop = dayMode === 'day' ? '#fff8f0' : '#607090';
  const hemiBot = dayMode === 'day' ? '#d8d0c8' : '#1a1520';

  return (
    <>
      {cameraMode === 'ortho' ? (
        <OrthographicCamera makeDefault position={[14, 22, 22]} zoom={38} near={0.1} far={200} />
      ) : (
        <PerspectiveCamera makeDefault position={[14, 18, 22]} fov={42} near={0.1} far={200} />
      )}
      <CameraRig />
      <ambientLight intensity={ambIntensity} color={ambColor} />
      <hemisphereLight args={[hemiTop, hemiBot, 0.55]} />
      <directionalLight
        position={[15, 25, 12]}
        intensity={dayMode === 'day' ? 1.0 : 0.5}
        castShadow={quality !== 'low'}
        shadow-mapSize={[quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024]}
      />
      {effectsOn && quality !== 'low' && (
        <directionalLight position={[-10, 12, -8]} intensity={0.35} color="#ffeedd" />
      )}
      <Suspense fallback={null}>
        <CharacterSim simSpeed={simSpeed} />
        <WorldScene />
      </Suspense>
    </>
  );
}

export function GameCanvas() {
  const quality = useGameStore(s => s.quality);
  const dayMode = useGameStore(s => s.dayMode);
  const bgColor = dayMode === 'day' ? '#e8e4dc' : '#2a2838';

  return (
    <Canvas
      shadows={quality !== 'low'}
      dpr={quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: quality !== 'low', alpha: false, preserveDrawingBuffer: true }}
      style={{ width: '100%', height: '100%', background: bgColor }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(bgColor);
        gl.setClearColor(new THREE.Color(bgColor), 1);
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
