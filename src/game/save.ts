import type { AccountSave } from '../types';

const STORAGE_KEY = 'mobile-idler-save-v1';
const BACKUP_KIND = 'mobile-idler-save-backup';

export const createDefaultAccount = (accountName = 'LuckyBoo'): AccountSave => ({
  schemaVersion: 1,
  accountName,
  rap: 0,
  characterSlots: 1,
  characters: [],
  completedActivities: 0,
  unlockedRaceClassCombos: [],
  activityLog: [],
  updatedAt: Date.now(),
});

export const loadAccount = (): AccountSave | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AccountSave;
    if (parsed.schemaVersion !== 1) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const isAccountSave = (value: unknown): value is AccountSave => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as AccountSave;
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

  if (!isAccountSave(candidate)) {
    throw new Error('Backup is not a valid MobileIdler save.');
  }

  return {
    ...candidate,
    updatedAt: Date.now(),
  };
};

export const saveAccount = (account: AccountSave) => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...account,
      updatedAt: Date.now(),
    }),
  );
};

export const resetAccount = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
