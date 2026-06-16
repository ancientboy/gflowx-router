import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { WORLD_MAP } from '../../lib/worldMap';

const CAM = { x: 0, y: 22, z: 12 };

/** 大地图相机：拖拽平移、滚轮缩放、跟随 Agent、区域聚焦 */
export function WorldMapCamera() {
  const { camera, size, gl } = useThree();
  const lookAt = useGameStore(s => s.cameraLookAt);
  const zoom = useGameStore(s => s.cameraZoom);
  const followAgentId = useGameStore(s => s.followAgentId);
  const agents = useGameStore(s => s.agents);
  const panCamera = useGameStore(s => s.panCamera);
  const setCameraZoom = useGameStore(s => s.setCameraZoom);
  const dragging = useRef(false);
  const moved = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      moved.current = false;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { dragging.current = false; };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dist = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
      if (dist < 4) return;
      moved.current = true;
      const dx = (e.clientX - last.current.x) * (28 / zoom);
      const dy = (e.clientY - last.current.y) * (28 / zoom);
      panCamera(-dx, dy);
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCameraZoom(zoom + (e.deltaY > 0 ? -3 : 3));
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('wheel', onWheel);
    };
  }, [gl.domElement, panCamera, setCameraZoom, zoom]);

  useFrame(() => {
    const ortho = camera as THREE.OrthographicCamera;
    if (!ortho.isOrthographicCamera) return;

    let tx = lookAt.x;
    let tz = lookAt.z;
    if (followAgentId && agents[followAgentId]) {
      tx = agents[followAgentId].x;
      tz = agents[followAgentId].z;
    }

    ortho.position.set(CAM.x + tx - WORLD_MAP.centerX, CAM.y, CAM.z + tz - WORLD_MAP.centerZ);
    ortho.left = -size.width / 2;
    ortho.right = size.width / 2;
    ortho.top = size.height / 2;
    ortho.bottom = -size.height / 2;
    ortho.zoom = zoom;
    ortho.near = 0.1;
    ortho.far = 300;
    ortho.lookAt(tx, 0, tz);
    ortho.updateProjectionMatrix();
    ortho.updateMatrixWorld(true);
  });

  return null;
}

export function createWorldOrthoCamera(size: { width: number; height: number }) {
  const cam = new THREE.OrthographicCamera(
    -size.width / 2, size.width / 2,
    size.height / 2, -size.height / 2,
    0.1, 300,
  );
  cam.position.set(CAM.x, CAM.y, CAM.z);
  cam.zoom = WORLD_MAP.overviewZoom;
  cam.lookAt(WORLD_MAP.centerX, 0, WORLD_MAP.centerZ);
  cam.updateProjectionMatrix();
  return cam;
}
