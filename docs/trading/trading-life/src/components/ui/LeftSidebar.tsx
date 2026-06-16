import { useGameStore, type SidebarAction, type ZoneId } from '../../store/useGameStore';

const MAIN_ITEMS: { id: SidebarAction; icon: string; label: string; zone?: ZoneId }[] = [
  { id: 'hall', icon: '🏠', label: '交易大厅', zone: 'hall' },
  { id: 'agents', icon: '🐧', label: '我的 Agent' },
  { id: 'strategy', icon: '📊', label: '策略编辑器' },
  { id: 'positions', icon: '📈', label: '持仓交易' },
];

const LEISURE_ITEMS: { id: SidebarAction; icon: string; label: string; zone: ZoneId }[] = [
  { id: 'restaurant', icon: '🍽️', label: '餐厅', zone: 'restaurant' },
  { id: 'spa', icon: '💆', label: '按摩区', zone: 'spa' },
  { id: 'casino', icon: '🎰', label: '德州扑克', zone: 'casino' },
];

const OTHER_ITEMS: { id: SidebarAction; icon: string; label: string }[] = [
  { id: 'warehouse', icon: '🎁', label: '资产仓库' },
  { id: 'social', icon: '👥', label: '社交大厅' },
  { id: 'logs', icon: '📜', label: '交易日志' },
];

export function LeftSidebar() {
  const expanded = useGameStore(s => s.leftSidebarExpanded);
  const setExpanded = useGameStore(s => s.setLeftSidebarExpanded);
  const active = useGameStore(s => s.sidebarActive);
  const navigateSidebar = useGameStore(s => s.navigateSidebar);
  const toggleMinimalUi = useGameStore(s => s.toggleMinimalUi);
  const agents = useGameStore(s => s.agents);

  const leisureActive = Object.values(agents).some(c => c.activity === 'dine' || c.activity === 'massage' || c.activity === 'poker');

  return (
    <aside
      className="left-sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
        {MAIN_ITEMS.map(item => (
          <SidebarBtn
            key={item.id}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
            active={active === item.id}
            onClick={() => navigateSidebar(item.id)}
          />
        ))}

        <div style={{ margin: '8px 14px', borderTop: '1px dashed #e0d8cc' }} />
        <div style={{ fontSize: 10, color: '#9a8b7a', padding: '4px 14px', display: expanded ? 'block' : 'none' }}>休闲传送</div>

        {LEISURE_ITEMS.map(item => (
          <SidebarBtn
            key={item.id}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
            active={active === item.id}
            badge={leisureActive}
            onClick={() => navigateSidebar(item.id)}
          />
        ))}

        <div style={{ margin: '8px 14px', borderTop: '1px dashed #e0d8cc' }} />

        {OTHER_ITEMS.map(item => (
          <SidebarBtn
            key={item.id}
            icon={item.icon}
            label={item.label}
            expanded={expanded}
            active={active === item.id}
            onClick={() => navigateSidebar(item.id)}
          />
        ))}
      </div>

      <div style={{ padding: '8px 0', borderTop: '1px dashed #e0d8cc' }}>
        <SidebarBtn icon="🖥️" label="极简 UI" expanded={expanded} onClick={toggleMinimalUi} />
      </div>
    </aside>
  );
}

function SidebarBtn({ icon, label, expanded, active, badge, onClick }: {
  icon: string; label: string; expanded: boolean; active?: boolean; badge?: boolean; onClick: () => void;
}) {
  return (
    <button className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick} title={label}>
      <span className="icon" style={{ position: 'relative' }}>
        {icon}
        {badge && <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: '50%', background: '#48d093' }} />}
      </span>
      {expanded && <span>{label}</span>}
    </button>
  );
}
