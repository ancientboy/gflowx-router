import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import type { SpriteId } from '../../icons/spritePaths';
import { SPRITE } from '../../icons/spritePaths';

interface SceneSpriteProps {
  id: SpriteId;
  position?: [number, number, number];
  scale?: number;
  visible?: boolean;
}

export function SceneSprite({ id, position = [0, 2, 0], scale = 0.55, visible = true }: SceneSpriteProps) {
  const url = SPRITE[id];
  const texture = useLoader(TextureLoader, url);

  const mat = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, sizeAttenuation: true });
  }, [texture]);

  if (!visible) return null;
  return <sprite position={position} scale={[scale, scale, 1]} material={mat} renderOrder={10} />;
}
