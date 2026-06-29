import type { AccountSave } from '../types';

const STORAGE_KEY = 'mobile-idler-save-v1';

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
