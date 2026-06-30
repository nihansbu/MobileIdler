import { useState } from 'react';
import { CharacterCreator } from '../components/CharacterCreator';
import { Icons } from '../components/icons';
import { Button, EmptyState, Panel, Stat } from '../components/ui';
import { activities } from '../data/activities';
import { getActivity, getClass, getRace } from '../game/content';
import { getRosterCharacter, getVisibleRosterSlots } from '../game/roster';
import { canUnlockSecondSlot } from '../game/simulation';
import { getCombatLevel, getTotalLevel } from '../game/skills';
import type { AccountSave, CharacterSave } from '../types';

interface AccountScreenProps {
  account: AccountSave;
  now: number;
  activeCharacterId: string | null;
  onCreateCharacter: (character: CharacterSave, slotIndex?: number) => void;
  onUnlockSlot: () => void;
  onAssignActivity: () => void;
  onMoveRosterCharacter: (fromIndex: number, toIndex: number) => void;
  onSelectCharacter: (characterId: string) => void;
}

const formatRemainingTime = (endsAt: number, now: number) => {
  const remainingSeconds = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

export function AccountScreen({
  account,
  now,
  activeCharacterId,
  onCreateCharacter,
  onUnlockSlot,
  onAssignActivity,
  onMoveRosterCharacter,
  onSelectCharacter,
}: AccountScreenProps) {
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [creationSlotIndex, setCreationSlotIndex] = useState<number | undefined>();
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [movingFromIndex, setMovingFromIndex] = useState<number | null>(null);
  const idleCharacters = account.characters.filter((character) => !character.activity);
  const hasFreeSlot = account.characters.length < account.characterSlots;
  const combatLevel = getCombatLevel(account);
  const totalLevel = getTotalLevel(account);
  const visibleRosterSlots = getVisibleRosterSlots(account);
  const firstEmptySlotIndex = visibleRosterSlots.findIndex((characterId) => characterId === null);
  const validRegionEntries = Object.entries(account.regionProgress).flatMap(([activityId, progress]) => {
    const activity = activities.find((candidate) => candidate.id === activityId && candidate.module === 'explore');
    return activity ? [{ activityId, activity, progress }] : [];
  });

  const createCharacter = (character: CharacterSave) => {
    onCreateCharacter(character, creationSlotIndex);
    setIsCreatingCharacter(false);
    setCreationSlotIndex(undefined);
  };

  const startCreateCharacter = (slotIndex?: number) => {
    setCreationSlotIndex(slotIndex);
    setIsCreatingCharacter(true);
    setIsMoveMode(false);
    setMovingFromIndex(null);
  };

  const toggleMoveMode = () => {
    setIsMoveMode((current) => !current);
    setMovingFromIndex(null);
  };

  const selectRosterSlot = (slotIndex: number) => {
    const character = getRosterCharacter(account, slotIndex);

    if (isMoveMode) {
      if (movingFromIndex === null) {
        if (character) {
          setMovingFromIndex(slotIndex);
        }
        return;
      }

      onMoveRosterCharacter(movingFromIndex, slotIndex);
      setMovingFromIndex(null);
      setIsMoveMode(false);
      return;
    }

    if (character) {
      onSelectCharacter(character.id);
      return;
    }

    if (hasFreeSlot) {
      startCreateCharacter(slotIndex);
    }
  };

  return (
    <>
      <h1 className="screen-title">Account</h1>
      <Panel className="summary-grid">
        <Stat label="Combat" value={combatLevel.toFixed(2)} />
        <Stat label="Total" value={totalLevel} />
        <Stat label="Slots" value={`${account.characters.length} / ${account.characterSlots}`} />
      </Panel>

      <section className="section">
        <div className="section-head">
          <h2>Roster</h2>
          <div className="section-actions">
            {account.characters.length > 1 && (
              <Button className="compact" variant={isMoveMode ? 'secondary' : 'ghost'} onClick={toggleMoveMode}>
                Move
              </Button>
            )}
            {hasFreeSlot && !isCreatingCharacter && (
              <Button className="compact" onClick={() => startCreateCharacter(firstEmptySlotIndex >= 0 ? firstEmptySlotIndex : undefined)}>
                Create
              </Button>
            )}
          </div>
        </div>

        {isCreatingCharacter && (
          <CharacterCreator
            account={account}
            onCancel={() => {
              setIsCreatingCharacter(false);
              setCreationSlotIndex(undefined);
            }}
            onCreateCharacter={createCharacter}
          />
        )}

        {account.characters.length === 0 && !isCreatingCharacter ? (
          <div className="stack">
            <EmptyState title="No character yet" body="Create your first worker when you are ready." />
            <Button onClick={() => startCreateCharacter(firstEmptySlotIndex >= 0 ? firstEmptySlotIndex : undefined)} disabled={!hasFreeSlot}>
              Create First Character
            </Button>
          </div>
        ) : account.characters.length > 0 ? (
          <div className="roster-grid">
            {visibleRosterSlots.map((characterId, slotIndex) => {
              const character = characterId ? account.characters.find((candidate) => candidate.id === characterId) : undefined;
              const isActive = Boolean(character && character.id === activeCharacterId);
              const isMoveSource = movingFromIndex === slotIndex;
              const slotClassName = [
                'roster-slot',
                character ? 'filled' : 'empty',
                isActive ? 'active' : '',
                isMoveSource ? 'moving' : '',
                isMoveMode && movingFromIndex !== null && movingFromIndex !== slotIndex ? 'move-target' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button key={`${slotIndex}:${characterId ?? 'empty'}`} className={slotClassName} type="button" onClick={() => selectRosterSlot(slotIndex)}>
                  <span className="slot-number">{slotIndex + 1}</span>
                  <span className="slot-avatar">{character ? <Icons.profile size={22} /> : <Icons.plus size={22} />}</span>
                  {character ? (
                    <>
                      <strong>{character.name}</strong>
                      <span>
                        {getRace(character.raceId).name} {getClass(character.classId).name}
                      </span>
                      <span>Combat {combatLevel.toFixed(2)}</span>
                      <span className={character.activity ? 'status busy' : 'status idle'}>{character.activity ? 'Busy' : 'Idle'}</span>
                      {character.activity && (
                        <span className="slot-timer">
                          {getActivity(character.activity.activityId).name} - {formatRemainingTime(character.activity.endsAt, now)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <strong>Empty</strong>
                      <span>{isMoveMode ? 'Drop target' : 'Create here'}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ) : null}

        {isMoveMode && (
          <p className="hint">
            {movingFromIndex === null ? 'Select a filled slot to move.' : 'Select a filled or empty target slot.'}
          </p>
        )}
        {idleCharacters.length > 0 && (
          <Button onClick={onAssignActivity} className="full-width compact">
            Assign Active Character
          </Button>
        )}
      </section>

      <section className="section">
        <h2>Regions</h2>
        <div className="stack">
          {validRegionEntries.length === 0 ? (
            <EmptyState title="No region progress" body="Assign a character to Explore Old Road to begin uncovering the first region." />
          ) : (
            validRegionEntries.map(({ activityId, activity, progress }) => {
              const total = activity.discoveryTracks.reduce((sum, track) => sum + track.max, 0);
              const current = activity.discoveryTracks.reduce((sum, track) => sum + (progress.tracks[track.id] ?? 0), 0);
              return (
                <Panel key={activityId} className="progress-card">
                  <div className="progress-label">
                    <strong>{activity.regionName}</strong>
                    <span>
                      {current} / {total}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }} />
                  </div>
                  <span className={progress.completed ? 'status idle' : 'hint'}>{progress.completed ? 'Fully explored' : 'In progress'}</span>
                </Panel>
              );
            })
          )}
        </div>
      </section>

      <section className="section">
        <h2>Next Actions</h2>
        <Panel className="unlock-card">
          <div className="avatar locked">
            <Icons.lock size={24} />
          </div>
          <div>
            <strong>Next Character Slot</strong>
            <span>{account.characterSlots > 1 ? 'Unlocked. Create a character whenever you want.' : 'Unlocks at 2,000 RAP'}</span>
          </div>
          <Button variant={canUnlockSecondSlot(account) ? 'secondary' : 'ghost'} onClick={onUnlockSlot} disabled={!canUnlockSecondSlot(account)}>
            {account.characterSlots > 1 ? 'Unlocked' : 'Unlock'}
          </Button>
        </Panel>
        {idleCharacters.length === 0 && account.characters.length > 0 && <p className="hint">All current characters are assigned.</p>}
      </section>
    </>
  );
}
