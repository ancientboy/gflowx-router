import { TopNavBar } from '../ui/TopNavBar';
import { LeftSidebar } from '../ui/LeftSidebar';
import { RightPanel } from '../ui/RightPanel';
import { CanvasControls } from '../ui/CanvasControls';
import { Modals } from '../ui/Modals';
import { GameCanvas } from '../scene/GameCanvas';
import { useGameStore } from '../../store/useGameStore';

export function AppShell() {
  const leftExpanded = useGameStore(s => s.leftSidebarExpanded);
  const rightCollapsed = useGameStore(s => s.rightPanelCollapsed);
  const minimalUi = useGameStore(s => s.minimalUi);

  const shellClass = [
    'app-shell',
    leftExpanded ? 'sidebar-expanded' : '',
    rightCollapsed ? 'right-collapsed' : '',
    minimalUi ? 'minimal-ui' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={shellClass}>
      <TopNavBar />
      <LeftSidebar />
      <main className="main-canvas">
        <GameCanvas />
        <CanvasControls />
      </main>
      <RightPanel />
      <Modals />

      {/* 移动端底部 Tab */}
      <MobileTabBar />
    </div>
  );
}

function MobileTabBar() {
  const flyToZone = useGameStore(s => s.flyToZone);
  const openModal = useGameStore(s => s.openModal);
  const toggleRightPanel = useGameStore(s => s.toggleRightPanel);

  return (
    <nav className="mobile-tab-bar">
      <button className="sidebar-item" onClick={() => flyToZone('hall')}>🏠</button>
      <button className="sidebar-item" onClick={() => openModal('workshop')}>🐧</button>
      <button className="sidebar-item" onClick={() => flyToZone('restaurant')}>🍽️</button>
      <button className="sidebar-item" onClick={toggleRightPanel}>📋</button>
    </nav>
  );
}
