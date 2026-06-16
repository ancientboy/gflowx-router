import { useEffect, useState } from 'react';
import { useGameStore, type RightTab } from '../../store/useGameStore';
import { fetchAgentProfile, saveAgentConfig, saveAgentSoul } from '../../lib/api';

const TABS: { id: RightTab; label: string }[] = [
  { id: 'object', label: '当前对象' },
  { id: 'agent', label: '交易 Agent' },
  { id: 'npc', label: '接待 NPC' },
  { id: 'facility', label: '休闲设施' },
  { id: 'assets', label: '资产统计' },
  { id: 'strategy', label: '策略预览' },
  { id: 'messages', label: '消息播报' },
];

const NPC_INFO: Record<string, { name: string; role: string; desc: string; buff: string }> = {
  reception: { name: '迎宾 Gugu', role: '前厅接待', desc: '新 Agent 创建、每日任务、新手引导', buff: '无' },
  lily: { name: '服务员 Lily', role: '餐厅服务', desc: '端餐、点餐服务', buff: '用餐 -30% 恐慌值' },
  masseur: { name: '技师 Gaga', role: '按摩技师', desc: '深度理疗服务', buff: '按摩 -50% 压力值' },
  dealer: { name: '荷官 Jack', role: '德州荷官', desc: '洗牌发牌、开局', buff: '博弈清空负面情绪' },
};

export function RightPanel() {
  const collapsed = useGameStore(s => s.rightPanelCollapsed);
  const toggle = useGameStore(s => s.toggleRightPanel);
  const rightTab = useGameStore(s => s.rightTab);
  const setRightTab = useGameStore(s => s.setRightTab);
  const selectedAgentId = useGameStore(s => s.selectedAgentId);
  const selectedNpcId = useGameStore(s => s.selectedNpcId);
  const selectedFacility = useGameStore(s => s.selectedFacility);
  const agents = useGameStore(s => s.agents);
  const overview = useGameStore(s => s.overview);
  const messages = useGameStore(s => s.messages);
  const panelTab = useGameStore(s => s.panelTab);
  const setPanelTab = useGameStore(s => s.setPanelTab);
  const schema = useGameStore(s => s.profileSchema);
  const config = useGameStore(s => s.profileConfig);
  const soulMd = useGameStore(s => s.soulMd);
  const setProfile = useGameStore(s => s.setProfile);
  const openModal = useGameStore(s => s.openModal);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!selectedAgentId) return;
    fetchAgentProfile(selectedAgentId).then(data => {
      if (!data.error) setProfile(data.schema?.fields || [], data.config || {}, data.soul_md || '');
    });
  }, [selectedAgentId, setProfile]);

  if (collapsed) {
    return (
      <aside className="right-panel collapsed">
        <button className="sidebar-item" onClick={toggle} title="展开面板" style={{ writingMode: 'vertical-rl', height: '100%', justifyContent: 'center' }}>
          ◀ 详情
        </button>
      </aside>
    );
  }

  const agent = selectedAgentId ? agents[selectedAgentId] : null;
  const d = agent?.data;

  return (
    <aside className="right-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px dashed #e0d8cc' }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>信息面板</span>
        <button className="ui-btn" onClick={toggle} style={{ padding: '2px 8px', fontSize: 11 }}>▶ 收起</button>
      </div>

      <div className="panel-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`panel-tab ${rightTab === t.id ? 'active' : ''}`} onClick={() => setRightTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="panel-body">
        {(rightTab === 'object' || rightTab === 'agent') && renderAgentPanel()}
        {rightTab === 'npc' && renderNpcPanel()}
        {rightTab === 'facility' && renderFacilityPanel()}
        {rightTab === 'assets' && renderAssetsPanel()}
        {rightTab === 'strategy' && (
          <div>
            <p style={{ color: '#8a7e72', marginBottom: 8 }}>策略流程图 / 代码预览（Phase 2）</p>
            <button className="ui-btn" onClick={() => openModal('strategy')}>打开策略编辑器</button>
          </div>
        )}
        {rightTab === 'messages' && (
          <div>
            {messages.length === 0 && <p style={{ color: '#999' }}>暂无消息</p>}
            {messages.slice().reverse().map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: '6px 8px', background: '#faf6ef', borderRadius: 6, fontSize: 12 }}>
                <span style={{ color: '#9a8b7a', fontSize: 10 }}>{m.time}</span>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel-footer">
        <button className="ui-btn" style={{ flex: 1 }} onClick={() => openModal('strategy')}>回测</button>
        <button className="ui-btn" style={{ flex: 1 }} onClick={() => openModal('workshop')}>保存配置</button>
      </div>
    </aside>
  );

  function renderAgentPanel() {
    if (!d || !agent) {
      return <p style={{ color: '#9a8b7a' }}>点击场景中的 Gugugaga 角色查看详情</p>;
    }
    const pnl = d.pnl || 0;
    return (
      <>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 32 }}>{d.icon}</span>
          <div>
            <div style={{ fontWeight: 700 }}>{d.name}</div>
            <div style={{ fontSize: 11, color: '#8a7e72' }}>{d.desc}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {(['overview', 'config', 'soul'] as const).map(t => (
            <button key={t} className={`panel-tab ${panelTab === t ? 'active' : ''}`} onClick={() => setPanelTab(t)}>
              {t === 'overview' ? '概览' : t === 'config' ? '参数' : 'SOUL'}
            </button>
          ))}
        </div>

        {panelTab === 'overview' && (
          <>
            <Row k="压力值" v={`${Math.round(agent.stress)}%`} />
            <Row k="活动" v={agent.activity || agent.state} />
            <Row k="策略" v={d.strategy || '--'} />
            <Row k="资金" v={d.capital != null ? '$' + d.capital.toLocaleString() : '--'} />
            <Row k="盈亏" v={(pnl >= 0 ? '+' : '') + '$' + pnl.toLocaleString()} className={pnl >= 0 ? 'profit' : 'loss'} />
            <Row k="持仓" v={(d.positions?.length || 0) + ' 个'} />
          </>
        )}

        {panelTab === 'config' && (
          <>
            {schema.map(f => (
              <div key={f.key} style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: '#7a6e62' }}>{f.label}</label>
                <input type="number" defaultValue={String(config[f.key] ?? '')} id={'cfg-' + f.key}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #d4c8b8', marginTop: 3 }} />
              </div>
            ))}
            <button className="ui-btn" style={{ width: '100%', marginTop: 6 }} onClick={async () => {
              if (!selectedAgentId) return;
              const body: Record<string, unknown> = {};
              schema.forEach(f => { const el = document.getElementById('cfg-' + f.key) as HTMLInputElement; if (el?.value) body[f.key] = el.value; });
              const r = await saveAgentConfig(selectedAgentId, body);
              setMsg(r.message || '');
            }}>保存参数</button>
          </>
        )}

        {panelTab === 'soul' && (
          <>
            <textarea defaultValue={soulMd} id="soul-ed" style={{ width: '100%', minHeight: 120, padding: 8, borderRadius: 6, border: '1px solid #d4c8b8', fontFamily: 'monospace', fontSize: 12 }} />
            <button className="ui-btn" style={{ width: '100%', marginTop: 6 }} onClick={async () => {
              if (!selectedAgentId) return;
              const r = await saveAgentSoul(selectedAgentId, (document.getElementById('soul-ed') as HTMLTextAreaElement).value);
              setMsg(r.message || '');
            }}>保存 SOUL</button>
          </>
        )}
        {msg && <div style={{ marginTop: 6, fontSize: 11, color: '#48d093' }}>{msg}</div>}
      </>
    );
  }

  function renderNpcPanel() {
    const npc = selectedNpcId ? NPC_INFO[selectedNpcId] : null;
    if (!npc) return <p style={{ color: '#9a8b7a' }}>点击场景中的 NPC 查看对话与服务</p>;
    return (
      <>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{npc.name}</div>
        <Row k="职能" v={npc.role} />
        <Row k="说明" v={npc.desc} />
        <Row k="Buff" v={npc.buff} />
        <button className="ui-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => {
          if (selectedNpcId === 'lily') openModal('dine');
          else if (selectedNpcId === 'masseur') openModal('massage');
          else if (selectedNpcId === 'dealer') openModal('poker');
        }}>开始交互</button>
      </>
    );
  }

  function renderFacilityPanel() {
    if (!selectedFacility) return <p style={{ color: '#9a8b7a' }}>点击餐桌 / 按摩床 / 牌桌使用设施</p>;
    const map: Record<string, { title: string; modal: 'dine' | 'massage' | 'poker' }> = {
      table: { title: '餐桌', modal: 'dine' },
      bed: { title: '按摩床', modal: 'massage' },
      poker: { title: '德州牌桌', modal: 'poker' },
    };
    const f = map[selectedFacility];
    return (
      <>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{f?.title || selectedFacility}</div>
        <p style={{ fontSize: 12, color: '#8a7e72', marginBottom: 12 }}>消耗代币使用休闲服务，恢复 Agent 情绪</p>
        <button className="ui-btn" style={{ width: '100%' }} onClick={() => f && openModal(f.modal)}>使用设施</button>
      </>
    );
  }

  function renderAssetsPanel() {
    const pnl = overview.total_pnl || 0;
    return (
      <>
        <Row k="总盈亏" v={'$' + Math.round(pnl).toLocaleString()} className={pnl >= 0 ? 'profit' : 'loss'} />
        <Row k="胜率" v={overview.total_wr ? overview.total_wr.toFixed(1) + '%' : '--'} />
        <Row k="运行状态" v={overview.runner?.running ? 'RUNNING' : 'STOPPED'} />
        {Object.values(agents).map(a => (
          <div key={a.agentId} style={{ marginTop: 8, padding: 8, background: '#faf6ef', borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{a.data.name}</div>
            <div style={{ fontSize: 11, color: '#8a7e72' }}>压力 {Math.round(a.stress)}% · {a.state}</div>
          </div>
        ))}
      </>
    );
  }
}

function Row({ k, v, className = '' }: { k: string; v: string; className?: string }) {
  return (
    <div className="detail-row">
      <span>{k}</span>
      <span className={className}>{v}</span>
    </div>
  );
}
