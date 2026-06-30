import { useState, type ReactNode } from 'react';
import { Icons } from './icons';
import { getClass, getRace } from '../game/content';
import type { CharacterSave, ViewId } from '../types';

const combatLevelIconUrl = new URL('../../assets/generated/icons/stats/combat_level.png', import.meta.url).href;
const rapIconUrl = new URL('../../assets/generated/icons/currencies/rap.png', import.meta.url).href;
const earnRapIconUrl = new URL('../../assets/generated/icons/actions/earn_rap.png', import.meta.url).href;

interface AppShellProps {
  accountName: string;
  rap: number;
  activeCharacter: CharacterSave | undefined;
  combatLevel: number;
  canSelectHigherPriority: boolean;
  canSelectLowerPriority: boolean;
  activeView: ViewId;
  onAddRap: () => void;
  onSelectHigherPriority: () => void;
  onSelectLowerPriority: () => void;
  onNavigate: (view: ViewId) => void;
  children: ReactNode;
}

const navItems: Array<{ id: ViewId; label: string; icon: keyof typeof Icons }> = [
  { id: 'account', label: 'Account', icon: 'account' },
  { id: 'activities', label: 'Activities', icon: 'combat' },
  { id: 'skills', label: 'Skills', icon: 'activity' },
  { id: 'progress', label: 'Progress', icon: 'bars' },
];

export function AppShell({
  accountName,
  rap,
  activeCharacter,
  combatLevel,
  canSelectHigherPriority,
  canSelectLowerPriority,
  activeView,
  onAddRap,
  onSelectHigherPriority,
  onSelectLowerPriority,
  onNavigate,
  children,
}: AppShellProps) {
  const [isTopCollapsed, setIsTopCollapsed] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const race = activeCharacter ? getRace(activeCharacter.raceId) : null;
  const klass = activeCharacter ? getClass(activeCharacter.classId) : null;

  return (
    <div className="app-shell">
      <header className={isTopCollapsed ? 'top-shell collapsed' : 'top-shell'}>
        {!isTopCollapsed && (
          <div className="top-bar">
            <div className="top-identity">
              <button
                className={canSelectHigherPriority ? 'character-switch available' : 'character-switch'}
                type="button"
                aria-label="Select higher priority idle character"
                onClick={onSelectHigherPriority}
                disabled={!canSelectHigherPriority}
              >
                <Icons.chevronLeft size={18} />
              </button>
              <div className="top-avatar" aria-hidden="true">
                <Icons.profile size={21} />
              </div>
              <button
                className={canSelectLowerPriority ? 'character-switch available' : 'character-switch'}
                type="button"
                aria-label="Select lower priority idle character"
                onClick={onSelectLowerPriority}
                disabled={!canSelectLowerPriority}
              >
                <Icons.chevronRight size={18} />
              </button>
              <div className="top-character-copy">
                <span className="account-name compact">{accountName}</span>
                {activeCharacter && race && klass ? (
                  <>
                    <strong>{activeCharacter.name}</strong>
                    <span>{race.name} {klass.name}</span>
                  </>
                ) : (
                  <>
                    <strong>No character</strong>
                    <span>Create a worker</span>
                  </>
                )}
              </div>
            </div>
            <div className="top-stat-strip">
              <div className="top-stat" aria-label={`Combat level ${combatLevel.toFixed(2)}`}>
                <img src={combatLevelIconUrl} alt="" />
                <strong>{combatLevel.toFixed(2)}</strong>
              </div>
              <div className="top-stat rap-stat" aria-label={`${rap.toLocaleString()} RAP`}>
                <img src={rapIconUrl} alt="" />
                <strong>{rap.toLocaleString()}</strong>
              </div>
            </div>
            <button className="icon-button" type="button" aria-label="Add 10,000 RAP" onClick={onAddRap}>
              <img className="top-action-icon" src={earnRapIconUrl} alt="" />
            </button>
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
