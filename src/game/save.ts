import { skills } from '../data/skills';
import { MAX_CHARACTER_SLOTS, normalizeRosterSlots } from './roster';
import type { AccountSave, CharacterSave, SkillId } from '../types';

const STORAGE_KEY = 'mobile-idler-save-v1';
const BACKUP_KIND = 'mobile-idler-save-backup';

type LegacyCharacterSave = CharacterSave & {
  level?: number;
  xp?: number;
};

type LegacyAccountSave = Omit<
  AccountSave,
  'schemaVersion' | 'skillXp' | 'unlockedSkillIds' | 'regionProgress' | 'characters' | 'activeCharacterId' | 'rosterSlots'
> & {
  schemaVersion: 1;
  characters: LegacyCharacterSave[];
};

type LegacyV2AccountSave = Omit<AccountSave, 'schemaVersion' | 'activeCharacterId' | 'rosterSlots'> & {
  schemaVersion: 2;
};

export const createInitialSkillXp = (): Record<SkillId, number> =>
  skills.reduce(
    (accumulator, skill) => ({
      ...accumulator,
      [skill.id]: 0,
    }),
    {} as Record<SkillId, number>,
  );

const normalizeSkillXp = (skillXp: Partial<Record<string, number>> | null | undefined): Record<SkillId, number> =>
  skills.reduce(
    (accumulator, skill) => ({
      ...accumulator,
      [skill.id]: Math.max(0, Number(skillXp?.[skill.id] ?? 0)),
    }),
    {} as Record<SkillId, number>,
  );

const normalizeCharacter = (character: LegacyCharacterSave): CharacterSave => ({
  id: character.id,
  name: character.name,
  raceId: character.raceId,
  classId: character.classId,
  activity: character.activity?.activityId === 'explore_old_road'
    ? {
        ...character.activity,
        resolvedTicks: character.activity.resolvedTicks ?? 0,
      }
    : null,
});

const normalizeAccount = (account: AccountSave): AccountSave => {
  const characters = account.characters.map(normalizeCharacter);
  const characterSlots = Math.min(MAX_CHARACTER_SLOTS, Math.max(1, account.characterSlots, characters.length));
  const rosterSlots = normalizeRosterSlots(characters, account.rosterSlots, characterSlots);
  const activeCharacterId = characters.some((character) => character.id === account.activeCharacterId)
    ? account.activeCharacterId
    : rosterSlots.find(Boolean) ?? null;

  return {
    ...account,
    characterSlots,
    characters,
    activeCharacterId,
    rosterSlots,
    skillXp: normalizeSkillXp(account.skillXp),
    unlockedSkillIds: (account.unlockedSkillIds ?? []).filter((skillId) => skills.some((skill) => skill.id === skillId)),
    regionProgress: account.regionProgress ?? {},
    updatedAt: Date.now(),
  };
};

const migrateV2ToV3 = (account: LegacyV2AccountSave): AccountSave =>
  normalizeAccount({
    ...account,
    schemaVersion: 3,
    activeCharacterId: account.characters[0]?.id ?? null,
    rosterSlots: normalizeRosterSlots(account.characters, account.characters.map((character) => character.id), account.characterSlots),
  });

const migrateV1ToV3 = (account: LegacyAccountSave): AccountSave =>
  migrateV2ToV3({
    schemaVersion: 2,
    accountName: account.accountName,
    rap: account.rap,
    characterSlots: account.characterSlots,
    characters: account.characters.map(normalizeCharacter),
    completedActivities: account.completedActivities,
    unlockedRaceClassCombos: account.unlockedRaceClassCombos,
    skillXp: createInitialSkillXp(),
    unlockedSkillIds: [],
    regionProgress: {},
    activityLog: account.activityLog,
    updatedAt: Date.now(),
  });

export const createDefaultAccount = (accountName = 'LuckyBoo'): AccountSave => ({
  schemaVersion: 3,
  accountName,
  rap: 0,
  characterSlots: 1,
  characters: [],
  activeCharacterId: null,
  rosterSlots: Array.from({ length: MAX_CHARACTER_SLOTS }, () => null),
  completedActivities: 0,
  unlockedRaceClassCombos: [],
  skillXp: createInitialSkillXp(),
  unlockedSkillIds: [],
  regionProgress: {},
  activityLog: [],
  updatedAt: Date.now(),
});

const isLegacyAccountSave = (value: unknown): value is LegacyAccountSave => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyAccountSave;
  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.accountName === 'string' &&
    typeof candidate.rap === 'number' &&
    typeof candidate.characterSlots === 'number' &&
    Array.isArray(candidate.characters) &&
    typeof candidate.completedActivities === 'number' &&
    Array.isArray(candidate.unlockedRaceClassCombos) &&
    Array.isArray(candidate.activityLog) &&
    typeof candidate.updatedAt === 'number'
  );
};

const isAccountSave = (value: unknown): value is AccountSave => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as AccountSave;
  return (
    candidate.schemaVersion === 3 &&
    typeof candidate.accountName === 'string' &&
    typeof candidate.rap === 'number' &&
    typeof candidate.characterSlots === 'number' &&
    Array.isArray(candidate.characters) &&
    (typeof candidate.activeCharacterId === 'string' || candidate.activeCharacterId === null) &&
    Array.isArray(candidate.rosterSlots) &&
    typeof candidate.completedActivities === 'number' &&
    Array.isArray(candidate.unlockedRaceClassCombos) &&
    candidate.skillXp !== null &&
    typeof candidate.skillXp === 'object' &&
    Array.isArray(candidate.unlockedSkillIds) &&
    candidate.regionProgress !== null &&
    typeof candidate.regionProgress === 'object' &&
    Array.isArray(candidate.activityLog) &&
    typeof candidate.updatedAt === 'number'
  );
};

const isV2AccountSave = (value: unknown): value is LegacyV2AccountSave => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as LegacyV2AccountSave;
  return (
    candidate.schemaVersion === 2 &&
    typeof candidate.accountName === 'string' &&
    typeof candidate.rap === 'number' &&
    typeof candidate.characterSlots === 'number' &&
    Array.isArray(candidate.characters) &&
    typeof candidate.completedActivities === 'number' &&
    Array.isArray(candidate.unlockedRaceClassCombos) &&
    candidate.skillXp !== null &&
    typeof candidate.skillXp === 'object' &&
    Array.isArray(candidate.unlockedSkillIds) &&
    candidate.regionProgress !== null &&
    typeof candidate.regionProgress === 'object' &&
    Array.isArray(candidate.activityLog) &&
    typeof candidate.updatedAt === 'number'
  );
};

const parseUnknownSave = (value: unknown): AccountSave | null => {
  if (isAccountSave(value)) {
    return normalizeAccount(value);
  }

  if (isLegacyAccountSave(value)) {
    return migrateV1ToV3(value);
  }

  if (isV2AccountSave(value)) {
    return migrateV2ToV3(value);
  }

  return null;
};

export const loadAccount = (): AccountSave | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return parseUnknownSave(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const serializeAccountBackup = (account: AccountSave) =>
  JSON.stringify(
    {
      kind: BACKUP_KIND,
      exportedAt: Date.now(),
      account,
    },
    null,
    2,
  );

export const parseAccountBackup = (raw: string): AccountSave => {
  const parsed = JSON.parse(raw) as unknown;
  const parsedObject = parsed && typeof parsed === 'object' ? (parsed as { kind?: string; account?: unknown }) : null;
  const candidate = parsedObject?.kind === BACKUP_KIND ? parsedObject.account : parsed;
  const account = parseUnknownSave(candidate);

  if (!account) {
    throw new Error('Backup is not a valid MobileIdler save.');
  }

  return {
    ...account,
    updatedAt: Date.now(),
  };
};

export const saveAccount = (account: AccountSave) => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...normalizeAccount(account),
      updatedAt: Date.now(),
    }),
  );
};

export const resetAccount = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
