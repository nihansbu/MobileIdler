import { useMemo, useState } from 'react';
import { Button, EmptyState, Panel } from '../components/ui';
import { classes } from '../data/classes';
import { races } from '../data/races';
import { getClass, getRace, raceAllowsClass } from '../game/content';
import type { AccountSave, CharacterSave, ClassId, RaceId } from '../types';

interface CharactersScreenProps {
  account: AccountSave;
  onCreateCharacter: (character: CharacterSave) => void;
}

export function CharactersScreen({ account, onCreateCharacter }: CharactersScreenProps) {
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
      level: 1,
      xp: 0,
      activity: null,
    });
  };

  return (
    <>
      <h1 className="screen-title">Characters</h1>
      <Panel>
        <div className="panel-head">
          <div>
            <strong>Create Character</strong>
            <span>
              Slots {account.characters.length} / {account.characterSlots}
            </span>
          </div>
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

      <section className="section">
        <h2>Roster</h2>
        {account.characters.length === 0 ? (
          <EmptyState title="Empty roster" body="Create one character to start assigning activities." />
        ) : (
          <div className="stack">
            {account.characters.map((character) => (
              <Panel key={character.id} className="roster-row">
                <strong>{character.name}</strong>
                <span>
                  Lvl {character.level} · {getRace(character.raceId).name} {getClass(character.classId).name}
                </span>
                <span>{character.activity ? 'Busy' : 'Idle'}</span>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
