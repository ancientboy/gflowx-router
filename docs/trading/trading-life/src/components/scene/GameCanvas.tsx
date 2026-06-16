import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ZONE_CAMERA } from '../../lib/worldMap';
import { PaperZoneCanvas } from '../paper/PaperZoneCanvas';

export function GameCanvas() {
  const dayMode = useGameStore(s => s.dayMode);
  const activeZone = useGameStore(s => s.activeZone);
  const [zoneAnim, setZoneAnim] = useState(false);

  useEffect(() => {
    setZoneAnim(true);
    const t = window.setTimeout(() => setZoneAnim(false), 400);
    return () => window.clearTimeout(t);
  }, [activeZone]);

  const bgColor = dayMode === 'day' ? '#e8e4dc' : '#2a2838';
  const badge = `${ZONE_CAMERA[activeZone]?.label ?? '交易大厅'} · 拖拽移动 · 点击箭头切换区域 · 点击设施派遣 Agent`;

  return (
    <div className={`canvas-wrap${zoneAnim ? ' zone-fade' : ''}`} style={{ background: bgColor }}>
      <div className="zone-title-badge">{badge}</div>
      <PaperZoneCanvas />
    </div>
  );
}
