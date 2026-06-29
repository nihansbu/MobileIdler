import { getActivity } from './content';
import type { AccountSave, ActivityLogEntry, CharacterSave } from '../types';

export const xpForNextLevel = (level: number) => level * 100;

const awardXp = (character: CharacterSave, xp: number): CharacterSave => {
  let nextLevel = character.level;
  let nextXp = character.xp + xp;

  while (nextXp >= xpForNextLevel(nextLevel)) {
    nextXp -= xpForNextLevel(nextLevel);
    nextLevel += 1;
  }

  return {
    ...character,
    level: nextLevel,
    xp: nextXp,
  };
};

const activityXp = (activityId: string) => {
  switch (activityId) {
    case 'train_endurance':
      return 35;
    case 'fight_training_dummy':
      return 12;
    default:
      return 20;
  }
};

export const resolveCompletedActivities = (account: AccountSave, now = Date.now()): AccountSave => {
  const logEntries: ActivityLogEntry[] = [];
  const characters = account.characters.map((character) => {
    if (!character.activity || character.activity.endsAt > now) {
      return character;
    }

    const activity = getActivity(character.activity.activityId);
    const updated = awardXp(character, activityXp(activity.id));
    const gainedLevels = updated.level - character.level;
    logEntries.push({
      id: crypto.randomUUID(),
      at: now,
      characterName: character.name,
      activityName: activity.name,
      result: gainedLevels > 0 ? `${activity.rewardLabel}. Level +${gainedLevels}` : activity.rewardLabel,
    });

    return {
      ...updated,
      activity: null,
    };
  });

  if (logEntries.length === 0) {
    return account;
  }

  return {
    ...account,
    characters,
    completedActivities: account.completedActivities + logEntries.length,
    activityLog: [...logEntries, ...account.activityLog].slice(0, 20),
  };
};

export const canUnlockSecondSlot = (account: AccountSave) =>
  account.characterSlots === 1 && account.rap >= 2000;
