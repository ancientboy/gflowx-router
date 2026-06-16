import { useFrame } from '@react-three/fiber';
import { useGameStore, assignPath, pickWanderTarget, onPathComplete } from '../../store/useGameStore';
import { HallPath } from '../../lib/hallPathfinding';
import { agentDisplayZone } from '../../lib/zones';

const WALK_SPEED = 2.8;

function nextWanderDelay(state: CharState['state']): number {
  if (state === 'trading') return 6000 + Math.random() * 10000;
  if (state === 'scanning') return 2000 + Math.random() * 3500;
  return 3500 + Math.random() * 5500;
}

/** 仅在交易大厅分区内模拟行走 */
export function CharacterSim() {
  const activeZone = useGameStore(s => s.activeZone);
  const patchChar = useGameStore(s => s.patchChar);
  const agents = useGameStore(s => s.agents);
  const paused = useGameStore(s => s.paused);
  const simSpeed = useGameStore(s => s.simSpeed);
  const addMessage = useGameStore(s => s.addMessage);

  useFrame((_, dt) => {
    if (paused || activeZone !== 'hall') return;
    const now = performance.now();
    Object.values(agents).forEach(char => {
      if (agentDisplayZone(char) !== 'hall') return;
      let c = { ...char };
      if (c.activity && now < c.activityUntil) return;
      if (c.activity && now >= c.activityUntil) {
        c = { ...c, activity: null, activityUntil: 0, moveTimer: 0, nextMoveTime: 1500 };
        c = assignPath(c, HallPath.deskByAgent[c.agentId]);
        addMessage(`${c.data.name} 结束休闲，返回工位`);
        patchChar(c.agentId, c);
        return;
      }
      c.moveTimer += dt * 1000 * simSpeed;
      if (!c.isWalking && c.moveTimer > c.nextMoveTime) {
        const skipTrading = c.state === 'trading' && Math.random() > 0.25;
        if (!skipTrading) {
          c.moveTimer = 0;
          c.nextMoveTime = nextWanderDelay(c.state);
          c = assignPath(c, pickWanderTarget(c));
        } else {
          c.moveTimer = 0;
          c.nextMoveTime = 4000 + Math.random() * 6000;
        }
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
