import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useGameStore } from './store/useGameStore';
import { fetchOverview, fetchTicker } from './lib/api';

export default function App() {
  const initAgents = useGameStore(s => s.initAgents);
  const updateFromOverview = useGameStore(s => s.updateFromOverview);
  const setTicker = useGameStore(s => s.setTicker);
  const addMessage = useGameStore(s => s.addMessage);

  useEffect(() => {
    initAgents();
    const poll = () => fetchOverview().then(data => {
      updateFromOverview(data);
    }).catch(() => {});
    const tick = () => fetchTicker().then(setTicker).catch(() => {});
    poll(); tick();
    addMessage('欢迎来到交易人生 · 点击 Gugugaga 查看详情');
    const a = setInterval(poll, 5000);
    const b = setInterval(tick, 10000);
    return () => { clearInterval(a); clearInterval(b); };
  }, [initAgents, updateFromOverview, setTicker, addMessage]);

  return <AppShell />;
}
