import { useEffect } from 'react';
import { GameCanvas } from './components/scene/GameCanvas';
import { TopBar } from './components/ui/TopBar';
import { AgentPanel } from './components/ui/AgentPanel';
import { BottomBar } from './components/ui/BottomBar';
import { useGameStore } from './store/useGameStore';
import { fetchOverview, fetchTicker } from './lib/api';

export default function App() {
  const initAgents = useGameStore(s => s.initAgents);
  const updateFromOverview = useGameStore(s => s.updateFromOverview);
  const setTicker = useGameStore(s => s.setTicker);

  useEffect(() => {
    initAgents();
    const poll = () => fetchOverview().then(updateFromOverview).catch(() => {});
    const tick = () => fetchTicker().then(setTicker).catch(() => {});
    poll(); tick();
    const a = setInterval(poll, 5000);
    const b = setInterval(tick, 10000);
    return () => { clearInterval(a); clearInterval(b); };
  }, [initAgents, updateFromOverview, setTicker]);

  return (
    <div className="app-root">
      <div className="canvas-layer">
        <GameCanvas />
      </div>
      <div className="ui-layer">
        <TopBar />
        <AgentPanel />
        <BottomBar />
      </div>
    </div>
  );
}
