import { useState } from 'react';
import { Icons } from '../components/icons';
import { Button, EmptyState, Panel } from '../components/ui';
import { activities } from '../data/activities';
import { getClass, getRace } from '../game/content';
import { areRequirementsMet, getRequirementsLabel } from '../game/requirements';
import { getSkill } from '../game/skills';
import type { AccountSave, ActivityId } from '../types';

interface ActivitiesScreenProps {
  account: AccountSave;
  onStartActivity: (characterId: string, activityId: ActivityId) => void;
}

const formatTrackProgress = (account: AccountSave, activityId: ActivityId, trackId: string) =>
  account.regionProgress[activityId]?.tracks[trackId] ?? 0;

export function ActivitiesScreen({ account, onStartActivity }: ActivitiesScreenProps) {
  const idleCharacters = account.characters.filter((character) => !character.activity);
  const [characterId, setCharacterId] = useState(idleCharacters[0]?.id ?? '');
  const selectedCharacter = idleCharacters.find((character) => character.id === characterId) ?? idleCharacters[0];
  const hasAnyCharacter = account.characters.length > 0;

  return (
    <>
      <h1 className="screen-title">Activities</h1>

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
          body={hasAnyCharacter ? 'Regions remain visible while every character is busy.' : 'Create a character before starting activities.'}
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

      <div className="segmented module-tabs">
        <button className="active" type="button">
          Explore
        </button>
        <button disabled type="button">
          Combat
        </button>
        <button disabled type="button">
          Dungeons
        </button>
      </div>

      <section className="section">
        <h2>Explore Regions</h2>
        <div className="activity-list">
          {activities.map((activity) => {
            const canAfford = account.rap >= activity.rapCost;
            const requirementsMet = areRequirementsMet(account, activity.requirements);
            const canStart = Boolean(selectedCharacter) && canAfford && requirementsMet;
            const statusLabel = !selectedCharacter
              ? 'No idle character'
              : !requirementsMet
                ? `Requires ${getRequirementsLabel(activity.requirements)}`
                : canAfford
                  ? 'Ready'
                  : 'Need RAP';
            const statusClass = canStart ? 'met' : 'blocked';
            const disabledLabel = hasAnyCharacter ? 'Busy' : 'Locked';
            const regionProgress = account.regionProgress[activity.id];
            const totalDiscoveries = activity.discoveryTracks.reduce((sum, track) => sum + track.max, 0);
            const currentDiscoveries = activity.discoveryTracks.reduce(
              (sum, track) => sum + formatTrackProgress(account, activity.id, track.id),
              0,
            );

            return (
              <Panel key={activity.id} className="activity-card">
                <div className="activity-card-head">
                  <div className="activity-icon">
                    <Icons.map size={28} />
                  </div>
                  <div>
                    <strong>{activity.regionName}</strong>
                    <span>{activity.description}</span>
                  </div>
                  <Button disabled={!canStart} onClick={() => selectedCharacter && onStartActivity(selectedCharacter.id, activity.id)}>
                    {selectedCharacter ? 'Explore' : disabledLabel}
                  </Button>
                </div>

                <div className="meta-grid">
                  <span>{activity.durationMinutes}m run</span>
                  <span>{activity.tickIntervalSeconds}s ticks</span>
                  <span>RAP {activity.rapCost}</span>
                  <span className={statusClass}>{statusLabel}</span>
                </div>

                <div className="progress-block">
                  <div className="progress-label">
                    <span>Region Discovery</span>
                    <span>
                      {currentDiscoveries} / {totalDiscoveries}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${totalDiscoveries > 0 ? (currentDiscoveries / totalDiscoveries) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="track-grid">
                  {activity.discoveryTracks.map((track) => (
                    <div key={track.id} className="track-row">
                      <span>{track.label}</span>
                      <strong>
                        {formatTrackProgress(account, activity.id, track.id)} / {track.max}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="reward-list">
                  {activity.repeatRewards.map((reward) => (
                    <span key={`${reward.type}:${reward.skillId}`}>+{reward.amount} {getSkill(reward.skillId).name} XP / tick</span>
                  ))}
                  {regionProgress?.completed && <span className="met">Fully explored</span>}
                </div>
              </Panel>
            );
          })}
        </div>
      </section>
    </>
  );
}
