import { useGameStore, type ModalId } from '../../store/useGameStore';
import { AgentWorkshop } from './AgentWorkshop';

const TITLES: Record<Exclude<ModalId, null>, string> = {
  workshop: 'Agent 工坊',
  strategy: '策略编辑器',
  market: '市场行情',
  rank: '排行榜',
  settings: '设置',
  help: '帮助 / 新手引导',
  dine: '餐厅 · 点餐',
  massage: '按摩 · 理疗套餐',
  poker: '德州扑克 · 开局',
};

export function Modals() {
  const activeModal = useGameStore(s => s.activeModal);
  const closeModal = useGameStore(s => s.closeModal);

  if (!activeModal) return null;

  const wide = activeModal === 'workshop' || activeModal === 'strategy';

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className={`modal-box ${wide ? 'modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{TITLES[activeModal]}</h2>
          <button className="ui-btn" onClick={closeModal} style={{ padding: '2px 10px' }}>×</button>
        </div>
        <ModalContent id={activeModal} />
      </div>
    </div>
  );
}

function ModalContent({ id }: { id: Exclude<ModalId, null> }) {
  const agents = useGameStore(s => s.agents);
  const selectedAgentId = useGameStore(s => s.selectedAgentId);
  const soulMd = useGameStore(s => s.soulMd);
  const overview = useGameStore(s => s.overview);
  const tradeFeed = useGameStore(s => s.tradeFeed);
  const ticker = useGameStore(s => s.ticker);
  const agent = selectedAgentId ? agents[selectedAgentId] : null;
  const d = agent?.data;

  switch (id) {
    case 'workshop':
      return <AgentWorkshop />;

    case 'strategy':
      return (
        <div>
          {d ? (
            <>
              <div style={{ marginBottom: 12, padding: 10, background: '#faf6ef', borderRadius: 8 }}>
                <div style={{ fontWeight: 700 }}>{d.icon} {d.name}</div>
                <div style={{ fontSize: 12, color: '#8a7e72' }}>{d.strategy} · {d.market} · {d.interval}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>SOUL 策略文档</div>
              <pre style={{ padding: 10, background: '#faf6ef', borderRadius: 8, fontSize: 11, lineHeight: 1.5, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                {soulMd || '加载中…'}
              </pre>
              <p style={{ color: '#8a7e72', fontSize: 12, marginTop: 12 }}>
                完整拖拽式策略编辑器（React Flow + CodeMirror Lua）将在 Phase 2 接入。
                当前可通过右侧面板「参数」和「SOUL」标签直接编辑策略配置。
              </p>
            </>
          ) : (
            <p style={{ color: '#8a7e72' }}>请先在左侧选择一个 Agent</p>
          )}
        </div>
      );

    case 'market':
      return (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { sym: 'BTC/USDT', key: 'BTCUSDT' },
              { sym: 'ETH/USDT', key: 'ETHUSDT' },
              { sym: 'XAU/USDT', key: 'XAUUSDT' },
              { sym: 'SOL/USDT', key: 'SOLUSDT' },
            ].map(s => (
              <div key={s.key} style={{ padding: 12, background: '#faf6ef', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#9a8b7a' }}>{s.sym}</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {ticker[s.key] != null
                    ? (s.key === 'XAUUSDT' ? '$' + ticker[s.key].toFixed(2) : '$' + Math.round(ticker[s.key]).toLocaleString())
                    : '--'}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#8a7e72', fontSize: 11, marginTop: 12 }}>K 线图表（Lightweight Charts）Phase 2 接入</p>
        </div>
      );

    case 'rank':
      return (
        <div>
          <div style={{ fontSize: 12, color: '#9a8b7a', marginBottom: 8 }}>Agent 收益排行</div>
          {Object.values(agents)
            .sort((a, b) => (b.data.pnl || 0) - (a.data.pnl || 0))
            .map((a, i) => (
              <div key={a.agentId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px dashed #eee8dc' }}>
                <span style={{ width: 20, textAlign: 'center', color: i < 3 ? '#d4af37' : '#999' }}>{i + 1}</span>
                <span style={{ fontSize: 20 }}>{a.data.icon}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{a.data.name}</span>
                <span className={(a.data.pnl || 0) >= 0 ? 'profit' : 'loss'}>
                  {(a.data.pnl || 0) >= 0 ? '+' : ''}${Math.round(a.data.pnl || 0)}
                </span>
              </div>
            ))}
          <div style={{ marginTop: 12, padding: 8, background: '#faf6ef', borderRadius: 8, fontSize: 12 }}>
            总盈亏 ${Math.round(overview.total_pnl || 0).toLocaleString()} · 胜率 {overview.total_wr?.toFixed(1) || '--'}%
          </div>
        </div>
      );

    case 'settings':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>画质 <select className="ui-btn"><option>低</option><option>中</option><option>高</option></select></label>
          <label>音效 <input type="checkbox" defaultChecked /></label>
        </div>
      );

    case 'help':
      return (
        <div style={{ fontSize: 13, lineHeight: 1.6, color: '#6b5e4e' }}>
          <p><b>五大分区：</b>交易大厅 · 前厅接待 · 餐厅 · 按摩 · 德州扑克</p>
          <p><b>玩法闭环：</b>Agent 自动交易 → 亏损增压 → 休闲区恢复 → 回工位</p>
          <p><b>操作：</b></p>
          <ul style={{ paddingLeft: 18 }}>
            <li>左侧「交易大厅」→ 查看全部 Agent 列表</li>
            <li>左侧「我的 Agent」→ 打开工坊编辑参数/SOUL</li>
            <li>左侧「持仓交易」→ 查看所有持仓</li>
            <li>左侧「交易日志」→ 历史成交记录</li>
            <li>点击场景角色 → 右侧面板详情</li>
          </ul>
          {tradeFeed.length > 0 && <p style={{ marginTop: 8, fontSize: 11, color: '#9a8b7a' }}>最近成交 {tradeFeed.length} 条记录已加载</p>}
        </div>
      );

    case 'dine':
      return <LeisureModal title="用餐" effect="-30% 恐慌值" cost="50 代币" activity="dine" />;
    case 'massage':
      return <LeisureModal title="深度按摩" effect="-50% 压力值" cost="80 代币" activity="massage" />;
    case 'poker':
      return <LeisureModal title="德州扑克" effect="清空负面情绪" cost="30 代币" activity="poker" />;
    default:
      return null;
  }
}

function LeisureModal({ title, effect, cost, activity }: { title: string; effect: string; cost: string; activity: 'dine' | 'massage' | 'poker' }) {
  const closeModal = useGameStore(s => s.closeModal);
  const addMessage = useGameStore(s => s.addMessage);
  const selectedAgentId = useGameStore(s => s.selectedAgentId);
  const agents = useGameStore(s => s.agents);
  const patchChar = useGameStore(s => s.patchChar);
  const agent = selectedAgentId ? agents[selectedAgentId] : Object.values(agents)[0];

  return (
    <div>
      <p style={{ marginBottom: 8 }}><b>{title}</b> — {effect}</p>
      <p style={{ color: '#8a7e72', fontSize: 12, marginBottom: 8 }}>消耗 {cost}</p>
      {agent && (
        <div style={{ padding: 8, background: '#faf6ef', borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
          为 <b>{agent.data.icon} {agent.data.name}</b> 提供服务（当前压力 {Math.round(agent.stress)}%）
        </div>
      )}
      <button className="ui-btn" style={{ width: '100%' }} onClick={() => {
        if (agent) {
          const stressDelta = activity === 'massage' ? -50 : activity === 'dine' ? -30 : -100;
          patchChar(agent.agentId, {
            stress: Math.max(0, agent.stress + stressDelta),
            activity,
            activityUntil: performance.now() + 8000,
          });
          addMessage(`${agent.data.name} 完成${title} · ${effect}`);
        }
        closeModal();
      }}>确认消费</button>
    </div>
  );
}
