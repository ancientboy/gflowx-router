import { useGameStore } from '../../store/useGameStore';

export function CanvasControls() {
  const resetCamera = useGameStore(s => s.resetCamera);
  const followAgentId = useGameStore(s => s.followAgentId);
  const selectedAgentId = useGameStore(s => s.selectedAgentId);
  const setFollowAgent = useGameStore(s => s.setFollowAgent);
  const simSpeed = useGameStore(s => s.simSpeed);
  const setSimSpeed = useGameStore(s => s.setSimSpeed);
  const paused = useGameStore(s => s.paused);
  const togglePause = useGameStore(s => s.togglePause);
  const effectsOn = useGameStore(s => s.effectsOn);
  const setEffectsOn = useGameStore(s => s.setEffectsOn);
  const dayMode = useGameStore(s => s.dayMode);
  const setDayMode = useGameStore(s => s.setDayMode);
  const cameraMode = useGameStore(s => s.cameraMode);
  const setCameraMode = useGameStore(s => s.setCameraMode);

  return (
    <div className="canvas-controls">
      <Ctl label="复位" onClick={resetCamera} />
      <Ctl label="跟随" active={!!followAgentId} onClick={() => setFollowAgent(followAgentId ? null : selectedAgentId)} />
      <span style={{ width: 1, height: 16, background: '#e0d8cc', margin: '0 2px' }} />
      <Ctl label="1x" active={simSpeed === 1 && !paused} onClick={() => { setSimSpeed(1); }} />
      <Ctl label="5x" active={simSpeed === 5 && !paused} onClick={() => setSimSpeed(5)} />
      <Ctl label="20x" active={simSpeed === 20 && !paused} onClick={() => setSimSpeed(20)} />
      <Ctl label={paused ? '▶' : '⏸'} active={paused} onClick={togglePause} />
      <span style={{ width: 1, height: 16, background: '#e0d8cc', margin: '0 2px' }} />
      <Ctl label="特效" active={effectsOn} onClick={() => setEffectsOn(!effectsOn)} />
      <Ctl label={dayMode === 'day' ? '☀️' : '🌙'} onClick={() => setDayMode(dayMode === 'day' ? 'night' : 'day')} />
      <Ctl label={cameraMode === 'ortho' ? '2.5D' : '3D'} active onClick={() => setCameraMode(cameraMode === 'ortho' ? 'perspective' : 'ortho')} />
    </div>
  );
}

function Ctl({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button className={`ui-btn ${active ? 'active' : ''}`} onClick={onClick} style={{ padding: '4px 10px', fontSize: 11 }}>
      {label}
    </button>
  );
}
