import { useMemo, useState } from 'react';
import { classes } from '../data/classes';
import { races } from '../data/races';
import { getClass, getRace, raceAllowsClass } from '../game/content';
import { Button, Panel } from './ui';
import type { AccountSave, CharacterSave, ClassId, RaceId } from '../types';

interface CharacterCreatorProps {
  account: AccountSave;
  onCancel: () => void;
  onCreateCharacter: (character: CharacterSave) => void;
}

export function CharacterCreator({ account, onCancel, onCreateCharacter }: CharacterCreatorProps) {
  const [name, setName] = useState('Aetheron');
  const [raceId, setRaceId] = useState<RaceId>('human');
  const [classId, setClassId] = useState<ClassId>('warrior');

  const race = getRace(raceId);
  const selectedClass = getClass(classId);
  const hasFreeSlot = account.characters.length < account.characterSlots;

  const availableClasses = useMemo(
    () => classes.filter((klass) => raceAllowsClass(raceId, klass.id, account.unlockedRaceClassCombos)),
    [account.unlockedRaceClassCombos, raceId],
  );

  const handleRace = (nextRaceId: RaceId) => {
    setRaceId(nextRaceId);
    const nextRace = getRace(nextRaceId);
    if (!nextRace.allowedClasses.includes(classId)) {
      setClassId(nextRace.allowedClasses[0]);
    }
  };

  const createCharacter = () => {
    if (!hasFreeSlot) {
      return;
    }

    onCreateCharacter({
      id: crypto.randomUUID(),
      name: name.trim() || 'Aetheron',
      raceId,
      classId,
      activity: null,
    });
  };

  return (
    <Panel className="creator-panel">
      <div className="panel-head">
        <div>
          <strong>Create Character</strong>
          <span>
            Slots {account.characters.length} / {account.characterSlots}
          </span>
        </div>
        <Button variant="ghost" className="compact" onClick={onCancel}>
          Close
        </Button>
      </div>

      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>

      <div className="choice-group">
        <span className="label">Race</span>
        {races.map((raceOption) => (
          <button
            key={raceOption.id}
            className={raceId === raceOption.id ? 'choice selected' : 'choice'}
            type="button"
            onClick={() => handleRace(raceOption.id)}
          >
            <strong>{raceOption.name}</strong>
            <span>{raceOption.passive.name}</span>
          </button>
        ))}
      </div>

      <div className="detail-box">
        <strong>{race.name}</strong>
        <p>{race.summary}</p>
        <span>Passive: {race.passive.description}</span>
      </div>

      <div className="choice-group">
        <span className="label">Class</span>
        {classes.map((klass) => {
          const isAllowed = availableClasses.some((available) => available.id === klass.id);
          return (
            <button
              key={klass.id}
              className={classId === klass.id ? 'choice selected' : 'choice'}
              type="button"
              disabled={!isAllowed}
              onClick={() => setClassId(klass.id)}
            >
              <strong>{klass.name}</strong>
              <span>{isAllowed ? 'Available' : 'Locked combo'}</span>
            </button>
          );
        })}
      </div>

      <div className="detail-box">
        <strong>{selectedClass.name}</strong>
        <p>{selectedClass.summary}</p>
        {selectedClass.passives.map((passive) => (
          <span key={passive.id}>
            {passive.name}: {passive.description}
          </span>
        ))}
      </div>

      <Button onClick={createCharacter} disabled={!hasFreeSlot} className="full-width">
        {hasFreeSlot ? 'Create Character' : 'No Free Slot'}
      </Button>
    </Panel>
  );
}
