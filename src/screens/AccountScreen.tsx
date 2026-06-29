import { useState } from 'react';
import { CharacterCreator } from '../components/CharacterCreator';
import { Icons } from '../components/icons';
import { Button, EmptyState, Panel, Stat } from '../components/ui';
import { getActivity, getClass, getRace } from '../game/content';
import { canUnlockSecondSlot, xpForNextLevel } from '../game/simulation';
import type { AccountSave, CharacterSave } from '../types';

interface AccountScreenProps {
  account: AccountSave;
  now: number;
  onAddRap: () => void;
  onCreateCharacter: (character: CharacterSave) => void;
  onUnlockSlot: () => void;
  onAssignActivity: () => void;
}

const formatRemainingTime = (endsAt: number, now: number) => {
  const remainingSeconds = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

export function AccountScreen({ account, now, onAddRap, onCreateCharacter, onUnlockSlot, onAssignActivity }: AccountScreenProps) {
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const idleCharacters = account.characters.filter((character) => !character.activity);
  const hasFreeSlot = account.characters.length < account.characterSlots;

  const createCharacter = (character: CharacterSave) => {
    onCreateCharacter(character);
    setIsCreatingCharacter(false);
  };

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
        <div className="section-head">
          <h2>Characters</h2>
          {hasFreeSlot && !isCreatingCharacter && (
            <Button className="compact" onClick={() => setIsCreatingCharacter(true)}>
              Create
            </Button>
          )}
        </div>

        {isCreatingCharacter && (
          <CharacterCreator account={account} onCancel={() => setIsCreatingCharacter(false)} onCreateCharacter={createCharacter} />
        )}

        {account.characters.length === 0 && !isCreatingCharacter ? (
          <div className="stack">
            <EmptyState title="No character yet" body="Create your first worker when you are ready." />
            {!isCreatingCharacter && (
              <Button onClick={() => setIsCreatingCharacter(true)} disabled={!hasFreeSlot}>
                Create First Character
              </Button>
            )}
          </div>
        ) : account.characters.length > 0 ? (
          <div className="stack">
            {account.characters.map((character) => (
              <Panel key={character.id} className="character-card character-card-expanded">
                <div className="character-main-row">
                  <div className="avatar">
                    <Icons.shield size={28} />
                  </div>
                  <div>
                    <strong>{character.name}</strong>
                    <span>
                      Lvl {character.level} - {getRace(character.raceId).name} {getClass(character.classId).name}
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
                </div>
                <div className="progress-block">
                  <div className="progress-label">
                    <span>XP</span>
                    <span>
                      {character.xp} / {xpForNextLevel(character.level)}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(100, (character.xp / xpForNextLevel(character.level)) * 100)}%` }} />
                  </div>
                </div>
                {character.activity && (
                  <div className="activity-timer">
                    <span>{getActivity(character.activity.activityId).name}</span>
                    <strong>{formatRemainingTime(character.activity.endsAt, now)}</strong>
                  </div>
                )}
              </Panel>
            ))}
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>Next Actions</h2>
        <Panel className="unlock-card">
          <div className="avatar locked">
            <Icons.lock size={24} />
          </div>
          <div>
            <strong>Next Character Slot</strong>
            <span>
              {account.characterSlots > 1 ? 'Unlocked. Create a character whenever you want.' : 'Unlocks at 2,000 RAP'}
            </span>
          </div>
          <Button variant={canUnlockSecondSlot(account) ? 'secondary' : 'ghost'} onClick={onUnlockSlot} disabled={!canUnlockSecondSlot(account)}>
            {account.characterSlots > 1 ? 'Unlocked' : 'Unlock'}
          </Button>
        </Panel>
        {idleCharacters.length === 0 && account.characters.length > 0 && (
          <p className="hint">All current characters are assigned.</p>
        )}
      </section>
    </>
  );
}
