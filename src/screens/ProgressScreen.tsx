import { useState } from 'react';
import { Button, EmptyState, Panel } from '../components/ui';
import { getActivity } from '../game/content';
import { serializeAccountBackup } from '../game/save';
import { getCombatLevel, getTotalLevel } from '../game/skills';
import type { AccountSave, ActivityId } from '../types';

interface ProgressScreenProps {
  account: AccountSave;
  onImportBackup: (rawBackup: string) => void;
  onReset: () => void;
}

export function ProgressScreen({ account, onImportBackup, onReset }: ProgressScreenProps) {
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const combatLevel = getCombatLevel(account);
  const totalLevel = getTotalLevel(account);

  const prepareExport = () => {
    setExportText(serializeAccountBackup(account));
    setBackupMessage('Backup ready. Copy the text and store it outside the app.');
  };

  const importBackup = () => {
    try {
      onImportBackup(importText);
      setImportText('');
      setBackupMessage('Backup imported.');
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : 'Backup import failed.');
    }
  };

  return (
    <>
      <h1 className="screen-title">Progress</h1>
      <Panel className="summary-grid">
        <div className="stat">
          <span>Combat</span>
          <strong>{combatLevel.toFixed(2)}</strong>
        </div>
        <div className="stat">
          <span>Total</span>
          <strong>{totalLevel}</strong>
        </div>
        <div className="stat">
          <span>Done</span>
          <strong>{account.completedActivities}</strong>
        </div>
      </Panel>

      <section className="section">
        <h2>Regions</h2>
        {Object.entries(account.regionProgress).length === 0 ? (
          <EmptyState title="No region discoveries" body="Explore a region to uncover quests, treasures, points of interest, and secrets." />
        ) : (
          <div className="stack">
            {Object.entries(account.regionProgress).map(([activityId, progress]) => {
              const activity = getActivity(activityId as ActivityId);
              return (
                <Panel key={activityId} className="log-row">
                  <strong>{activity.regionName}</strong>
                  {activity.discoveryTracks.map((track) => (
                    <span key={track.id}>
                      {track.label}: {progress.tracks[track.id] ?? 0} / {track.max}
                    </span>
                  ))}
                  <small>{progress.completed ? 'Fully explored' : 'In progress'}</small>
                </Panel>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Activity Log</h2>
        {account.activityLog.length === 0 ? (
          <EmptyState title="No completed activity" body="Start an activity and let it finish to test offline resolution." />
        ) : (
          <div className="stack">
            {account.activityLog.map((entry) => (
              <Panel key={entry.id} className="log-row">
                <strong>
                  {entry.characterName} - {entry.activityName}
                </strong>
                <span>{entry.result}</span>
                <small>{new Date(entry.at).toLocaleString()}</small>
              </Panel>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Save Backup</h2>
        <Panel className="backup-panel">
          <Button onClick={prepareExport}>Export Save</Button>
          {exportText && (
            <label className="field">
              <span>Export</span>
              <textarea readOnly value={exportText} onFocus={(event) => event.currentTarget.select()} />
            </label>
          )}
          <label className="field">
            <span>Import</span>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="Paste MobileIdler backup JSON"
            />
          </label>
          <Button variant="ghost" onClick={importBackup} disabled={!importText.trim()}>
            Import Backup
          </Button>
          {backupMessage && <span className="hint">{backupMessage}</span>}
        </Panel>
      </section>

      <Button variant="danger" onClick={onReset} className="full-width">
        Reset Local Save
      </Button>
    </>
  );
}
