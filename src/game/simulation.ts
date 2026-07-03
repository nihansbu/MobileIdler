import { getActivity } from './content';
import { rollDropTable } from './drops';
import { addSkillXp, getPassiveSkillXpForDuration, getSkill } from './skills';
import type { AccountSave, ActivityId, ActivityLogEntry, CharacterSave, CompletionRewardDefinition, RegionProgressSave, RewardDefinition } from '../types';

const ACTIVITY_LOG_LIMIT = 30;

const createEmptyRegionProgress = (activityId: string): RegionProgressSave => {
  const activity = getActivity(activityId as ActivityId);
  return {
    completed: false,
    tracks: activity.discoveryTracks.reduce(
      (tracks, track) => ({
        ...tracks,
        [track.id]: 0,
      }),
      {},
    ),
  };
};

const getRegionProgress = (account: AccountSave, activityId: string) =>
  account.regionProgress[activityId] ?? createEmptyRegionProgress(activityId);

const isRegionComplete = (progress: RegionProgressSave, activityId: string) => {
  const activity = getActivity(activityId as ActivityId);
  return activity.discoveryTracks.every((track) => (progress.tracks[track.id] ?? 0) >= track.max);
};

const applyReward = (account: AccountSave, reward: RewardDefinition): AccountSave => {
  if (reward.type === 'skillXp') {
    return addSkillXp(account, reward.skillId, reward.amount);
  }

  return account;
};

const applyCompletionReward = (
  account: AccountSave,
  reward: CompletionRewardDefinition,
  durationMinutes: number,
): { account: AccountSave; label: string | null } => {
  if (reward.type === 'skillXp') {
    return {
      account: addSkillXp(account, reward.skillId, reward.amount),
      label: `+${reward.amount.toLocaleString()} ${getSkill(reward.skillId).name} XP`,
    };
  }

  const amount = getPassiveSkillXpForDuration(account, reward.skillId, durationMinutes, reward.multiplier);

  return {
    account: addSkillXp(account, reward.skillId, amount),
    label: `+${amount.toLocaleString()} ${getSkill(reward.skillId).name} XP`,
  };
};

const resolveExploreTick = (account: AccountSave, activityId: string, characterName: string, now: number): { account: AccountSave; logEntries: ActivityLogEntry[] } => {
  const activity = getActivity(activityId as ActivityId);
  let nextAccount = activity.repeatRewards.reduce(applyReward, account);
  const currentProgress = getRegionProgress(nextAccount, activityId);
  const nextTracks = { ...currentProgress.tracks };
  const discoveries: string[] = [];

  for (const track of activity.discoveryTracks) {
    const currentValue = nextTracks[track.id] ?? 0;
    if (currentValue >= track.max || Math.random() >= track.chancePerTick) {
      continue;
    }

    nextTracks[track.id] = currentValue + 1;
    discoveries.push(`${track.label} ${nextTracks[track.id]} / ${track.max}`);
  }

  const nextProgress: RegionProgressSave = {
    tracks: nextTracks,
    completed: currentProgress.completed || isRegionComplete({ ...currentProgress, tracks: nextTracks }, activityId),
  };

  const justCompleted = !currentProgress.completed && nextProgress.completed;
  nextAccount = {
    ...nextAccount,
    regionProgress: {
      ...nextAccount.regionProgress,
      [activityId]: nextProgress,
    },
  };

  const logEntries: ActivityLogEntry[] = discoveries.map((discovery) => ({
    id: crypto.randomUUID(),
    at: now,
    characterName,
    activityName: activity.name,
    result: `Discovered ${discovery}`,
  }));

  if (justCompleted) {
    logEntries.unshift({
      id: crypto.randomUUID(),
      at: now,
      characterName,
      activityName: activity.name,
      result: `Fully explored ${activity.regionName}`,
    });
  }

  return { account: nextAccount, logEntries };
};

const resolveCharacterActivity = (
  account: AccountSave,
  character: CharacterSave,
  now: number,
): { account: AccountSave; character: CharacterSave; logEntries: ActivityLogEntry[]; completed: boolean } => {
  if (!character.activity) {
    return { account, character, logEntries: [], completed: false };
  }

  const activity = getActivity(character.activity.activityId);
  const elapsedMs = Math.max(0, Math.min(now, character.activity.endsAt) - character.activity.startedAt);
  const targetResolvedTicks = Math.floor(elapsedMs / (activity.tickIntervalSeconds * 1000));
  const totalTicks = Math.floor((activity.durationMinutes * 60) / activity.tickIntervalSeconds);
  const boundedTargetTicks = Math.min(totalTicks, targetResolvedTicks);
  const ticksToResolve = Math.max(0, boundedTargetTicks - character.activity.resolvedTicks);

  let nextAccount = account;
  const logEntries: ActivityLogEntry[] = [];

  for (let index = 0; index < ticksToResolve; index += 1) {
    if (activity.module === 'explore') {
      const resolved = resolveExploreTick(nextAccount, activity.id, character.name, now);
      nextAccount = resolved.account;
      logEntries.push(...resolved.logEntries);
    }
  }

  const completed = character.activity.endsAt <= now;
  if (completed) {
    const completionLabels: string[] = [];

    for (const reward of activity.completionRewards) {
      const rewarded = applyCompletionReward(nextAccount, reward, activity.durationMinutes);
      nextAccount = rewarded.account;
      if (rewarded.label) {
        completionLabels.push(rewarded.label);
      }
    }

    if (activity.dropTable.length > 0) {
      const dropped = rollDropTable(nextAccount, activity.dropTable, now, activity.name);
      nextAccount = dropped.account;
      completionLabels.push(
        ...dropped.drops.map((dropResult) =>
          dropResult.isNew
            ? `Unlocked ${dropResult.collectionName}`
            : `Duplicate ${dropResult.collectionName} copy ${dropResult.copies}`,
        ),
      );
    }

    const suffix = completionLabels.length > 0 ? completionLabels.join(', ') : `${boundedTargetTicks} ticks resolved`;
    logEntries.unshift({
      id: crypto.randomUUID(),
      at: now,
      characterName: character.name,
      activityName: activity.name,
      result: `${activity.completionRewardLabel}. ${suffix}.`,
    });
  }

  return {
    account: nextAccount,
    character: {
      ...character,
      activity: completed
        ? null
        : {
            ...character.activity,
            resolvedTicks: boundedTargetTicks,
          },
    },
    logEntries,
    completed,
  };
};

export const resolveCompletedActivities = (account: AccountSave, now = Date.now()): AccountSave => {
  let nextAccount = account;
  const logEntries: ActivityLogEntry[] = [];
  let completedActivities = 0;

  const characters = account.characters.map((character) => {
    const resolved = resolveCharacterActivity(nextAccount, character, now);
    nextAccount = resolved.account;
    logEntries.push(...resolved.logEntries);
    if (resolved.completed) {
      completedActivities += 1;
    }
    return resolved.character;
  });

  if (logEntries.length === 0 && completedActivities === 0 && characters.every((character, index) => character === account.characters[index])) {
    return account;
  }

  return {
    ...nextAccount,
    characters,
    completedActivities: account.completedActivities + completedActivities,
    activityLog: [...logEntries, ...account.activityLog].slice(0, ACTIVITY_LOG_LIMIT),
  };
};

export const canUnlockSecondSlot = (account: AccountSave) => account.characterSlots === 1 && account.rap >= 2000;
