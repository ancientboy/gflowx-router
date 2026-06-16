import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera, MapControls } from '@react-three/drei';
import * as THREE from 'three';
import { WorldScene } from './WorldScene';
import { useGameStore, assignPath, pickWanderTarget, onPathComplete } from '../../store/useGameStore';
import { OfficePath } from '../../lib/pathfinding';
import { WORLD } from '../../lib/constants';

const WALK_SPEED = 2.8;

function CharacterSim({ simSpeed }: { simSpeed: number }) {
  const patchChar = useGameStore(s => s.patchChar);
  const agents = useGameStore(s => s.agents);
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt * simSpeed;
    const now = performance.now();
    Object.values(agents).forEach(char => {
      let c = { ...char };

      if (c.activity && now < c.activityUntil) return;

      if (c.activity && now >= c.activityUntil) {
        c = { ...c, activity: null, activityUntil: 0, moveTimer: 0, nextMoveTime: 2000 };
        c = assignPath(c, OfficePath.deskByAgent[c.agentId]);
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
            if (c.pathIndex >= c.pathQueue.length) {
              c = onPathComplete(c, now);
            }
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

function SceneContent() {
  const cameraMode = useGameStore(s => s.cameraMode);
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const simSpeed = useGameStore(s => s.simSpeed);

  return (
    <>
      {cameraMode === 'ortho' ? (
        <OrthographicCamera makeDefault position={[14, 22, 22]} zoom={38} near={0.1} far={200} />
      ) : (
        <PerspectiveCamera makeDefault position={[14, 18, 22]} fov={42} near={0.1} far={200} />
      )}
      <MapControls
        target={[14, 0, 10]}
        enableRotate={cameraMode === 'perspective'}
        maxPolarAngle={Math.PI / 2.2}
        minZoom={20}
        maxZoom={80}
      />
      <ambientLight intensity={0.65} color="#fff8f0" />
      <hemisphereLight args={['#fff8f0', '#d8d0c8', 0.55]} />
      <directionalLight
        position={[15, 25, 12]}
        intensity={1.0}
        castShadow={quality !== 'low'}
        shadow-mapSize={[quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024]}
      />
      <directionalLight position={[-10, 12, -8]} intensity={0.35} color="#ffeedd" />
      {effectsOn && quality !== 'low' && (
        <directionalLight position={[0, 8, -20]} intensity={0.2} color="#c8d8ff" />
      )}
      <CharacterSim simSpeed={simSpeed} />
      <WorldScene />
    </>
  );
}

function ResizeHandler() {
  const { gl, camera, size } = useThree();
  useEffect(() => {
    const overlay = document.getElementById('top-bar');
    const top = overlay ? overlay.getBoundingClientRect().height + 4 : 0;
    gl.setViewport(0, top, size.width, size.height - top);
    if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      (camera as THREE.OrthographicCamera).updateProjectionMatrix();
    }
  }, [size, gl, camera]);
  return null;
}

export function GameCanvas() {
  const quality = useGameStore(s => s.quality);

  return (
    <Canvas
      shadows={quality !== 'low'}
      dpr={quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2)}
      gl={{ antialias: quality !== 'low', alpha: false }}
      onCreated={({ scene }) => { scene.background = new THREE.Color('#e8e4dc'); }}
    >
      <ResizeHandler />
      <SceneContent />
    </Canvas>
  );
}
