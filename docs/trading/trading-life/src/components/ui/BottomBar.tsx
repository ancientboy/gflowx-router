import { useGameStore } from '../../store/useGameStore';

export function BottomBar() {
  const cameraMode = useGameStore(s => s.cameraMode);
  const quality = useGameStore(s => s.quality);
  const effectsOn = useGameStore(s => s.effectsOn);
  const simSpeed = useGameStore(s => s.simSpeed);
  const setCameraMode = useGameStore(s => s.setCameraMode);
  const setQuality = useGameStore(s => s.setQuality);
  const setEffectsOn = useGameStore(s => s.setEffectsOn);
  const setSimSpeed = useGameStore(s => s.setSimSpeed);

  return (
    <div className="glass-panel" style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 8, padding: '8px 14px', zIndex: 20, pointerEvents: 'auto', fontSize: 12,
    }}>
      <Toggle label="2.5D" active={cameraMode === 'ortho'} onClick={() => setCameraMode('ortho')} />
      <Toggle label="3D" active={cameraMode === 'perspective'} onClick={() => setCameraMode('perspective')} />
      <Sep />
      <Toggle label="1x" active={simSpeed === 1} onClick={() => setSimSpeed(1)} />
      <Toggle label="5x" active={simSpeed === 5} onClick={() => setSimSpeed(5)} />
      <Toggle label="20x" active={simSpeed === 20} onClick={() => setSimSpeed(20)} />
      <Sep />
      <Toggle label="低" active={quality === 'low'} onClick={() => setQuality('low')} />
      <Toggle label="中" active={quality === 'medium'} onClick={() => setQuality('medium')} />
      <Toggle label="高" active={quality === 'high'} onClick={() => setQuality('high')} />
      <Sep />
      <Toggle label="特效" active={effectsOn} onClick={() => setEffectsOn(!effectsOn)} />
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 6, border: '1px solid #d4c8b8', cursor: 'pointer', fontWeight: 600,
      background: active ? '#4a3f35' : '#f5f0e8', color: active ? '#faf6ef' : '#6b5e4e',
    }}>{label}</button>
  );
}

function Sep() { return <div style={{ width: 1, background: '#e0d8cc', margin: '0 2px' }} />; }
