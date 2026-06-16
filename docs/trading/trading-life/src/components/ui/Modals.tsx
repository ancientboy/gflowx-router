import { useGameStore, type ModalId } from '../../store/useGameStore';

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

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
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

  switch (id) {
    case 'workshop':
      return (
        <div>
          <p style={{ color: '#8a7e72', marginBottom: 12, fontSize: 13 }}>三栏布局预览（Phase 2 完整版）：外观 · 3D 预览 · 策略绑定</p>
          {Object.values(agents).map(a => (
            <div key={a.agentId} style={{ padding: 10, marginBottom: 6, background: '#faf6ef', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>{a.data.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{a.data.name}</div>
                <div style={{ fontSize: 11, color: '#8a7e72' }}>压力 {Math.round(a.stress)}%</div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'strategy':
      return <p style={{ color: '#8a7e72' }}>React Flow 拖拽 + CodeMirror Lua 编辑器（Phase 2 接入）</p>;
    case 'market':
      return <p style={{ color: '#8a7e72' }}>Lightweight Charts 全市场 K 线（Phase 2 接入）</p>;
    case 'rank':
      return <p style={{ color: '#8a7e72' }}>全服 Agent 收益率榜单（Phase 2 接入）</p>;
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
          <p><b>操作：</b>左侧传送 · 点击角色看右侧详情 · 底部控制镜头</p>
        </div>
      );
    case 'dine':
      return <LeisureModal title="用餐" effect="-30% 恐慌值" cost="50 代币" />;
    case 'massage':
      return <LeisureModal title="深度按摩" effect="-50% 压力值" cost="80 代币" />;
    case 'poker':
      return <LeisureModal title="德州扑克" effect="清空负面情绪" cost="30 代币" />;
    default:
      return null;
  }
}

function LeisureModal({ title, effect, cost }: { title: string; effect: string; cost: string }) {
  const closeModal = useGameStore(s => s.closeModal);
  const addMessage = useGameStore(s => s.addMessage);
  return (
    <div>
      <p style={{ marginBottom: 8 }}><b>{title}</b> — {effect}</p>
      <p style={{ color: '#8a7e72', fontSize: 12, marginBottom: 16 }}>消耗 {cost}</p>
      <button className="ui-btn" style={{ width: '100%' }} onClick={() => {
        addMessage(`${title} 服务已完成 · ${effect}`);
        closeModal();
      }}>确认消费</button>
    </div>
  );
}
