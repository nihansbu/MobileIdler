import { useMemo, useState } from 'react';
import { Icons } from '../components/icons';
import { Button, EmptyState, Panel } from '../components/ui';
import { activities } from '../data/activities';
import { getCollectionEntry } from '../game/content';
import { getCollectionEntrySave } from '../game/collections';
import { formatDropChance } from '../game/drops';
import { areRequirementsMet, getRequirementsLabel } from '../game/requirements';
import { getPassiveSkillXpForDuration, getSkill } from '../game/skills';
import type { AccountSave, ActivityDefinition, ActivityId, ActivityModule, CharacterSave, CompletionRewardDefinition } from '../types';

interface ActivitiesScreenProps {
  account: AccountSave;
  activeCharacter: CharacterSave | undefined;
  onStartActivity: (activityId: ActivityId) => void;
}

type ActivityRoute = ActivityModule | 'combat' | 'dungeons' | 'bossing';

const activityCategories: Array<{ id: ActivityRoute; title: string; body: string; icon: keyof typeof Icons; enabled: boolean }> = [
  {
    id: 'explore',
    title: 'Explore',
    body: 'Discover regions, quests, treasures, bosses, and secrets.',
    icon: 'map',
    enabled: true,
  },
  {
    id: 'minigame',
    title: 'Minigames',
    body: 'Run focused side activities for XP and rare collection drops.',
    icon: 'activity',
    enabled: true,
  },
  {
    id: 'combat',
    title: 'Combat',
    body: 'Passive enemies and farming targets will appear here later.',
    icon: 'combat',
    enabled: false,
  },
  {
    id: 'dungeons',
    title: 'Dungeons',
    body: 'Longer repeatable dungeon runs will live in this module.',
    icon: 'shield',
    enabled: false,
  },
  {
    id: 'bossing',
    title: 'Bossing',
    body: 'Boss farms, kill records, and rare loot tables are planned.',
    icon: 'codex',
    enabled: false,
  },
];

const formatTrackProgress = (account: AccountSave, activityId: ActivityId, trackId: string) =>
  account.regionProgress[activityId]?.tracks[trackId] ?? 0;

const getActivityModuleTitle = (route: ActivityRoute) => activityCategories.find((category) => category.id === route)?.title ?? 'Activities';

const getCompletionRewardLabel = (account: AccountSave, activity: ActivityDefinition, reward: CompletionRewardDefinition) => {
  if (reward.type === 'skillXp') {
    return `+${reward.amount.toLocaleString()} ${getSkill(reward.skillId).name} XP`;
  }

  const amount = getPassiveSkillXpForDuration(account, reward.skillId, activity.durationMinutes, reward.multiplier);
  return `+${amount.toLocaleString()} ${getSkill(reward.skillId).name} XP`;
};

function StartActivityButton({
  account,
  activeCharacter,
  activity,
  onStartActivity,
}: {
  account: AccountSave;
  activeCharacter: CharacterSave | undefined;
  activity: ActivityDefinition;
  onStartActivity: (activityId: ActivityId) => void;
}) {
  const hasAnyCharacter = account.characters.length > 0;
  const activeCharacterIdle = Boolean(activeCharacter && !activeCharacter.activity);
  const requirementsMet = areRequirementsMet(account, activity.requirements);
  const canAfford = account.rap >= activity.rapCost;
  const canStart = activeCharacterIdle && requirementsMet && canAfford;
  const label = canStart
    ? 'Start'
    : !hasAnyCharacter
      ? 'No Character'
      : !activeCharacterIdle
        ? 'Busy'
        : !requirementsMet
          ? 'Locked'
          : 'Need RAP';

  return (
    <Button disabled={!canStart} onClick={() => onStartActivity(activity.id)}>
      {label}
    </Button>
  );
}

export function ActivitiesScreen({ account, activeCharacter, onStartActivity }: ActivitiesScreenProps) {
  const [route, setRoute] = useState<ActivityRoute | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityId | null>(null);
  const hasAnyCharacter = account.characters.length > 0;
  const canUseActiveCharacter = Boolean(activeCharacter && !activeCharacter.activity);
  const selectedActivity = selectedActivityId ? activities.find((activity) => activity.id === selectedActivityId) ?? null : null;

  const activitiesByRoute = useMemo(
    () =>
      activities.reduce(
        (groups, activity) => ({
          ...groups,
          [activity.module]: [...groups[activity.module], activity],
        }),
        { explore: [], minigame: [] } as Record<ActivityModule, ActivityDefinition[]>,
      ),
    [],
  );

  const openRoute = (nextRoute: ActivityRoute) => {
    setRoute(nextRoute);
    setSelectedActivityId(null);
  };

  const returnToModule = () => {
    setSelectedActivityId(null);
  };

  return (
    <>
      <h1 className="screen-title">Activities</h1>

      {!canUseActiveCharacter && (
        <EmptyState
          title={hasAnyCharacter ? 'Active character busy' : 'No character'}
          body={hasAnyCharacter ? 'Activities remain visible. Switch to an idle character in the top bar or wait.' : 'Create a character before starting activities.'}
        />
      )}

      {!route && (
        <section className="activity-category-grid" aria-label="Activity modules">
          {activityCategories.map((category) => {
            const Icon = Icons[category.icon];
            const moduleCount = category.id === 'explore' || category.id === 'minigame' ? activitiesByRoute[category.id].length : 0;

            return (
              <Panel key={category.id} className={`activity-category-card ${category.enabled ? '' : 'disabled-category'}`}>
                <div className="activity-icon">
                  <Icon size={28} />
                </div>
                <div>
                  <strong>{category.title}</strong>
                  <span>{category.body}</span>
                  <small>{category.enabled ? `${moduleCount} available` : 'Planned'}</small>
                </div>
                <Button disabled={!category.enabled} variant={category.enabled ? 'primary' : 'secondary'} onClick={() => openRoute(category.id)}>
                  Open
                </Button>
              </Panel>
            );
          })}
        </section>
      )}

      {route && !selectedActivity && (
        <section className="section">
          <div className="subpage-header">
            <Button variant="secondary" onClick={() => setRoute(null)}>
              Back
            </Button>
            <h2>{getActivityModuleTitle(route)}</h2>
          </div>

          {route !== 'explore' && route !== 'minigame' ? (
            <EmptyState title="Planned module" body="This activity module is reserved for later gameplay systems." />
          ) : (
            <div className="activity-list">
              {activitiesByRoute[route].map((activity) => {
                const requirementsMet = areRequirementsMet(account, activity.requirements);
                const canAfford = account.rap >= activity.rapCost;
                const Icon = activity.module === 'explore' ? Icons.map : Icons.activity;
                const totalDiscoveries = activity.discoveryTracks.reduce((sum, track) => sum + track.max, 0);
                const currentDiscoveries = activity.discoveryTracks.reduce(
                  (sum, track) => sum + formatTrackProgress(account, activity.id, track.id),
                  0,
                );
                const ownedDrops = activity.dropTable.filter((drop) => {
                  const entry = getCollectionEntry(drop.collectionCategory, drop.collectionId);
                  return getCollectionEntrySave(account, entry).owned;
                }).length;

                return (
                  <Panel key={activity.id} className="activity-card activity-list-card">
                    <div className="activity-card-head">
                      <div className="activity-icon">
                        <Icon size={28} />
                      </div>
                      <div className="activity-card-copy">
                        <strong>{activity.regionName ?? activity.name}</strong>
                        <span>{activity.description}</span>
                      </div>
                      <Button onClick={() => setSelectedActivityId(activity.id)}>Open</Button>
                    </div>

                    <div className="meta-grid">
                      <span>{activity.durationMinutes}m run</span>
                      <span>RAP {activity.rapCost.toLocaleString()}</span>
                      <span className={requirementsMet ? 'met' : 'blocked'}>
                        {requirementsMet ? 'Requirements met' : `Requires ${getRequirementsLabel(activity.requirements)}`}
                      </span>
                      <span className={canAfford ? 'met' : 'blocked'}>{canAfford ? 'RAP ready' : 'Need RAP'}</span>
                      {activity.dropTable.length > 0 && (
                        <span>
                          Drops {ownedDrops} / {activity.dropTable.length}
                        </span>
                      )}
                      {totalDiscoveries > 0 && (
                        <span>
                          Discovery {currentDiscoveries} / {totalDiscoveries}
                        </span>
                      )}
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedActivity && (
        <section className="section activity-detail">
          <div className="subpage-header">
            <Button variant="secondary" onClick={returnToModule}>
              Back
            </Button>
            <h2>{selectedActivity.regionName ?? selectedActivity.name}</h2>
          </div>

          <Panel className="activity-card">
            <div className="activity-card-head">
              <div className="activity-icon">
                {selectedActivity.module === 'explore' ? <Icons.map size={28} /> : <Icons.activity size={28} />}
              </div>
              <div className="activity-card-copy">
                <strong>{selectedActivity.name}</strong>
                <span>{selectedActivity.description}</span>
              </div>
              <StartActivityButton account={account} activeCharacter={activeCharacter} activity={selectedActivity} onStartActivity={onStartActivity} />
            </div>

            <div className="meta-grid">
              <span>{selectedActivity.durationMinutes}m run</span>
              <span>{selectedActivity.tickIntervalSeconds}s ticks</span>
              <span>RAP {selectedActivity.rapCost.toLocaleString()}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-box compact-detail-box">
                <strong>Requirements</strong>
                <span className={areRequirementsMet(account, selectedActivity.requirements) ? 'met' : 'blocked'}>
                  {selectedActivity.requirements.length > 0 ? getRequirementsLabel(selectedActivity.requirements) : 'None'}
                </span>
              </div>

              <div className="detail-box compact-detail-box">
                <strong>Rewards</strong>
                {selectedActivity.repeatRewards.map((reward) => (
                  <span key={`repeat:${reward.skillId}`}>+{reward.amount} {getSkill(reward.skillId).name} XP / tick</span>
                ))}
                {selectedActivity.completionRewards.map((reward) => (
                  <span key={`complete:${reward.type}:${reward.skillId}`}>{getCompletionRewardLabel(account, selectedActivity, reward)}</span>
                ))}
                {selectedActivity.repeatRewards.length === 0 && selectedActivity.completionRewards.length === 0 && <span>None</span>}
              </div>
            </div>

            {selectedActivity.discoveryTracks.length > 0 && (
              <>
                <div className="progress-block">
                  <div className="progress-label">
                    <span>Region Discovery</span>
                    <span>
                      {selectedActivity.discoveryTracks.reduce((sum, track) => sum + formatTrackProgress(account, selectedActivity.id, track.id), 0)} /{' '}
                      {selectedActivity.discoveryTracks.reduce((sum, track) => sum + track.max, 0)}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (selectedActivity.discoveryTracks.reduce((sum, track) => sum + formatTrackProgress(account, selectedActivity.id, track.id), 0) /
                            selectedActivity.discoveryTracks.reduce((sum, track) => sum + track.max, 0)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="track-grid">
                  {selectedActivity.discoveryTracks.map((track) => (
                    <div key={track.id} className="track-row">
                      <span>{track.label}</span>
                      <strong>
                        {formatTrackProgress(account, selectedActivity.id, track.id)} / {track.max}
                      </strong>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedActivity.dropTable.length > 0 && (
              <div className="drop-table">
                <strong>Possible Drops</strong>
                {selectedActivity.dropTable.map((drop) => {
                  const entry = getCollectionEntry(drop.collectionCategory, drop.collectionId);
                  const entrySave = getCollectionEntrySave(account, entry);

                  return (
                    <div key={drop.id} className={`drop-row ${entrySave.owned ? 'owned' : 'missing'}`}>
                      <div>
                        <b>{entry.name}</b>
                        <span>{entry.description}</span>
                      </div>
                      <div>
                        <strong>{entrySave.owned ? 'Owned' : 'Missing'}</strong>
                        <span>{formatDropChance(drop)}</span>
                        <span>Copies {entrySave.copies.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </section>
      )}
    </>
  );
}
