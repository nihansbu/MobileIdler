import { Icons } from '../components/icons';
import { Button, EmptyState, Panel } from '../components/ui';
import { activities } from '../data/activities';
import { areRequirementsMet, getRequirementsLabel } from '../game/requirements';
import { getSkill } from '../game/skills';
import type { AccountSave, ActivityId, CharacterSave } from '../types';

interface ActivitiesScreenProps {
  account: AccountSave;
  activeCharacter: CharacterSave | undefined;
  onStartActivity: (activityId: ActivityId) => void;
}

const formatTrackProgress = (account: AccountSave, activityId: ActivityId, trackId: string) =>
  account.regionProgress[activityId]?.tracks[trackId] ?? 0;

export function ActivitiesScreen({ account, activeCharacter, onStartActivity }: ActivitiesScreenProps) {
  const hasAnyCharacter = account.characters.length > 0;
  const canUseActiveCharacter = Boolean(activeCharacter && !activeCharacter.activity);

  return (
    <>
      <h1 className="screen-title">Activities</h1>

      {!canUseActiveCharacter && (
        <EmptyState
          title={hasAnyCharacter ? 'Active character busy' : 'No character'}
          body={hasAnyCharacter ? 'Activities remain visible. Switch to an idle character in the top bar or wait.' : 'Create a character before starting activities.'}
        />
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
            const canStart = canUseActiveCharacter && canAfford && requirementsMet;
            const statusLabel = !canUseActiveCharacter
              ? activeCharacter
                ? 'Active busy'
                : 'No character'
              : !requirementsMet
                ? `Requires ${getRequirementsLabel(activity.requirements)}`
                : canAfford
                  ? 'Ready'
                  : 'Need RAP';
            const statusClass = canStart ? 'met' : 'blocked';
            const disabledLabel = !hasAnyCharacter ? 'Locked' : activeCharacter?.activity ? 'Busy' : 'No worker';
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
                  <div className="activity-card-copy">
                    <strong>{activity.regionName}</strong>
                    <span>{activity.description}</span>
                  </div>
                  <Button disabled={!canStart} onClick={() => onStartActivity(activity.id)}>
                    {canUseActiveCharacter ? 'Explore' : disabledLabel}
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
