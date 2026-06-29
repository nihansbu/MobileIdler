import type { AccountSave, CharacterSave } from '../types';

export const MAX_CHARACTER_SLOTS = 7;

export const normalizeRosterSlots = (
  characters: CharacterSave[],
  rosterSlots: Array<string | null> | null | undefined,
  characterSlots: number,
): Array<string | null> => {
  const validCharacterIds = new Set(characters.map((character) => character.id));
  const usedCharacterIds = new Set<string>();
  const normalized = Array.from({ length: MAX_CHARACTER_SLOTS }, (_, index) => {
    const characterId = rosterSlots?.[index] ?? null;
    if (!characterId || !validCharacterIds.has(characterId) || usedCharacterIds.has(characterId)) {
      return null;
    }

    usedCharacterIds.add(characterId);
    return characterId;
  });

  const visibleSlots = Math.min(MAX_CHARACTER_SLOTS, Math.max(1, characterSlots, characters.length));
  for (const character of characters) {
    if (usedCharacterIds.has(character.id)) {
      continue;
    }

    const firstEmptyIndex = normalized.findIndex((slot, index) => index < visibleSlots && slot === null);
    const targetIndex = firstEmptyIndex >= 0 ? firstEmptyIndex : normalized.findIndex((slot) => slot === null);
    if (targetIndex >= 0) {
      normalized[targetIndex] = character.id;
      usedCharacterIds.add(character.id);
    }
  }

  return normalized;
};

export const getVisibleRosterSlots = (account: AccountSave) => account.rosterSlots.slice(0, account.characterSlots);

export const getRosterCharacter = (account: AccountSave, slotIndex: number) => {
  const characterId = account.rosterSlots[slotIndex];
  return characterId ? account.characters.find((character) => character.id === characterId) : undefined;
};

export const getActiveCharacter = (account: AccountSave) => {
  if (account.activeCharacterId) {
    const activeCharacter = account.characters.find((character) => character.id === account.activeCharacterId);
    if (activeCharacter) {
      return activeCharacter;
    }
  }

  const firstRosterCharacterId = account.rosterSlots.find(Boolean);
  return firstRosterCharacterId ? account.characters.find((character) => character.id === firstRosterCharacterId) : undefined;
};

export const getRosterIndexForCharacter = (account: AccountSave, characterId: string) =>
  account.rosterSlots.findIndex((slotCharacterId) => slotCharacterId === characterId);

export const findHigherPriorityIdleCharacterId = (account: AccountSave, characterId: string | null) => {
  const activeIndex = characterId ? getRosterIndexForCharacter(account, characterId) : account.characterSlots;
  const searchEnd = activeIndex >= 0 ? activeIndex : account.characterSlots;

  for (let index = 0; index < searchEnd; index += 1) {
    const character = getRosterCharacter(account, index);
    if (character && !character.activity) {
      return character.id;
    }
  }

  return null;
};

export const findLowerPriorityIdleCharacterId = (account: AccountSave, characterId: string | null) => {
  const activeIndex = characterId ? getRosterIndexForCharacter(account, characterId) : -1;
  const searchStart = activeIndex >= 0 ? activeIndex + 1 : 0;

  for (let index = searchStart; index < account.characterSlots; index += 1) {
    const character = getRosterCharacter(account, index);
    if (character && !character.activity) {
      return character.id;
    }
  }

  return null;
};

export const findNextIdleCharacterAfterStart = (account: AccountSave, startedCharacterId: string) => {
  const startedIndex = getRosterIndexForCharacter(account, startedCharacterId);
  const searchStart = startedIndex >= 0 ? startedIndex + 1 : 0;

  for (let index = searchStart; index < account.characterSlots; index += 1) {
    const character = getRosterCharacter(account, index);
    if (character && !character.activity) {
      return character.id;
    }
  }

  for (let index = 0; index < searchStart; index += 1) {
    const character = getRosterCharacter(account, index);
    if (character && !character.activity) {
      return character.id;
    }
  }

  return startedCharacterId;
};

export const moveRosterSlot = (account: AccountSave, fromIndex: number, toIndex: number): AccountSave => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= account.characterSlots ||
    toIndex >= account.characterSlots ||
    !account.rosterSlots[fromIndex]
  ) {
    return account;
  }

  const rosterSlots = [...account.rosterSlots];
  const fromCharacterId = rosterSlots[fromIndex];
  rosterSlots[fromIndex] = rosterSlots[toIndex];
  rosterSlots[toIndex] = fromCharacterId;

  return {
    ...account,
    rosterSlots,
  };
};

export const placeCharacterInRosterSlot = (account: AccountSave, characterId: string, slotIndex?: number): AccountSave => {
  const rosterSlots = [...account.rosterSlots];
  const targetIndex = slotIndex !== undefined && slotIndex >= 0 && slotIndex < account.characterSlots
    ? slotIndex
    : rosterSlots.findIndex((slot, index) => index < account.characterSlots && slot === null);

  if (targetIndex >= 0) {
    const previousIndex = rosterSlots.findIndex((slot) => slot === characterId);
    if (previousIndex >= 0) {
      rosterSlots[previousIndex] = null;
    }
    rosterSlots[targetIndex] = characterId;
  }

  return {
    ...account,
    rosterSlots,
  };
};
