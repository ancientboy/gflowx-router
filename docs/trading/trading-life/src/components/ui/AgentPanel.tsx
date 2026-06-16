import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { fetchAgentProfile, saveAgentConfig, saveAgentSoul } from '../../lib/api';

export function AgentPanel() {
  const selected = useGameStore(s => s.selectedAgentId);
  const agents = useGameStore(s => s.agents);
  const panelTab = useGameStore(s => s.panelTab);
  const setPanelTab = useGameStore(s => s.setPanelTab);
  const selectAgent = useGameStore(s => s.selectAgent);
  const schema = useGameStore(s => s.profileSchema);
  const config = useGameStore(s => s.profileConfig);
  const soulMd = useGameStore(s => s.soulMd);
  const setProfile = useGameStore(s => s.setProfile);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!selected) return;
    fetchAgentProfile(selected).then(data => {
      if (!data.error) setProfile(data.schema?.fields || [], data.config || {}, data.soul_md || '');
    });
  }, [selected, setProfile]);

  if (!selected) return null;
  const d = agents[selected]?.data;
  if (!d) return null;

  const pnl = d.pnl || 0;

  return (
    <div className="glass-panel" style={{
      position: 'absolute', bottom: 16, left: 16, width: 400, maxHeight: '70vh',
      overflow: 'auto', padding: 16, zIndex: 30, pointerEvents: 'auto',
    }}>
      <button onClick={() => selectAgent(null)} style={{ position: 'absolute', top: 10, right: 12, border: 'none', background: '#ede8dc', borderRadius: 6, padding: '2px 8px', cursor: 'pointer' }}>×</button>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #e8dfd0' }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${d.color}33, #f5f0e8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{d.icon}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
          <div style={{ fontSize: 12, color: '#6b5e4e', marginTop: 4 }}>{d.desc}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {(['overview', 'config', 'soul'] as const).map(t => (
          <button key={t} onClick={() => setPanelTab(t)} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #d4c8b8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: panelTab === t ? '#4a3f35' : '#f5f0e8', color: panelTab === t ? '#faf6ef' : '#6b5e4e',
          }}>
            {t === 'overview' ? '概览' : t === 'config' ? '策略参数' : 'SOUL'}
          </button>
        ))}
      </div>

      {panelTab === 'overview' && (
        <div style={{ fontSize: 13 }}>
          <Row k="策略" v={d.strategy} /><Row k="市场" v={d.market} /><Row k="周期" v={d.interval} />
          <Row k="风险" v={d.risk} />
          <Row k="资金" v={d.capital != null ? '$' + d.capital.toLocaleString() : '--'} />
          <Row k="盈亏" v={d.pnl != null ? (pnl > 0 ? '+' : '') + '$' + pnl.toLocaleString() : '--'} className={pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : ''} />
          <Row k="状态" v={d.is_circuit_break ? '熔断' : d.running ? '运行中' : '离线'} />
          <Row k="持仓" v={(d.positions?.length || 0) + ' 个'} />
        </div>
      )}

      {panelTab === 'config' && (
        <div>
          <div style={{ fontSize: 11, color: '#9a8b7a', marginBottom: 8 }}>量化参数 · 重启 Agent 后完全生效</div>
          {schema.length ? schema.map(f => (
            <div key={f.key} style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, color: '#7a6e62', fontWeight: 600 }}>{f.label}</label>
              <input type="number" defaultValue={String(config[f.key] ?? '')} id={'cfg-' + f.key}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #d4c8b8', marginTop: 3 }} />
            </div>
          )) : <div style={{ color: '#999' }}>暂无可编辑参数</div>}
          <button onClick={async () => {
            const body: Record<string, unknown> = {};
            schema.forEach(f => { const el = document.getElementById('cfg-' + f.key) as HTMLInputElement; if (el?.value) body[f.key] = el.value; });
            const r = await saveAgentConfig(selected, body);
            setMsg(r.message || (r.ok ? '已保存' : r.error));
          }} style={{ ...btn, width: '100%', marginTop: 8 }}>保存策略参数</button>
        </div>
      )}

      {panelTab === 'soul' && (
        <div>
          <div style={{ fontSize: 11, color: '#9a8b7a', marginBottom: 8 }}>SOUL.md · Agent 人格与 LLM 说明</div>
          <textarea defaultValue={soulMd} id="soul-editor" style={{ width: '100%', minHeight: 140, padding: 8, borderRadius: 6, border: '1px solid #d4c8b8', fontFamily: 'monospace', fontSize: 12 }} />
          <button onClick={async () => {
            const content = (document.getElementById('soul-editor') as HTMLTextAreaElement).value;
            const r = await saveAgentSoul(selected, content);
            setMsg(r.message || (r.ok ? '已保存' : r.error));
          }} style={{ ...btn, width: '100%', marginTop: 8 }}>保存 SOUL</button>
        </div>
      )}
      {msg && <div style={{ marginTop: 6, fontSize: 11, color: '#16a34a' }}>{msg}</div>}
    </div>
  );
}

function Row({ k, v, className = '' }: { k: string; v: string; className?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
      <span style={{ color: '#7a6e62' }}>{k}</span>
      <span className={className} style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '8px', borderRadius: 6, border: 'none', background: '#4a3f35', color: '#faf6ef', fontWeight: 600, cursor: 'pointer',
};
