import type { ReactNode } from 'react';
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
  { id: 'characters', label: 'Characters', icon: 'shield' },
  { id: 'activities', label: 'Activities', icon: 'combat' },
  { id: 'progress', label: 'Progress', icon: 'bars' },
];

export function AppShell({ accountName, rap, activeView, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="account-name">{accountName}</div>
        <div className="rap-cluster">
          <span>RAP</span>
          <strong>{rap.toLocaleString()}</strong>
          <button className="icon-button" aria-label="Open menu">
            <Icons.plus size={22} />
          </button>
        </div>
      </header>

      <main className="screen">{children}</main>

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
    </div>
  );
}
