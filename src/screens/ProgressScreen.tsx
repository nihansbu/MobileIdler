import { Button, EmptyState, Panel } from '../components/ui';
import type { AccountSave } from '../types';

interface ProgressScreenProps {
  account: AccountSave;
  onReset: () => void;
}

export function ProgressScreen({ account, onReset }: ProgressScreenProps) {
  return (
    <>
      <h1 className="screen-title">Progress</h1>
      <Panel className="summary-grid">
        <div className="stat">
          <span>Characters</span>
          <strong>{account.characters.length}</strong>
        </div>
        <div className="stat">
          <span>Activities</span>
          <strong>{account.completedActivities}</strong>
        </div>
        <div className="stat">
          <span>Slots</span>
          <strong>{account.characterSlots}</strong>
        </div>
      </Panel>

      <section className="section">
        <h2>Activity Log</h2>
        {account.activityLog.length === 0 ? (
          <EmptyState title="No completed activity" body="Start an activity and let it finish to test offline resolution." />
        ) : (
          <div className="stack">
            {account.activityLog.map((entry) => (
              <Panel key={entry.id} className="log-row">
                <strong>
                  {entry.characterName} · {entry.activityName}
                </strong>
                <span>{entry.result}</span>
                <small>{new Date(entry.at).toLocaleString()}</small>
              </Panel>
            ))}
          </div>
        )}
      </section>

      <Button variant="danger" onClick={onReset} className="full-width">
        Reset Local Save
      </Button>
    </>
  );
}
