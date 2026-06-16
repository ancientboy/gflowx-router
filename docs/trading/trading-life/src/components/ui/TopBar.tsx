import { useGameStore } from '../../store/useGameStore';

export function TopBar() {
  const ticker = useGameStore(s => s.ticker);
  const overview = useGameStore(s => s.overview);
  const toggleSidebar = useGameStore(s => s.toggleSidebar);

  const pnl = overview.total_pnl || 0;

  return (
    <header id="top-bar" className="glass-panel" style={{
      position: 'absolute', top: 8, left: 8, right: 8, zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px',
      pointerEvents: 'auto',
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#3d3530' }}>🐧 交易人生</div>
      <div style={{ width: 1, height: 16, background: '#e0d8cc' }} />
      <Stat label="BTC" value={ticker.BTCUSDT ? '$' + Math.round(ticker.BTCUSDT).toLocaleString() : '--'} />
      <Stat label="ETH" value={ticker.ETHUSDT ? '$' + Math.round(ticker.ETHUSDT).toLocaleString() : '--'} />
      <Stat label="XAU" value={ticker.XAUUSDT ? '$' + ticker.XAUUSDT.toFixed(2) : '--'} />
      <Stat label="总盈亏" value={pnl ? '$' + Math.round(pnl).toLocaleString() : '--'} className={pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : ''} />
      <Stat label="胜率" value={overview.total_wr ? overview.total_wr.toFixed(1) + '%' : '--'} />
      <Stat label="状态" value={overview.runner?.running ? 'RUNNING' : 'STOP'} className={overview.runner?.running ? 'profit' : 'loss'} />
      <div style={{ flex: 1 }} />
      <button onClick={toggleSidebar} style={btnStyle}>Agent 工坊</button>
      <a href="/trading/" style={{ ...btnStyle, textDecoration: 'none' }}>Dashboard</a>
    </header>
  );
}

function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
      <span style={{ color: '#8a7e72', fontSize: 11 }}>{label}</span>
      <span className={`mono ${className}`} style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8, border: '1px solid #e0d8cc',
  background: '#faf6ef', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#4a3f35',
};
