import { skills } from '../data/skills';
import type { AccountSave, SkillId } from '../types';

export const MAX_SKILL_LEVEL = 120;
export const MAX_SKILL_XP = 200_000_000;

const xpThresholds = (() => {
  const thresholds: number[] = [0, 0];
  let points = 0;

  for (let level = 1; level < MAX_SKILL_LEVEL; level += 1) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
    thresholds[level + 1] = Math.floor(points / 4);
  }

  return thresholds;
})();

export const getSkill = (skillId: SkillId) => skills.find((skill) => skill.id === skillId)!;

export const xpForLevel = (level: number) => {
  const boundedLevel = Math.max(1, Math.min(MAX_SKILL_LEVEL, level));
  return xpThresholds[boundedLevel] ?? 0;
};

export const getSkillLevelFromXp = (xp: number) => {
  const boundedXp = Math.max(0, Math.min(MAX_SKILL_XP, Math.floor(xp)));

  for (let level = MAX_SKILL_LEVEL; level >= 1; level -= 1) {
    if (boundedXp >= xpForLevel(level)) {
      return level;
    }
  }

  return 1;
};

export const getNextLevelXp = (level: number) => (level >= MAX_SKILL_LEVEL ? MAX_SKILL_XP : xpForLevel(level + 1));

export const getSkillXp = (account: AccountSave, skillId: SkillId) => account.skillXp[skillId] ?? 0;

export const getSkillLevel = (account: AccountSave, skillId: SkillId) => getSkillLevelFromXp(getSkillXp(account, skillId));

export const getTotalLevel = (account: AccountSave) =>
  skills.reduce((total, skill) => total + getSkillLevel(account, skill.id), 0);

export const isSkillUnlocked = (account: AccountSave, skillId: SkillId) => {
  const skill = getSkill(skillId);
  return !skill.unlockTotalLevel || getTotalLevel(account) >= skill.unlockTotalLevel || account.unlockedSkillIds.includes(skillId);
};

export const addSkillXp = (account: AccountSave, skillId: SkillId, amount: number): AccountSave => {
  if (!isSkillUnlocked(account, skillId) || amount <= 0) {
    return account;
  }

  return {
    ...account,
    skillXp: {
      ...account.skillXp,
      [skillId]: Math.min(MAX_SKILL_XP, getSkillXp(account, skillId) + amount),
    },
  };
};

export const getCombatLevel = (account: AccountSave) => {
  const attack = getSkillLevel(account, 'attack');
  const strength = getSkillLevel(account, 'strength');
  const defence = getSkillLevel(account, 'defence');
  const constitution = getSkillLevel(account, 'constitution');
  const ranged = getSkillLevel(account, 'ranged');
  const magic = getSkillLevel(account, 'magic');
  const prayer = getSkillLevel(account, 'prayer');
  const summoning = getSkillLevel(account, 'summoning');
  const necromancy = getSkillLevel(account, 'necromancy');
  const perception = getSkillLevel(account, 'perception');

  const base = 0.25 * (defence + Math.max(10, constitution) + Math.floor(prayer / 2) + Math.floor(summoning / 2));
  const strongestStyle = 0.325 * Math.max(attack + strength, Math.floor(ranged * 1.5), Math.floor(magic * 1.5), Math.floor(necromancy * 1.5), Math.floor(perception * 1.5));

  return Math.max(3, base + strongestStyle);
};

export const getRequirementCombatLevel = (account: AccountSave) => Math.floor(getCombatLevel(account));
