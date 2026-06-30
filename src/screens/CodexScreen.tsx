import { useState } from 'react';
import { Panel } from '../components/ui';
import { getCodexSummary, getCollectionPercent } from '../game/codex';
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
  const summary = getCodexSummary(account);

  return (
    <>
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
            <Panel key={stat.label} className="codex-stat-tile">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.note && <small>{stat.note}</small>}
            </Panel>
          ))}
        </section>
      )}

      {activeTab === 'collection' && (
        <section className="section codex-detail-section">
          <h2>Collection</h2>
          <div className="stack">
            {summary.collectionCategories.map((category) => (
              <Panel key={category.id} className="codex-progress-row">
                <div className="progress-label">
                  <span>{category.label}</span>
                  <strong>
                    {category.current.toLocaleString()} / {category.total.toLocaleString()}
                  </strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${getCollectionPercent(category)}%` }} />
                </div>
                <small>{getCollectionPercent(category).toFixed(3)}%</small>
              </Panel>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'records' && (
        <section className="section codex-detail-section">
          <h2>Records</h2>
          <div className="stack">
            {summary.recordRows.map((record) => (
              <Panel key={record.id} className="codex-record-row">
                <strong>{record.label}</strong>
                <div>
                  <span>Unique</span>
                  <b>{record.unique.toLocaleString()}</b>
                </div>
                <div>
                  <span>Total</span>
                  <b>{record.total.toLocaleString()}</b>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'achievements' && (
        <section className="section codex-detail-section">
          <h2>Achievements</h2>
          <div className="stack">
            {summary.achievementCategories.map((category) => (
              <Panel key={category.id} className="codex-progress-row">
                <div className="progress-label">
                  <span>{category.label}</span>
                  <strong>
                    {category.current.toLocaleString()} / {category.total.toLocaleString()}
                  </strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${category.total > 0 ? (category.current / category.total) * 100 : 0}%` }} />
                </div>
              </Panel>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
