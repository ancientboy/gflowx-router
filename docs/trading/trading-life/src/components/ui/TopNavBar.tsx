import { useGameStore } from '../../store/useGameStore';

export function TopNavBar() {
  const ticker = useGameStore(s => s.ticker);
  const overview = useGameStore(s => s.overview);
  const selectedAgentId = useGameStore(s => s.selectedAgentId);
  const agents = useGameStore(s => s.agents);
  const openModal = useGameStore(s => s.openModal);

  const pnl = overview.total_pnl || 0;
  const capital = overview.total_capital || 0;
  const pnlPct = capital ? (pnl / capital * 100) : 0;
  const mainAgent = selectedAgentId ? agents[selectedAgentId]?.data : Object.values(agents)[0]?.data;

  return (
    <header className="top-nav">
      {/* 左：品牌 + 头像 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }}>
        <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.3 }}>
          🐧 <span style={{ color: '#3d3530' }}>交易人生</span>
        </div>
        <button className="ui-btn" onClick={() => openModal('workshop')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px' }}>
          <span style={{ fontSize: 22 }}>{mainAgent?.icon || '🐧'}</span>
          <span style={{ fontSize: 11, color: '#8a7e72' }}>{mainAgent?.name?.split(' ')[0] || 'Agent'}</span>
        </button>
      </div>

      {/* 中：核心数据卡片 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <div className="stat-card">
          <div className="label">总资产</div>
          <div className="value mono gold">${Math.round(capital).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="label">当日盈亏</div>
          <div className={`value mono ${pnl >= 0 ? 'profit' : 'loss'}`}>
            {pnl >= 0 ? '+' : ''}${Math.round(pnl).toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">收益率</div>
          <div className={`value mono ${pnlPct >= 0 ? 'profit' : 'loss'}`}>
            {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
          </div>
        </div>
        <div className="stat-card" style={{ minWidth: 80 }}>
          <div className="label">BTC</div>
          <div className="value mono" style={{ fontSize: 13 }}>{ticker.BTCUSDT ? '$' + Math.round(ticker.BTCUSDT).toLocaleString() : '--'}</div>
        </div>
      </div>

      {/* 右：快捷按钮 */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <NavBtn icon="📊" label="行情" onClick={() => openModal('market')} />
        <NavBtn icon="🎁" label="活动" onClick={() => openModal('help')} />
        <NavBtn icon="🏆" label="排行" onClick={() => openModal('rank')} />
        <NavBtn icon="⚙️" label="设置" onClick={() => openModal('settings')} />
        <NavBtn icon="❓" label="帮助" onClick={() => openModal('help')} />
        <a href="/trading/" className="ui-btn" style={{ textDecoration: 'none', marginLeft: 4 }}>Dashboard</a>
      </div>
    </header>
  );
}

function NavBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button className="ui-btn" onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '4px 8px', minWidth: 48 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 10, color: '#8a7e72' }}>{label}</span>
    </button>
  );
}
