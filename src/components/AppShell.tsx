import { useState, type ReactNode } from 'react';
import { Icons } from './icons';
import type { ViewId } from '../types';

interface AppShellProps {
  accountName: string;
  rap: number;
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  children: ReactNode;
}

const navItems: Array<{ id: ViewId; label: string; icon: keyof typeof Icons }> = [
  { id: 'account', label: 'Account', icon: 'account' },
  { id: 'activities', label: 'Activities', icon: 'combat' },
  { id: 'progress', label: 'Progress', icon: 'bars' },
];

export function AppShell({ accountName, rap, activeView, onNavigate, children }: AppShellProps) {
  const [isTopCollapsed, setIsTopCollapsed] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const activeItem = navItems.find((item) => item.id === activeView) ?? navItems[0];
  const ActiveIcon = Icons[activeItem.icon];

  return (
    <div className="app-shell">
      <header className={isTopCollapsed ? 'top-bar collapsed' : 'top-bar'}>
        {isTopCollapsed ? (
          <>
            <div className="top-compact">
              <span>{accountName}</span>
              <strong>RAP {rap.toLocaleString()}</strong>
            </div>
            <button className="icon-button" type="button" aria-label="Expand top bar" onClick={() => setIsTopCollapsed(false)}>
              <Icons.chevronDown size={22} />
            </button>
          </>
        ) : (
          <>
            <div className="account-name">{accountName}</div>
            <div className="rap-cluster">
              <span>RAP</span>
              <strong>{rap.toLocaleString()}</strong>
              <button className="icon-button" type="button" aria-label="Collapse top bar" onClick={() => setIsTopCollapsed(true)}>
                <Icons.chevronUp size={22} />
              </button>
            </div>
          </>
        )}
      </header>

      <main className="screen">{children}</main>

      <footer className={isNavCollapsed ? 'bottom-shell collapsed' : 'bottom-shell'}>
        {isNavCollapsed ? (
          <button className="bottom-nav-collapsed" type="button" aria-label="Expand bottom navigation" onClick={() => setIsNavCollapsed(false)}>
            <ActiveIcon size={20} />
            <span>{activeItem.label}</span>
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
