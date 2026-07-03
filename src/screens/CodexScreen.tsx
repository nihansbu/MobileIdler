import { useRef, useState, type CSSProperties } from 'react';
import { Panel } from '../components/ui';
import { getCodexPercent, getCodexPercentLabel, getCodexSummary } from '../game/codex';
import type { AccountSave } from '../types';

interface CodexScreenProps {
  account: AccountSave;
}

type CodexTab = 'overview' | 'collection' | 'records' | 'achievements';

const codexTabs: Array<{ id: CodexTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'collection', label: 'Collection' },
  { id: 'records', label: 'Records' },
  { id: 'achievements', label: 'Achievements' },
];

export function CodexScreen({ account }: CodexScreenProps) {
  const [activeTab, setActiveTab] = useState<CodexTab>('overview');
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const summary = getCodexSummary(account);
  const activeTabIndex = codexTabs.findIndex((tab) => tab.id === activeTab);

  const getFillStyle = (percent: number | null) => ({ '--fill': `${percent ?? 0}%` }) as CSSProperties;
  const getFilledClassName = (baseClassName: string, percent: number | null) =>
    `${baseClassName} filled-card${!percent || percent <= 0 ? ' empty-fill' : ''}`.trim();

  const selectAdjacentTab = (direction: -1 | 1) => {
    const nextIndex = Math.max(0, Math.min(codexTabs.length - 1, activeTabIndex + direction));
    setActiveTab(codexTabs[nextIndex].id);
  };

  const handleTouchEnd = (x: number, y: number) => {
    if (!touchStart.current) {
      return;
    }

    const deltaX = x - touchStart.current.x;
    const deltaY = y - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    selectAdjacentTab(deltaX < 0 ? 1 : -1);
  };

  return (
    <div
      className="codex-screen"
      onTouchStart={(event) => {
        const touch = event.changedTouches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        handleTouchEnd(touch.clientX, touch.clientY);
      }}
    >
      <h1 className="screen-title codex-title">Codex</h1>

      <div className="segmented codex-tabs" role="tablist" aria-label="Codex sections">
        {codexTabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <section className="codex-overview" aria-label="Codex overview">
          {summary.overviewStats.map((stat) => (
            <Panel key={stat.label} className={getFilledClassName('codex-stat-tile', stat.percent)} style={getFillStyle(stat.percent)}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.percentLabel && <small>{stat.percentLabel}</small>}
            </Panel>
          ))}
        </section>
      )}

      {activeTab === 'collection' && (
        <section className="section codex-detail-section">
          <h2>Collection</h2>
          {summary.collectionCategories.length === 0 ? (
            <Panel className="empty-state">
              <strong>No collection content yet</strong>
              <span>Collector items, mounts, pets, and skins will appear here once those systems exist.</span>
            </Panel>
          ) : (
            <div className="stack">
              {summary.collectionCategories.map((category) => (
                <Panel
                  key={category.id}
                  className={getFilledClassName('codex-progress-row', getCodexPercent(category.current, category.total))}
                  style={getFillStyle(getCodexPercent(category.current, category.total))}
                >
                  <div className="progress-label">
                    <span>{category.label}</span>
                    <strong>
                      {category.current.toLocaleString()} / {category.total.toLocaleString()}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${getCodexPercent(category.current, category.total)}%` }} />
                  </div>
                  <small>{getCodexPercentLabel(category.current, category.total)}</small>
                </Panel>
              ))}
              {summary.collectionEntries.length > 0 && (
                <div className="collection-entry-list">
                  {summary.collectionEntries.map((entry) => (
                    <Panel key={`${entry.category}:${entry.id}`} className={`collection-entry-row ${entry.save.owned ? 'owned' : 'missing'}`}>
                      <div>
                        <strong>{entry.name}</strong>
                        <span>{entry.source}</span>
                      </div>
                      <div>
                        <b>{entry.save.owned ? 'Owned' : 'Missing'}</b>
                        <span>Copies {entry.save.copies.toLocaleString()}</span>
                      </div>
                    </Panel>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {activeTab === 'records' && (
        <section className="section codex-detail-section">
          <h2>Records</h2>
          <div className="stack">
            {summary.recordRows.map((record) => (
              <Panel key={record.id} className={getFilledClassName('codex-record-row', record.percent)} style={getFillStyle(record.percent)}>
                <strong>{record.label}</strong>
                <div>
                  <span>Unique</span>
                  <b>
                    {record.unique.toLocaleString()} / {record.uniqueTotal.toLocaleString()}
                  </b>
                </div>
                <div>
                  <span>Total</span>
                  <b>{record.valueTotal === null ? record.value.toLocaleString() : `${record.value.toLocaleString()} / ${record.valueTotal.toLocaleString()}`}</b>
                </div>
                {record.percentLabel && <small>{record.percentLabel}</small>}
              </Panel>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'achievements' && (
        <section className="section codex-detail-section">
          <h2>Achievements</h2>
          {summary.achievementCategories.length === 0 ? (
            <Panel className="empty-state">
              <strong>No achievements yet</strong>
              <span>Achievement categories and points will appear here once the achievement system exists.</span>
            </Panel>
          ) : (
            <div className="stack">
              {summary.achievementCategories.map((category) => (
                <Panel
                  key={category.id}
                  className={getFilledClassName('codex-progress-row', getCodexPercent(category.current, category.total))}
                  style={getFillStyle(getCodexPercent(category.current, category.total))}
                >
                  <div className="progress-label">
                    <span>{category.label}</span>
                    <strong>
                      {category.current.toLocaleString()} / {category.total.toLocaleString()}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${getCodexPercent(category.current, category.total)}%` }} />
                  </div>
                  <small>{getCodexPercentLabel(category.current, category.total)}</small>
                </Panel>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
