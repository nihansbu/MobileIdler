import { Icons } from '../components/icons';
import { Button, EmptyState, Panel, Stat } from '../components/ui';
import { canUnlockSecondSlot } from '../game/simulation';
import type { AccountSave } from '../types';

interface AccountScreenProps {
  account: AccountSave;
  onAddRap: () => void;
  onUnlockSlot: () => void;
  onAssignActivity: () => void;
}

export function AccountScreen({ account, onAddRap, onUnlockSlot, onAssignActivity }: AccountScreenProps) {
  const idleCharacters = account.characters.filter((character) => !character.activity);

  return (
    <>
      <h1 className="screen-title">Account</h1>
      <Panel className="summary-grid">
        <Stat label="RAP" value={account.rap.toLocaleString()} />
        <Stat label="Slots" value={`${account.characters.length} / ${account.characterSlots}`} />
        <Stat label="Done" value={account.completedActivities} />
      </Panel>

      <Button onClick={onAddRap} className="full-width">
        +10,000 RAP
      </Button>

      <section className="section">
        <h2>Active Characters</h2>
        {account.characters.length === 0 ? (
          <EmptyState title="No character yet" body="Create your first worker on the Characters tab." />
        ) : (
          <div className="stack">
            {account.characters.map((character) => (
              <Panel key={character.id} className="character-card">
                <div className="avatar">
                  <Icons.shield size={28} />
                </div>
                <div>
                  <strong>{character.name}</strong>
                  <span>
                    Lvl {character.level} · {character.raceId} {character.classId}
                  </span>
                  <span className={character.activity ? 'status busy' : 'status idle'}>
                    {character.activity ? 'Busy' : 'Idle'}
                  </span>
                </div>
                {!character.activity && (
                  <Button onClick={onAssignActivity} className="compact">
                    Assign
                  </Button>
                )}
              </Panel>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Next Actions</h2>
        <Panel className="unlock-card">
          <div className="avatar locked">
            <Icons.lock size={24} />
          </div>
          <div>
            <strong>Next Character Slot</strong>
            <span>Unlocks at 2,000 RAP</span>
          </div>
          <Button variant={canUnlockSecondSlot(account) ? 'secondary' : 'ghost'} onClick={onUnlockSlot} disabled={!canUnlockSecondSlot(account)}>
            Unlock
          </Button>
        </Panel>
        {idleCharacters.length === 0 && account.characters.length > 0 && (
          <p className="hint">All current characters are assigned.</p>
        )}
      </section>
    </>
  );
}
