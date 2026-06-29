import { useState } from 'react';
import { Icons } from '../components/icons';
import { Button, EmptyState, Panel } from '../components/ui';
import { activities } from '../data/activities';
import { getClass, getRace } from '../game/content';
import type { AccountSave, ActivityId } from '../types';

interface ActivitiesScreenProps {
  account: AccountSave;
  onStartActivity: (characterId: string, activityId: ActivityId) => void;
}

const tabs = ['explore', 'train', 'combat'] as const;

export function ActivitiesScreen({ account, onStartActivity }: ActivitiesScreenProps) {
  const idleCharacters = account.characters.filter((character) => !character.activity);
  const [characterId, setCharacterId] = useState(idleCharacters[0]?.id ?? '');
  const [tab, setTab] = useState<(typeof tabs)[number]>('explore');

  const selectedCharacter = idleCharacters.find((character) => character.id === characterId) ?? idleCharacters[0];
  const hasAnyCharacter = account.characters.length > 0;

  return (
    <>
      <h1 className="screen-title">Assign Activity</h1>

      {selectedCharacter ? (
        <Panel className="selected-character">
          <div className="avatar">
            <Icons.profile size={28} />
          </div>
          <div>
            <strong>{selectedCharacter.name}</strong>
            <span>
              {getRace(selectedCharacter.raceId).name} {getClass(selectedCharacter.classId).name}
            </span>
          </div>
          <span className="status idle">Idle</span>
        </Panel>
      ) : (
        <EmptyState
          title={hasAnyCharacter ? 'No idle character' : 'No character'}
          body={hasAnyCharacter ? 'Activities remain visible while every character is busy.' : 'Create a character before starting activities.'}
        />
      )}

      {idleCharacters.length > 1 && (
        <label className="field">
          <span>Character</span>
          <select value={selectedCharacter.id} onChange={(event) => setCharacterId(event.target.value)}>
            {idleCharacters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="segmented">
        {tabs.map((tabId) => (
          <button key={tabId} className={tab === tabId ? 'active' : ''} type="button" onClick={() => setTab(tabId)}>
            {tabId}
          </button>
        ))}
      </div>

      <div className="activity-list">
        {activities
          .filter((activity) => activity.category === tab)
          .map((activity) => {
          const canAfford = account.rap >= activity.rapCost;
          const canStart = Boolean(selectedCharacter) && canAfford;
          const statusLabel = !selectedCharacter ? 'No idle character' : canAfford ? 'Requirement met' : 'Need RAP';
          const statusClass = canStart ? 'met' : 'blocked';
          const disabledLabel = hasAnyCharacter ? 'Busy' : 'Locked';
          const Icon = activity.category === 'explore' ? Icons.map : activity.category === 'train' ? Icons.endurance : Icons.combat;
          return (
            <Panel key={activity.id} className="activity-row">
              <div className="activity-icon">
                <Icon size={28} />
              </div>
              <div className="activity-body">
                <strong>{activity.name}</strong>
                <div className="meta-grid">
                  <span>Duration {activity.durationMinutes}m</span>
                  <span>Cost RAP {activity.rapCost}</span>
                  <span className={statusClass}>{statusLabel}</span>
                </div>
              </div>
              <Button disabled={!canStart} onClick={() => selectedCharacter && onStartActivity(selectedCharacter.id, activity.id)}>
                {selectedCharacter ? 'Start' : disabledLabel}
              </Button>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
