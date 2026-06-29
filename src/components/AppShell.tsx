import { useState, type ReactNode } from 'react';
import { Icons } from './icons';
import type { ViewId } from '../types';

interface AppShellProps {
  accountName: string;
  rap: number;
  activeView: ViewId;
  onAddRap: () => void;
  onNavigate: (view: ViewId) => void;
  children: ReactNode;
}

const navItems: Array<{ id: ViewId; label: string; icon: keyof typeof Icons }> = [
  { id: 'account', label: 'Account', icon: 'account' },
  { id: 'activities', label: 'Activities', icon: 'combat' },
  { id: 'skills', label: 'Skills', icon: 'activity' },
  { id: 'progress', label: 'Progress', icon: 'bars' },
];

export function AppShell({ accountName, rap, activeView, onAddRap, onNavigate, children }: AppShellProps) {
  const [isTopCollapsed, setIsTopCollapsed] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <header className={isTopCollapsed ? 'top-shell collapsed' : 'top-shell'}>
        {!isTopCollapsed && (
          <div className="top-bar">
            <div className="account-name">{accountName}</div>
            <div className="rap-cluster">
              <span>RAP</span>
              <strong>{rap.toLocaleString()}</strong>
              <button className="icon-button" type="button" aria-label="Add 10,000 RAP" onClick={onAddRap}>
                <Icons.plus size={22} />
              </button>
            </div>
          </div>
        )}
        <button
          className="top-collapse-button"
          type="button"
          aria-label={isTopCollapsed ? 'Expand top bar' : 'Collapse top bar'}
          onClick={() => setIsTopCollapsed((collapsed) => !collapsed)}
        >
          {isTopCollapsed ? <Icons.chevronDown size={18} /> : <Icons.chevronUp size={18} />}
        </button>
      </header>

      <main className="screen">{children}</main>

      <footer className={isNavCollapsed ? 'bottom-shell collapsed' : 'bottom-shell'}>
        {isNavCollapsed ? (
          <button className="nav-collapse-button collapsed" type="button" aria-label="Expand bottom navigation" onClick={() => setIsNavCollapsed(false)}>
            <Icons.chevronUp size={20} />
          </button>
        ) : (
          <>
            <button className="nav-collapse-button" type="button" aria-label="Collapse bottom navigation" onClick={() => setIsNavCollapsed(true)}>
              <Icons.chevronDown size={18} />
            </button>
            <nav className="bottom-nav" aria-label="Primary">
              {navItems.map((item) => {
                const Icon = Icons[item.icon];
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    className={isActive ? 'nav-item active' : 'nav-item'}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon size={24} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </footer>
    </div>
  );
}
